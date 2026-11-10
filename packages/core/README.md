# Venue Rank

Venue Rank provides local fuzzy search for computer science conferences and journals, with versioned CCF and CORE / ICORE metadata. It has no UI dependency and makes no runtime network requests.

```ts
import { searchVenues, getVenue, getAssessments } from "venue-rank"

const candidates = searchVenues("sigcom", { limit: 10 })
const venue = getVenue("conf:sigcomm")
const assessments = getAssessments("conf:sigcomm")
console.log(candidates, venue, assessments)
```

You can pass type, sourceId, and value filters to searchVenues. A value filter requires a sourceId because different grading schemes are independent. Search candidates include a match category and a relevance score, where a smaller score ranks earlier.

```ts
import { bundledDataset, createCatalog } from "venue-rank"
import { createCatalog as createCustomCatalog } from "venue-rank/engine"
import type { VenueDataset } from "venue-rank"

const catalog = createCatalog(bundledDataset)
function useCustomData(data: VenueDataset) {
  return createCustomCatalog(data)
}
console.log(catalog.search("NeurIPS"), useCustomData)
```

The engine entry point does not import the bundled dataset. You can add sources and assessments by constructing a VenueDataset with a unique source ID for each edition. createCatalog validates references and takes a copy of its input. Returned catalog records are read-only by contract.

Each assessment result has an assessed, not-listed, unknown, or not-applicable status. Only sources with complete coverage can establish not-listed. The bundled sources conservatively retain partial identity coverage. A conference-only list does not apply to a journal.

The venue-rank/data export exposes the raw JSON snapshot. This package includes ESM and CommonJS entry points and TypeScript declarations for each. The LICENSE and NOTICE.md files describe project licensing and source attribution.
