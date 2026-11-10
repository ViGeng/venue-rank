# The metadata keeps each source independent.

The canonical schema is defined in packages/core/src/types.ts. A Venue has a stable ID, name, acronym, type, aliases, and an optional DBLP URL. A RankingSource identifies one edition of one list. An Assessment joins a venue to that source and retains the source's original value and source URL.

Source IDs include the edition, such as ccf-2026 and icore-2026. A future edition must not silently replace the meaning of an older source ID. The dataset version identifies the complete shipped snapshot and is separate from the npm package version.

## The engine uses four result states.

- An assessed result contains one or more explicit records from that source.
- A not-listed result means the venue has no assessment in a source whose coverage is complete.
- An unknown result means incomplete coverage prevents a conclusion about absence.
- A not-applicable result means the source does not assess that venue type.

An official Unranked record remains an assessed record with the original label Unranked. It is distinct from an absent record. Source grades are not converted into a cross-list numeric score.

## Identity joins use explicit identifiers.

The importer joins matching DBLP conference series references, or unique exact full titles only when a source has no usable DBLP reference. Conflicting explicit DBLP references are not overridden by title matches. It also applies explicit reviewed aliases for AAMAS, CODES+ISSS, ECML PKDD, and the renamed IET Software journal. Identical full titles are not enough to merge distinct ICISC and Inscrypt conferences. It does not join records by fuzzy search or acronyms. A portal record with a missing, journal-only, or shared identity can retain an icore-prefixed ID. This can produce separate candidates for related names, which is preferable to applying the wrong grade.

Both bundled sources use partial coverage because their cross-source identity associations have not been exhaustively reviewed. The ICORE raw snapshot itself contains all 987 portal records. Partial identity coverage does not mean that pages were omitted.

## The importer records corrections.

- The Inscrypt alias that points at the distinct ICISC conference is omitted because its CCF association is ambiguous. The official ICORE ICISC record remains independent.
- The Parallel Computing journal alias that points at the unrelated ParCo conference is skipped, while its proper journal entry is retained.
- The malformed TIOT row is repaired using its explicitly embedded DBLP fields.
- The HotSec workshop is kept separate from USENIX Security even though upstream uses the same broad directory.
- The ISMB conference is kept separate from the Bioinformatics journal in which its proceedings are published.
- Duplicate spellings with the same stable DBLP identity and assessment are retained as aliases.

The data/raw/import-decisions.json file records individual corrections. The CCF upstream source and commit are recorded in data/raw/ccf-2026.json. The ICORE snapshot records source page URLs and page hashes in data/raw/icore-2026.json. The deterministic import check fails when the generated bundle differs from these snapshots.

## Another list can be added as data.

To add a new list, you should create a source definition with its own edition and provenance, map records to explicit venue IDs, and append its assessments. You can set kind to inclusion for a source that selects venues without assigning grades. Its labels can be source-specific strings such as Included. You should use partial coverage until both completeness and identity associations are established.

```ts
import { bundledDataset, createCatalog } from "venue-rank"

const customCatalog = createCatalog({
  ...bundledDataset,
  version: "2026.11.10+local",
  sources: [...bundledDataset.sources, {
    id: "local-list-2026",
    name: "Local List",
    edition: "2026",
    kind: "inclusion",
    labels: ["Included"],
    appliesTo: ["conference"],
    coverage: "partial",
    publisherUrl: "https://example.org/list",
    dataUrl: "https://example.org/list/data.json",
    retrievedAt: "2026-11-10",
    note: "This example contains one manually verified association.",
  }],
  assessments: [...bundledDataset.assessments, {
    venueId: "conf:sigcomm",
    sourceId: "local-list-2026",
    value: "Included",
    url: "https://example.org/list/sigcomm",
  }],
})
console.log(customCatalog.getAssessments("conf:sigcomm"))
```

The search engine, website assessment columns and filters, and Raycast details render configured sources generically. Adding a bundled source does not require changing their assessment rendering logic.

Before redistributing another dataset, you should establish the exact publisher, edition, and applicable reuse terms. CSRankings is deliberately not imported because its published FAQ describes restrictive redistribution terms. Tsinghua and HKUST require a specific source and edition before import.
