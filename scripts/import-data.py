from pathlib import Path
from datetime import datetime, timezone
from html.parser import HTMLParser
from urllib.parse import urlsplit, urlencode
from concurrent.futures import ThreadPoolExecutor
import argparse
import hashlib
import json
import re
import urllib.request

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / 'data/raw'
OUTPUT = ROOT / 'packages/core/src/data/snapshot.json'
DATE = datetime.now(timezone.utc).date().isoformat()
CORE_BASE = 'https://portal.core.edu.au/conf-ranks/'

class PortalParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows = []
        self.row = None
        self.cell = None
        self.pages = {1}
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a':
            href = attrs.get('href', '')
            page = re.search(r"jumpPage\('([0-9]+)'\)", href)
            if page: self.pages.add(int(page.group(1)))
            if self.cell is not None and 'dblp' in href: self.cell['dblp'] = href
        if tag == 'tr':
            match = re.search(r"navigate\('/conf-ranks/([0-9]+)/'\)", attrs.get('onclick', ''))
            if match: self.row = {'id': match.group(1), 'cells': []}
        if tag == 'td' and self.row is not None: self.cell = {'text': ''}
    def handle_data(self, data):
        if self.cell is not None: self.cell['text'] += data
    def handle_endtag(self, tag):
        if tag == 'td' and self.cell is not None:
            self.cell['text'] = ' '.join(self.cell['text'].split())
            self.row['cells'].append(self.cell)
            self.cell = None
        if tag == 'tr' and self.row is not None:
            cells = self.row['cells']
            if len(cells) >= 7:
                self.rows.append({
                    'id': self.row['id'], 'name': cells[0]['text'], 'acronym': cells[1]['text'],
                    'edition': cells[2]['text'], 'rank': cells[3]['text'],
                    'dblp': cells[5].get('dblp'), 'area': cells[6]['text']
                })
            self.row = None

def fetch_page(page):
    url = CORE_BASE + '?' + urlencode({'search': '', 'by': 'all', 'source': 'ICORE2026', 'sort': 'atitle', 'page': page})
    with urllib.request.urlopen(url, timeout=30) as response: html = response.read().decode()
    parser = PortalParser()
    parser.feed(html)
    if not parser.rows: raise ValueError(f'The portal returned no records for page {page}.')
    if any(row['edition'] != 'ICORE2026' for row in parser.rows): raise ValueError('The portal returned an unexpected edition.')
    return parser, {'page': page, 'url': url, 'sha256': hashlib.sha256(html.encode()).hexdigest()}

def fetch_core():
    first, evidence = fetch_page(1)
    rows = first.rows[:]
    pages = [evidence]
    with ThreadPoolExecutor(max_workers=3) as pool:
        for parser, evidence in pool.map(fetch_page, range(2, max(first.pages) + 1)):
            rows.extend(parser.rows)
            pages.append(evidence)
    if len({r['id'] for r in rows}) != len(rows): raise ValueError('The portal returned duplicate records across pages.')
    if len(rows) < 900: raise ValueError('The portal snapshot is unexpectedly small.')
    payload = {'edition': 'ICORE2026', 'retrievedAt': DATE, 'pages': pages, 'rows': rows}
    (RAW / 'icore-2026.json').write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')
    print(f'Downloaded {len(rows)} ICORE records from {len(pages)} pages.', flush=True)

def normalized(text): return re.sub(r'[^a-z0-9]+', '', text.casefold())

def dblp_key(url):
    if not url: return None
    path = urlsplit(url).path.removeprefix('/db/').strip('/')
    path = re.sub(r'/index\.html$', '', path)
    pieces = path.split('/')
    if len(pieces) < 2 or pieces[0] not in ('conf', 'journals'): return None
    return pieces[0] + ':' + '/'.join(pieces[1:])

