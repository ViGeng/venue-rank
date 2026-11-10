import { describe, expect, it } from "vitest"
import { bundledDataset, createCatalog, getAssessments, getVenue, normalizeVenueQuery, searchVenues, validateDataset } from "../src/index"
import type { VenueDataset } from "../src/types"

function fixture(): VenueDataset {
  return {
    schemaVersion: 1, version: "test.1",
    venues: [
      { id: "conf:sec", name: "Conference on Secure Systems", acronym: "SEC", type: "conference", aliases: ["Secure Systems"] },
      { id: "conf:edge", name: "Symposium on Edge Computing", acronym: "SEC", type: "conference", aliases: [] },
      { id: "journal:sec", name: "Secure Computing Journal", acronym: "SCJ", type: "journal", aliases: [] },
    ],
    sources: [
      { id: "list-a-2026", name: "List A", edition: "2026", kind: "grade", labels: ["A", "B", "C"], appliesTo: ["conference", "journal"], coverage: "complete", publisherUrl: "https://example.org/a", dataUrl: "https://example.org/a/data", retrievedAt: "2026-11-10", note: "This test source is complete." },
      { id: "list-b-2025", name: "List B", edition: "2025", kind: "inclusion", labels: ["Included"], appliesTo: ["conference"], coverage: "partial", publisherUrl: "https://example.org/b", dataUrl: "https://example.org/b/data", retrievedAt: "2026-11-10", note: "This test source is partial." },
    ],
    assessments: [
      { venueId: "conf:sec", sourceId: "list-a-2026", value: "A", url: "https://example.org/a/sec" },
      { venueId: "conf:edge", sourceId: "list-a-2026", value: "C", url: "https://example.org/a/edge" },
      { venueId: "conf:sec", sourceId: "list-b-2025", value: "Included", url: "https://example.org/b/sec" },
    ],
  }
}

describe("venue search", () => {
  it("retains all exact matches for an ambiguous acronym", () => {
    const results = createCatalog(fixture()).search("SEC")
    expect(results.filter(r => r.match === "exact").map(r => r.venue.id).sort()).toEqual(["conf:edge", "conf:sec"])
  })
  it("recognizes exact aliases before fuzzy matches", () => {
    const [first] = createCatalog(fixture()).search("secure systems")
    expect(first?.venue.id).toBe("conf:sec")
    expect(first?.match).toBe("exact")
  })
  it("normalizes case, punctuation, accents, and spacing", () => {
    expect(normalizeVenueQuery("  IEEE S&P  ")).toBe("ieee s p")
    expect(normalizeVenueQuery("Café\tSystems")).toBe("cafe systems")
  })
  it("finds a misspelled acronym through Fuse.js", () => {
    expect(searchVenues("sigcom")[0]?.venue.id).toBe("conf:sigcomm")
  })
  it("finds a substring near the end of a long full name", () => {
    expect(searchVenues("communication").some(r => r.venue.id === "conf:sigcomm")).toBe(true)
  })
  it("filters by venue type", () => {
    const results = createCatalog(fixture()).search("", { type: "journal" })
    expect(results.map(r => r.venue.id)).toEqual(["journal:sec"])
  })
  it("applies a source-specific grade filter", () => {
    const results = createCatalog(fixture()).search("SEC", { sourceId: "list-a-2026", value: "C" })
    expect(results.map(r => r.venue.id)).toEqual(["conf:edge"])
  })
  it("requires a source when filtering by grade", () => {
    expect(() => createCatalog(fixture()).search("", { value: "A" })).toThrow("source")
  })
  it("handles empty searches and zero limits predictably", () => {
    expect(createCatalog(fixture()).search("")).toHaveLength(3)
    expect(createCatalog(fixture()).search("SEC", { limit: 0 })).toEqual([])
    expect(() => createCatalog(fixture()).search("", { limit: -1 })).toThrow("limit")
  })
  it("returns no results for an unrelated query", () => {
    expect(searchVenues("zzzxxyyqqww987654321")).toEqual([])
  })
  it("does not let a caller mutation invalidate the search index", () => {
    const input = structuredClone(fixture())
    const catalog = createCatalog(input)
    Object.assign(input.venues[0]!, { name: "Changed", acronym: "OTHER" })
    expect(catalog.search("SEC").filter(r => r.match === "exact")).toHaveLength(2)
    expect(catalog.getVenue("conf:sec")?.name).toBe("Conference on Secure Systems")
  })
})

