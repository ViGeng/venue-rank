# Venue Rank

You can search venues at **[wgeng.site/venue-rank](https://wgeng.site/venue-rank/)**.

Venue Rank searches computer science conferences and journals and returns independent, source-specific assessments. This repository contains the reusable npm library and a static website for GitHub Pages. The Raycast extension is maintained independently in [raycast/extensions](https://github.com/raycast/extensions/pull/33381), under `extensions/venue-rank`, and consumes the `venue-rank` package. Searches run locally, and metadata ships with the code.

The published library version is 0.1.0. It currently bundles 1,347 venue identities and 1,666 assessments in dataset 2026.11.10. The CCF transcription contributes 679 assessments, and the official ICORE2026 portal contributes 987 records. Both source definitions conservatively report partial identity coverage, so a missing association is displayed as not verified. Metadata provenance and import decisions are retained in data/raw.

The verification history, including the retrospective privacy review of the published npm archive, is in docs/VALIDATION.md. The website is published at [wgeng.site/venue-rank](https://wgeng.site/venue-rank/). The library is published as [venue-rank@0.1.0](https://www.npmjs.com/package/venue-rank/v/0.1.0), and independent consumers can install it from npm.

## Roadmap

- [ ] extend to more rankings/lists
      - [ ] Tsinghua
      - [ ] HKUST
      
## You can run the website locally.

You need Node.js 22.18 or a compatible newer release, npm, and Python 3.10 or newer.

```sh
npm install
npm run dev
```

The development command builds the core library and starts the Vite website. The production command builds static files into apps/web/dist.

```sh
npm run build
```

## You can use the library without a website.

Install the published library with `npm install venue-rank`. During development, the website resolves the local workspace package.

```ts
import { searchVenues, getAssessments } from "venue-rank"

const candidates = searchVenues("sigcom")
const first = candidates[0]
if (first) {
  console.log(first.venue)
  console.log(getAssessments(first.venue.id))
}
```

The core package manifest identifies its public Git repository and the packages/core monorepo directory. The package README also links directly to its source. These additions will appear in the next npm release.

The package exports ESM, CommonJS, TypeScript declarations, and a JSON dataset. The venue-rank/engine entry point provides the search engine without importing the bundled dataset. You can supply your own VenueDataset to createCatalog.

## This repository owns the library, data, and website.

- The packages/core directory owns the shared library and bundled snapshot.
- The apps/web directory owns the static browser interface.
- The data/raw directory preserves public source snapshots and import decisions.
- The scripts directory owns deterministic metadata generation and distribution checks.

Raycast changes belong only in the extensions repository at `extensions/venue-rank`. This repository has no Raycast workspace, copied extension source, or export workflow. Shared search or dataset changes belong in the core package and reach consumers through package updates.

## You can verify the implementation.

```sh
npm run check
```

This command checks snapshot reproducibility, lint, TypeScript, library behavior, the production website, and an isolated npm package consumer. Package verification installs the generated archive into a temporary project and checks ESM, CommonJS, TypeScript declarations, and the raw JSON export. It prefers the local npm cache and can download missing package metadata or dependencies from npm. It does not query ranking services.

## You can maintain the metadata.

```sh
npm run data:build
npm run check:data
```

These commands rebuild or verify the bundle from the checked-in snapshots without accessing the network. The explicit refresh command downloads all pages from the ICORE2026 portal before rebuilding.

```sh
python3 scripts/import-data.py --fetch-core
```

The CCF snapshot is pinned to an upstream commit. A future edition should receive a new source ID, explicit provenance, and a reviewed import. The data documentation explains extension points and current identity corrections.

## Publication has separate destinations.

The core library is published on npm as venue-rank@0.1.0. Independent consumers install the published package. The static website is ready for GitHub Pages. The website uses https://wgeng.site/venue-rank/, inherited from the existing personal Pages domain. The public development repository is ViGeng/venue-rank. The deployment workflow is manually triggered. The Raycast extension was submitted in [raycast/extensions PR #33381](https://github.com/raycast/extensions/pull/33381). No public repository, npm publication, Pages deployment, or Store submission is implied by a successful local build.

The release guide in docs/RELEASING.md describes the sequence and the required publication identities. The metadata guide in docs/DATA.md explains source semantics and how to add another list. The implementation plan is in docs/PLAN.md.

## The project preserves source context.

The website uses a minimal search-first layout with the approved unframed vr lettermark and a neutral black, white, and gray palette. The bold venue and regular rank wordmark is retained, and both v. and vr design studies are preserved in docs/branding. Its light and dark themes automatically follow the system appearance, including the browser theme color and favicon. The dark theme uses layered charcoal surfaces and softened gray text instead of a near-black background with bright white text. The main view shows the search field, compact filters, and venue assessments. Source notes, coverage explanations, and dataset versions are available through Data & sources and venue details. Grade filters appear when a reference list is selected. Missing assessments retain accessible explanations even when the table displays a compact dash or N/A.

The website supports acronym and full-name search, typo tolerance, venue-type filters, source-specific grade filters, shareable URLs, venue details, reference copying, and links to the original sources. Every assessment retains its edition. Ambiguous acronyms remain multiple candidates.

CSRankings, Tsinghua, and HKUST assessments are not bundled in this edition. The core supports additional lists, including inclusion lists. Missing data is never represented as a lower grade. The NOTICE.md file preserves attribution and third-party terms.

## Search engines can read the initial page.

The production build includes the first 24 catalog results directly in its HTML, so crawlers do not need JavaScript to discover the page content. The interactive interface keeps the same search and detail behavior. The canonical URL consolidates search and filter query variants, and the build emits structured metadata, social sharing metadata, and [sitemap.xml](https://wgeng.site/venue-rank/sitemap.xml).

The root domain robots.txt allows crawling. The owner can submit the sitemap through Google Search Console after verifying the property. These changes support crawling and indexing, but they do not establish that Google has indexed the site or guarantee a search position.
