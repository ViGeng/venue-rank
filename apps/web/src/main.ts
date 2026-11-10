import { getDefaultCatalog } from "venue-rank"
import type { AssessmentResult, Venue, SearchOptions } from "venue-rank"
import brandMark from "./brand-mark.svg?raw"
import "./style.css"

const catalog = getDefaultCatalog()
const dataset = catalog.dataset
const app = document.querySelector<HTMLDivElement>("#app")!
app.innerHTML = `
  <header class="site-header shell">
    <a class="brand" href="./" aria-label="Venue Rank home"><span class="brand-mark" aria-hidden="true">${brandMark}</span><span>venue<span class="brand-light">rank</span></span></a>
    <button class="text-button" id="about-button">Data & sources</button>
  </header>
  <main class="shell">
    <h1 class="sr-only">Search venues</h1>
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
`

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className = "", text = ""): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  node.className = className
  node.textContent = text
  return node
}
function select<T extends HTMLElement>(id: string): T { return document.getElementById(id) as T }
const input = select<HTMLInputElement>("venue-search")
const typeFilter = select<HTMLSelectElement>("type-filter")
const sourceFilter = select<HTMLSelectElement>("source-filter")
const gradeFilter = select<HTMLSelectElement>("grade-filter")
const detailDialog = select<HTMLDialogElement>("detail-dialog")
const aboutDialog = select<HTMLDialogElement>("about-dialog")
let visible = 24
let selectedId: string | undefined

function externalLink(text: string, url: string): HTMLAnchorElement {
  const link = element("a", "source-link", text)
  link.href = url
  link.target = "_blank"
  link.rel = "noopener noreferrer"
  return link
}

function assessmentLabel(result: AssessmentResult): string {
  if (result.status === "assessed") return result.assessments.map(a => a.value).join(" / ")
  return { "not-listed": "Not listed", unknown: "Not verified", "not-applicable": "Not applicable" }[result.status]
}

function gradeBadge(result: AssessmentResult): HTMLElement {
  const value = assessmentLabel(result)
  const compactValue = result.status === "unknown" ? "–" : result.status === "not-applicable" ? "N/A" : value
  const badge = element("span", "grade-badge", compactValue)
  badge.setAttribute("aria-label", `${result.source.name}: ${value}`)
  if (result.status === "assessed") {
    badge.title = `${result.source.name} · ${result.source.edition}: ${value}`
  } else {
    badge.classList.add("grade-unknown")
    badge.title = result.status === "not-applicable" ? "This list does not assess this venue type." : result.source.note
  }
  return badge
}

function syncUrl(): void {
  const params = new URLSearchParams()
  if (input.value.trim()) params.set("q", input.value.trim())
  if (typeFilter.value !== "all") params.set("type", typeFilter.value)
  if (sourceFilter.value !== "all") params.set("source", sourceFilter.value)
  if (gradeFilter.value !== "all") params.set("grade", gradeFilter.value)
  if (selectedId) params.set("venue", selectedId)
  const suffix = params.toString()
  history.replaceState(null, "", location.pathname + (suffix ? `?${suffix}` : ""))
}

function setGradeOptions(value = "all"): void {
  gradeFilter.replaceChildren(new Option("All assessments", "all"))
  const source = dataset.sources.find(source => source.id === sourceFilter.value)
  gradeFilter.disabled = !source
  select("grade-control").hidden = !source
  for (const label of source?.labels ?? []) gradeFilter.add(new Option(label, label))
  gradeFilter.value = source?.labels.includes(value) ? value : "all"
}

function render(): void {
  const options: SearchOptions = {
    limit: dataset.venues.length,
    ...(typeFilter.value === "all" ? {} : { type: typeFilter.value as Venue["type"] }),
    ...(sourceFilter.value === "all" ? {} : { sourceId: sourceFilter.value }),
    ...(gradeFilter.value === "all" ? {} : { value: gradeFilter.value }),
  }
  const matches = catalog.search(input.value, options)
  const tbody = select<HTMLTableSectionElement>("results")
  const fragment = document.createDocumentFragment()
  for (const { venue } of matches.slice(0, visible)) {
    const row = element("tr")
    const identity = element("td", "venue-cell")
    const button = element("button", "venue-button")
    button.append(element("strong", "venue-acronym", venue.acronym || venue.name))
    if (venue.acronym) button.append(element("span", "venue-name", venue.name))
    button.addEventListener("click", () => openVenue(venue.id))
    identity.append(button)
    row.append(identity)
    for (const result of catalog.getAssessments(venue.id)) {
      const cell = element("td", "assessment-cell")
      cell.append(gradeBadge(result))
      row.append(cell)
    }
    fragment.append(row)
  }
  tbody.replaceChildren(fragment)
  select("result-count").textContent = `${matches.length.toLocaleString()} ${matches.length === 1 ? "venue matches" : "venues match"}.`
  select("empty-state").hidden = matches.length > 0
  select("load-more").hidden = matches.length <= visible
  select("reset-button").hidden = !input.value && typeFilter.value === "all" && sourceFilter.value === "all"
  syncUrl()
}