describe("source semantics", () => {
  it("keeps inclusion records distinct from grades", () => {
    const result = createCatalog(fixture()).getAssessments("conf:sec")[1]
    expect(result?.source.kind).toBe("inclusion")
    expect(result?.assessments[0]?.value).toBe("Included")
  })
  it("distinguishes absence in a complete list from unknown partial coverage", () => {
    expect(createCatalog(fixture()).getAssessments("conf:edge")[1]?.status).toBe("unknown")
    expect(createCatalog(fixture()).getAssessments("journal:sec")[0]?.status).toBe("not-listed")
  })
  it("reports a conference-only list as not applicable to journals", () => {
    expect(createCatalog(fixture()).getAssessments("journal:sec")[1]?.status).toBe("not-applicable")
  })
  it("does not create venues or assessments for unknown IDs", () => {
    expect(getVenue("missing")).toBeUndefined()
    expect(getAssessments("missing")).toEqual([])
  })
  it("accepts an additional independently versioned list without engine changes", () => {
    const input = structuredClone(fixture())
    const extraSource = { ...input.sources[0]!, id: "local-2026", name: "Local List", labels: ["Preferred"] }
    const catalog = createCatalog({ ...input, sources: [...input.sources, extraSource], assessments: [...input.assessments, { venueId: "conf:edge", sourceId: "local-2026", value: "Preferred", url: "https://example.org/local" }] })
    expect(catalog.search("", { sourceId: "local-2026" })[0]?.venue.id).toBe("conf:edge")
    expect(catalog.getAssessments("conf:edge")[2]?.assessments[0]?.value).toBe("Preferred")
  })
})

describe("metadata validation", () => {
  it("validates the complete bundled metadata without network access", () => {
    expect(() => validateDataset(bundledDataset)).not.toThrow()
    expect(bundledDataset.venues.length).toBeGreaterThan(1000)
    expect(bundledDataset.assessments.filter(a => a.sourceId === "icore-2026")).toHaveLength(987)
  })
  it("rejects duplicate venue IDs", () => {
    const input = fixture()
    expect(() => createCatalog({ ...input, venues: [...input.venues, input.venues[0]!] })).toThrow("Duplicate venue")
  })
  it("rejects dangling assessment references", () => {
    const input = fixture()
    expect(() => createCatalog({ ...input, assessments: [{ venueId: "missing", sourceId: "list-a-2026", value: "A", url: "https://example.org" }] })).toThrow("Unknown assessment reference")
  })
  it("rejects duplicate assessments for the same venue, source, and area", () => {
    const input = fixture()
    expect(() => createCatalog({ ...input, assessments: [...input.assessments, input.assessments[0]!] })).toThrow("Duplicate assessment")
  })
  it("rejects grades not defined by their source", () => {
    const input = fixture()
    expect(() => createCatalog({ ...input, assessments: [{ ...input.assessments[0]!, value: "A*" }] })).toThrow("Invalid assessment")
  })
  it("rejects unsafe source links", () => {
    const input = fixture()
    expect(() => createCatalog({ ...input, sources: [{ ...input.sources[0]!, publisherUrl: "javascript:alert(1)" }] })).toThrow("Invalid source")
  })
  it("preserves multiple field-specific assessments", () => {
    const input = fixture()
    const catalog = createCatalog({ ...input, assessments: [...input.assessments, { ...input.assessments[0]!, area: "Systems", value: "B" }] })
    expect(catalog.getAssessments("conf:sec")[0]?.assessments).toHaveLength(2)
  })
  it("does not conflate HotSec with the main USENIX Security venue", () => {
    expect(getAssessments("conf:uss").find(a => a.source.id === "ccf-2026")?.assessments[0]?.value).toBe("A")
    expect(getAssessments("conf:uss/hotsec").find(a => a.source.id === "ccf-2026")?.assessments[0]?.value).toBe("C")
  })
  it("keeps the Bioinformatics journal and ISMB conference separate", () => {
    expect(getVenue("journals:bioinformatics")?.type).toBe("journal")
    expect(getVenue("conf:ismb")?.type).toBe("conference")
    expect(getAssessments("journals:bioinformatics").find(a => a.source.id === "icore-2026")?.status).toBe("not-applicable")
  })
  it("deduplicates reviewed AAMAS conference aliases while retaining the journal", () => {
    const exact = searchVenues("AAMAS", { limit: 100 }).filter(r => r.match === "exact")
    expect(exact.filter(r => r.venue.type === "conference")).toHaveLength(1)
    expect(exact.filter(r => r.venue.type === "journal")).toHaveLength(1)
  })
  it("preserves distinct conferences with the same full title", () => {
    expect(getVenue("conf:cisc")).toBeDefined()
    expect(getVenue("conf:icisc")).toBeDefined()
    expect(getVenue("conf:cisc")?.acronym).not.toBe(getVenue("conf:icisc")?.acronym)
    expect(getAssessments("conf:icisc").find(a => a.source.id === "ccf-2026")?.status).toBe("unknown")
  })
  it("repairs the malformed upstream Internet of Things journal row", () => {
    expect(getVenue("journals:tiot")?.name).toBe("ACM Transactions on Internet of Things")
    expect(getVenue("journals:tiot")?.type).toBe("journal")
  })
})
