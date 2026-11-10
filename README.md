# Venue Rank

Venue Rank searches computer science conferences and journals and returns independent, source-specific assessments. It includes a reusable npm library, a static website for GitHub Pages, and a Raycast extension. Searches run locally, and metadata ships with the code.

The first local implementation targets version 0.1.0. It currently bundles 1,347 venue identities and 1,666 assessments in dataset 2026.11.10. The CCF transcription contributes 679 assessments, and the official ICORE2026 portal contributes 987 records. Both source definitions conservatively report partial identity coverage, so a missing association is displayed as not verified. Metadata provenance and import decisions are retained in data/raw.

Local verification passed all 28 tests, lint, TypeScript, static builds, isolated package installation, and both Raycast build modes. The browser search and mobile layout were also checked. Native Raycast search, detail navigation, the source-information view, and preview switching were verified locally. The Raycast Store submission is open. The GitHub repository is public. Website publication is awaiting a dedicated github.io hosting owner so the site does not inherit the personal domain. The detailed results are in docs/VALIDATION.md.

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

The following example works after the npm package has been published. During development, the website and extension resolve the local workspace package.

```ts
import { searchVenues, getAssessments } from "venue-rank"

const candidates = searchVenues("sigcom")
const first = candidates[0]
if (first) {
  console.log(first.venue)
  console.log(getAssessments(first.venue.id))
}
```

The package exports ESM, CommonJS, TypeScript declarations, and a JSON dataset. The venue-rank/engine entry point provides the search engine without importing the bundled dataset. You can supply your own VenueDataset to createCatalog.

## The project keeps a single development repository.

- The packages/core directory owns the shared library and bundled snapshot.
- The apps/web directory owns the static browser interface.
- The apps/raycast directory owns the Raycast interface and its Store manifest.
- The data/raw directory preserves public source snapshots and import decisions.
- The scripts directory owns deterministic metadata generation and distribution checks.

The Raycast interface uses a full-width results list with compact monochrome assessment text. Enter opens structured details, Command-D toggles preview, and source notes are kept behind Data & Sources.

The Raycast interface is exported into a standalone release directory before Store submission. The export bundles the shared catalog source and metadata, so Store CI does not require an npm publication or sibling checkout. The standalone directory is release/raycast/venue-rank.

## You can verify the implementation.

```sh
npm run check
```

This command checks snapshot reproducibility, lint, TypeScript, library behavior, the production website, and an isolated npm package consumer. Package verification installs the generated archive into a temporary project and checks ESM, CommonJS, TypeScript declarations, and the raw JSON export. It prefers the local npm cache and can download missing package metadata or dependencies from npm. It does not query ranking services.

```sh
npm run build:raycast
npm run prepare:raycast -- --local
```

The Raycast distribution check requires npm dependencies and can download them. Interactive Raycast verification requires the Raycast application on macOS. The official Raycast author validator confirmed the handle ViGeng.

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

The core library is prepared for npm as venue-rank@0.1.0. The static website is ready for GitHub Pages. Publication will use a dedicated github.io hosting owner, while the public development repository is ViGeng/venue-rank. The deployment workflow is manually triggered. The Raycast extension was submitted in [raycast/extensions PR #33381](https://github.com/raycast/extensions/pull/33381). No public repository, npm publication, Pages deployment, or Store submission is implied by a successful local build.

The release guide in docs/RELEASING.md describes the sequence and the required publication identities. The metadata guide in docs/DATA.md explains source semantics and how to add another list. The implementation plan is in docs/PLAN.md.

## The project preserves source context.

The website uses a minimal search-first layout with the approved unframed vr lettermark and a neutral black, white, and gray palette. The bold venue and regular rank wordmark is retained, and both v. and vr design studies are preserved in docs/branding. Its light and dark themes automatically follow the system appearance, including the browser theme color and favicon. The dark theme uses layered charcoal surfaces and softened gray text instead of a near-black background with bright white text. The main view shows the search field, compact filters, and venue assessments. Source notes, coverage explanations, and dataset versions are available through Data & sources and venue details. Grade filters appear when a reference list is selected. Missing assessments retain accessible explanations even when the table displays a compact dash or N/A.

The website supports acronym and full-name search, typo tolerance, venue-type filters, source-specific grade filters, shareable URLs, venue details, reference copying, and links to the original sources. Every assessment retains its edition. Ambiguous acronyms remain multiple candidates.

CSRankings, Tsinghua, and HKUST assessments are not bundled in this edition. The core supports additional lists, including inclusion lists. Missing data is never represented as a lower grade. The NOTICE.md file preserves attribution and third-party terms.