function openVenue(id: string): void {
  const venue = catalog.getVenue(id)
  if (!venue) return
  selectedId = id
  const content = select("detail-content")
  content.replaceChildren()
  const title = element("h2", "detail-title", venue.acronym || venue.name)
  title.id = "detail-title"
  content.append(title, element("p", "detail-name", venue.name), element("p", "detail-type", venue.type === "conference" ? "This venue is a conference." : "This venue is a journal."))
  if (venue.aliases.length) content.append(element("p", "alias-line", `Also known as ${venue.aliases.join(", ")}.`))
  const assessments = catalog.getAssessments(id)
  for (const result of assessments) {
    const section = element("section", "assessment-detail")
    const heading = element("div", "assessment-heading")
    heading.append(element("h3", "", `${result.source.name} · ${result.source.edition}`), gradeBadge(result))
    section.append(heading, externalLink("View source", result.assessments[0]?.url ?? result.source.publisherUrl))
    const context = element("details", "source-context")
    context.append(element("summary", "", "Source information"), element("p", "", result.source.note))
    for (const assessment of result.assessments) {
      if (assessment.area) context.append(element("p", "area-line", `Field of research: ${assessment.area}.`))
    }
    section.append(context)
    content.append(section)
  }
  const actions = element("div", "detail-actions")
  const copy = element("button", "primary-button", "Copy reference")
  const feedback = element("p", "copy-feedback")
  feedback.setAttribute("role", "status")
  copy.addEventListener("click", async () => {
    const text = `${venue.acronym || venue.name} — ${venue.name}\n` + assessments.map(r => `${r.source.name} (${r.source.edition}): ${assessmentLabel(r)}\n${r.assessments[0]?.url ?? r.source.publisherUrl}`).join("\n") + `\nDataset: ${dataset.version}`
    try { await navigator.clipboard.writeText(text); feedback.textContent = "The reference was copied." }
    catch { feedback.textContent = "Copying is unavailable here. You can select and copy the details above." }
  })
  actions.append(copy)
  if (venue.dblp) actions.append(externalLink("Open in DBLP", venue.dblp))
  content.append(actions, feedback, element("p", "dataset-line", `This reference uses dataset ${dataset.version}.`))
  syncUrl()
  if (!detailDialog.open) detailDialog.showModal()
}

function reset(): void {
  input.value = ""
  typeFilter.value = "all"
  sourceFilter.value = "all"
  setGradeOptions()
  visible = 24
  render()
  input.focus()
}

const tableHeader = document.querySelector("thead tr")!
const headingCells = [element("th", "", "Venue"), ...dataset.sources.map(source => {
  const cell = element("th", "", source.name + " ")
  cell.append(element("span", "", source.edition.replace(/^ICORE/, "")))
  return cell
})]
for (const cell of headingCells) cell.scope = "col"
tableHeader.replaceChildren(...headingCells)

for (const source of dataset.sources) {
  sourceFilter.add(new Option(`${source.name} · ${source.edition}`, source.id))
  const section = element("section", "assessment-detail")
  const count = dataset.assessments.filter(a => a.sourceId === source.id).length
  section.append(element("h3", "", `${source.name} · ${source.edition}`), element("p", "", source.note), element("p", "source-meta", `${count.toLocaleString()} assessments are included. This snapshot was retrieved on ${source.retrievedAt}.`), externalLink("Original publisher ↗", source.publisherUrl), document.createTextNode(" "), externalLink("Snapshot provenance ↗", source.dataUrl))
  select("source-information").append(section)
}
select("about-version").textContent = `This edition uses dataset ${dataset.version}.`
input.addEventListener("input", () => { visible = 24; render() })
typeFilter.addEventListener("change", () => { visible = 24; render() })
sourceFilter.addEventListener("change", () => { setGradeOptions(); visible = 24; render() })
gradeFilter.addEventListener("change", () => { visible = 24; render() })
select("reset-button").addEventListener("click", reset)
select("empty-reset").addEventListener("click", reset)
select("load-more").addEventListener("click", () => { visible += 24; render() })
select("about-button").addEventListener("click", () => aboutDialog.showModal())
select("close-about").addEventListener("click", () => aboutDialog.close())
select("close-detail").addEventListener("click", () => detailDialog.close())
detailDialog.addEventListener("close", () => { selectedId = undefined; syncUrl() })
for (const dialog of [detailDialog, aboutDialog]) dialog.addEventListener("click", event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close() } })
document.addEventListener("keydown", event => {
  if (event.key === "/" && !detailDialog.open && !aboutDialog.open && !["INPUT", "TEXTAREA", "SELECT"].includes((event.target as HTMLElement)?.tagName)) { event.preventDefault(); input.focus() }
  if (event.key === "ArrowDown" && event.target === input) { event.preventDefault(); document.querySelector<HTMLButtonElement>(".venue-button")?.focus() }
})
const params = new URLSearchParams(location.search)
input.value = params.get("q") ?? ""
typeFilter.value = ["conference", "journal"].includes(params.get("type") ?? "") ? params.get("type")! : "all"
sourceFilter.value = dataset.sources.some(s => s.id === params.get("source")) ? params.get("source")! : "all"
setGradeOptions(params.get("grade") ?? "all")
const initialVenue = params.get("venue")
render()
if (initialVenue) openVenue(initialVenue)