def build():
    ccf = json.loads((RAW / 'ccf-2026.json').read_text())
    core = json.loads((RAW / 'icore-2026.json').read_text())
    venues = {}
    identity_aliases = {'conf:ifaamas': 'conf:atal', 'conf:codesisss': 'conf:codes', 'conf:pkdd': 'conf:ecml', 'journals:iee': 'journals:iet-sen'}
    assessments = []
    decisions = []
    for index, row in enumerate(ccf['rows']):
        rank, acronym, name, series, record = (row + [''] * 5)[:5]
        rank = rank.strip()
        if acronym == 'TIOT':
            name, series, record = 'ACM Transactions on Internet of Things', '/journals/tiot', '/journals/tiot/tiot'
            decisions.append({'upstreamRow': index, 'action': 'repair', 'reason': 'The upstream TIOT row uses spaces instead of tabs before its DBLP fields.'})
        if acronym == 'ISMB':
            series, record = '/conf/ismb', '/conf/ismb/ismb'
            decisions.append({'upstreamRow': index, 'action': 'separate', 'reason': 'ISMB is a conference published in Bioinformatics. Its assessment does not belong to the Bioinformatics journal.'})
        if rank not in ('A', 'B', 'C'): continue
        if series == '/conf/icisc' and acronym == 'Inscrypt':
            decisions.append({'upstreamRow': index, 'action': 'skip', 'reason': 'The upstream Inscrypt alias points at the distinct ICISC series. This ambiguous CCF association is omitted. The official ICORE ICISC record remains independent.'})
            continue
        # This upstream alias points a journal title at an unrelated conference.
        if series == '/conf/parco' and name == 'Parallel Computing':
            decisions.append({'upstreamRow': index, 'action': 'skip', 'reason': 'The journal also has its correct /journals/pc entry. /conf/parco identifies a different conference.'})
            continue
        key = dblp_key('https://dblp.org/db' + series) if series else None
        if acronym == 'HotSec':
            key = 'conf:uss/hotsec'
            decisions.append({'upstreamRow': index, 'action': 'separate', 'reason': 'HotSec is a workshop and must not inherit the USENIX Security main conference grade.'})
        if key in identity_aliases:
            decisions.append({'upstreamRow': index, 'action': 'alias', 'reason': key + ' is an explicitly reviewed alias of ' + identity_aliases[key] + '.'})
            key = identity_aliases[key]
        if not key: key = 'ccf:' + normalized(name)
        venue = {'id': key, 'name': name.strip(), 'acronym': acronym.strip(), 'type': 'journal' if series.startswith('/journals/') or (not series and not any(word in name.lower() for word in ('conference', 'symposium', 'workshop'))) else 'conference', 'aliases': []}
        if series: venue['dblp'] = 'https://dblp.org/db/' + key.replace(':', '/', 1) + '/'
        if key in venues:
            prior = venues[key]
            old = next(a for a in assessments if a['venueId'] == key and a['sourceId'] == 'ccf-2026')
            if prior['type'] != venue['type'] or old['value'] != rank:
                raise ValueError(f'CCF identity collision needs an explicit mapping: {key}, {name}')
            if acronym and acronym != prior['acronym']: prior['aliases'].append(acronym)
            if name != prior['name']: prior['aliases'].append(name)
            continue
        venues[key] = venue
        assessments.append({'venueId': key, 'sourceId': 'ccf-2026', 'value': rank, 'url': 'https://www.ccf.org.cn/Academic_Evaluation/By_category/'})

    # These aliases refer to established former names, not inferred fuzzy matches.
    aliases = {
        'conf:nips': ['NeurIPS', 'NIPS'],
        'conf:usenix': ['USENIX ATC', 'USENIX Annual Technical Conference', 'ATC'],
        'conf:uss': ['USENIX Security', 'USENIX Security Symposium'],
        'conf:sp': ['IEEE S&P', 'IEEE Symposium on Security and Privacy', 'Oakland'],
        'conf:sigsoft': ['FSE', 'ESEC/FSE'],
        'journals:iotj': ['IEEE IoT Journal', 'IoT-J'],
    }
    for key, names in aliases.items():
        if key in venues: venues[key]['aliases'].extend(names)
    exact_titles = {}
    for venue in venues.values(): exact_titles.setdefault(normalized(venue['name']), []).append(venue['id'])
    unlinked = 0
    core_seen = set()
    for row in core['rows']:
        key = dblp_key(row['dblp'])
        key = identity_aliases.get(key, key)
        if key and not key.startswith('conf:'): key = None
        if not key:
            same = [key for key in exact_titles.get(normalized(row['name']), []) if venues[key]['type'] == 'conference']
            if len(same) == 1: key = same[0]
        # Missing or shared DBLP references retain their own stable portal identity.
        if not key or key in core_seen: key = 'icore:' + row['id']
        core_seen.add(key)
        if key not in venues:
            venue = {'id': key, 'name': row['name'], 'acronym': row['acronym'] if row['acronym'] != 'N/A' else '', 'type': 'conference', 'aliases': []}
            if row['dblp']: venue['dblp'] = row['dblp']
            venues[key] = venue
            unlinked += 1
        else:
            venue = venues[key]
            if row['name'] != venue['name']: venue['aliases'].append(row['name'])
            if row['acronym'] and row['acronym'] != venue['acronym']: venue['aliases'].append(row['acronym'])
        assessment = {'venueId': key, 'sourceId': 'icore-2026', 'value': row['rank'], 'url': CORE_BASE + row['id'] + '/'}
        if row['area'] not in ('0', 'N/A', ''): assessment['area'] = row['area']
        assessments.append(assessment)
    for venue in venues.values(): venue['aliases'] = sorted(set(venue['aliases']) - {venue['name'], venue['acronym']})
    labels = sorted({r['rank'] for r in core['rows']})
    sources = [
        {'id': 'ccf-2026', 'name': 'CCF', 'edition': '2026', 'kind': 'grade', 'labels': ['A', 'B', 'C'], 'appliesTo': ['conference', 'journal'], 'coverage': 'partial', 'publisherUrl': 'https://www.ccf.org.cn/Academic_Evaluation/By_category/', 'dataUrl': ccf['upstream'], 'retrievedAt': ccf['retrievedAt'], 'revision': ccf['revision'], 'note': 'The 2026 community transcription is provided by CCFrank. Its completeness has not been independently audited, so missing assessments are not verified. Conference grades refer to the main eligible publication track.'},
        {'id': 'icore-2026', 'name': 'CORE / ICORE', 'edition': 'ICORE2026', 'kind': 'grade', 'labels': labels, 'appliesTo': ['conference'], 'coverage': 'partial', 'publisherUrl': CORE_BASE, 'dataUrl': core['pages'][0]['url'], 'retrievedAt': core['retrievedAt'], 'note': 'The official ICORE2026 portal snapshot includes all ' + str(len(core['rows'])) + ' records. Identities are joined only by exact DBLP references or exact titles. Unresolved associations remain separate, so missing assessments are not verified. Original labels such as Unranked are retained.'},
    ]
    payload = {'schemaVersion': 1, 'version': max(source['retrievedAt'] for source in sources).replace('-', '.'), 'venues': sorted(venues.values(), key=lambda v: v['id']), 'sources': sources, 'assessments': sorted(assessments, key=lambda a: (a['venueId'], a['sourceId']))}
    serialized = json.dumps(payload, ensure_ascii=False, indent=2) + '\n'
    return serialized, decisions

def main():
    parser = argparse.ArgumentParser(description='Build bundled metadata from pinned, local public source snapshots.')
    parser.add_argument('--fetch-core', action='store_true', help='Download the full current ICORE2026 portal snapshot before rebuilding.')
    parser.add_argument('--check', action='store_true', help='Verify that the committed bundle matches the local snapshots without network access.')
    args = parser.parse_args()
    if args.fetch_core and args.check: parser.error('--fetch-core and --check cannot be combined.')
    if args.fetch_core: fetch_core()
    content, decisions = build()
    if args.check:
        if OUTPUT.read_text() != content: raise SystemExit('The bundled dataset is stale. Run npm run data:build.')
        print('The bundled dataset matches the source snapshots.')
    else:
        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT.write_text(content)
        (RAW / 'import-decisions.json').write_text(json.dumps(decisions, indent=2) + '\n')
        data = json.loads(content)
        print(f'Built {len(data["venues"])} venues and {len(data["assessments"])} assessments.')

if __name__ == '__main__': main()
