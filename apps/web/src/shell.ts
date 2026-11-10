import type { AssessmentResult, VenueCatalog } from "venue-rank"

export function assessmentLabel(result: AssessmentResult): string {
  if (result.status === "assessed") return result.assessments.map(a => a.value).join(" / ")
  return { "not-listed": "Not listed", unknown: "Not verified", "not-applicable": "Not applicable" }[result.status]
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!)
}

export function renderShell(brandMark: string): string {
  return `
  <header class="site-header shell">
    <a class="brand" href="./" aria-label="Venue Rank home"><span class="brand-mark" aria-hidden="true">${brandMark}</span><span>venue<span class="brand-light">rank</span></span></a>
    <button class="text-button" id="about-button">Data & sources</button>
  </header>
  <main class="shell">
    <h1 class="sr-only">Computer science conference and journal rankings</h1>
    <section class="search-section" aria-label="Search venues">
      <label class="search-box" for="venue-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 5 5"></path></svg><span class="sr-only">Search venues</span><input id="venue-search" type="search" placeholder="Search a venue name or acronym…" autocomplete="off" spellcheck="false" /></label>
      <div class="filter-bar">
        <div class="filters">
          <label><span class="sr-only">Venue type</span><select id="type-filter"><option value="all">All venues</option><option value="conference">Conferences</option><option value="journal">Journals</option></select></label>
          <label><span class="sr-only">Reference list</span><select id="source-filter"><option value="all">All lists</option></select></label>
          <label id="grade-control" hidden><span class="sr-only">Assessment</span><select id="grade-filter" disabled><option value="all">All assessments</option></select></label>
          <button class="text-button reset" id="reset-button" hidden>Reset filters</button>
        </div>
        <p id="result-count" role="status" aria-live="polite"></p>
      </div>
    </section>
    <section class="results-section" aria-labelledby="results-title">
      <h2 id="results-title" class="sr-only">Venue results</h2>
      <div class="table-wrap"><table><thead><tr><th scope="col">Venue</th></tr></thead><tbody id="results"></tbody></table></div>
      <div id="empty-state" class="empty-state" hidden><h3>No matching venues were found.</h3><p>Try another name or clear the filters.</p><button class="secondary-button" id="empty-reset">Clear the search</button></div>
      <button class="load-more secondary-button" id="load-more" hidden>Show more venues</button>
    </section>
  </main>
  <dialog id="detail-dialog" aria-labelledby="detail-title"><div class="dialog-header"><button class="close-button" id="close-detail" aria-label="Close venue details">×</button></div><div id="detail-content"></div></dialog>
  <dialog id="about-dialog" aria-labelledby="about-title"><div class="dialog-header"><h2 id="about-title">Data & sources</h2><button class="close-button" id="close-about" aria-label="Close data information">×</button></div><p class="dialog-intro">Each list keeps its own assessment scale. A dash means the assessment is not verified. N/A means the list does not apply to that venue type.</p><div id="source-information"></div><p class="about-scope">CSRankings, Tsinghua, and HKUST assessments are not included in this edition.</p><p class="dataset-line" id="about-version"></p></dialog>
  <noscript><p class="shell">Venue Rank compares source-specific CCF and CORE / ICORE assessments. The table shows the first 24 venues in the bundled snapshot. Enable JavaScript to search the full catalog and open source details.</p></noscript>
`
}

export function renderStaticShell(brandMark: string, catalog: VenueCatalog): string {
  const rows = catalog.search("", { limit: 24 }).map(({ venue }) => {
    const identity = `<td class="venue-cell"><button class="venue-button"><strong class="venue-acronym">${escapeHtml(venue.acronym || venue.name)}</strong>${venue.acronym ? `<span class="venue-name">${escapeHtml(venue.name)}</span>` : ""}</button></td>`
    const assessments = catalog.getAssessments(venue.id).map(result => {
      const value = result.status === "unknown" ? "–" : result.status === "not-applicable" ? "N/A" : assessmentLabel(result)
      return `<td class="assessment-cell"><span class="grade-badge${result.status === "assessed" ? "" : " grade-unknown"}" aria-label="${escapeHtml(`${result.source.name}: ${assessmentLabel(result)}`)}">${escapeHtml(value)}</span></td>`
    }).join("")
    return `<tr>${identity}${assessments}</tr>`
  }).join("")
  const headers = '<th scope="col">Venue</th>' + catalog.dataset.sources.map(source => `<th scope="col">${escapeHtml(source.name)} <span>${escapeHtml(source.edition.replace(/^ICORE/, ""))}</span></th>`).join("")
  return renderShell(brandMark)
    .replace('<tbody id="results"></tbody>', `<tbody id="results">${rows}</tbody>`)
    .replace('<th scope="col">Venue</th>', headers)
    .replace('<p id="result-count" role="status" aria-live="polite"></p>', `<p id="result-count" role="status" aria-live="polite">${catalog.dataset.venues.length.toLocaleString("en-US")} venues match.</p>`)
}
