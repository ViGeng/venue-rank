import assert from "node:assert/strict"
import { readFile, access } from "node:fs/promises"

const root = new URL("../apps/web/dist/", import.meta.url)
const html = await readFile(new URL("index.html", root), "utf8")
const sitemap = await readFile(new URL("sitemap.xml", root), "utf8")
assert.match(html, /<title>Venue Rank[^<]*CCF/)
assert.match(html, /<link rel="canonical" href="https:\/\/wgeng\.site\/venue-rank\/"/)
assert.match(html, /<h1[^>]*>Computer science conference and journal rankings<\/h1>/)
assert.match(html, /AAAI Conference on Artificial Intelligence/)
assert.equal((html.match(/class="venue-cell"/g) ?? []).length, 24)
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
assert.equal(new Set(ids).size, ids.length, "The initial page contains duplicate IDs.")
assert(!html.includes("<!--app-html-->"), "The catalog was not prerendered.")
const structured = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1]
assert(structured, "The structured metadata is missing.")
assert.equal(JSON.parse(structured)["@graph"][0].url, "https://wgeng.site/venue-rank/")
assert.match(sitemap, /<loc>https:\/\/wgeng\.site\/venue-rank\/<\/loc>/)
assert(!sitemap.includes("?" + "q="), "Search combinations must not be listed in the sitemap.")
for (const match of html.matchAll(/(?:src|href)="(\.\/assets\/[^"?#]+)"/g)) await access(new URL(match[1], root))
await access(new URL("social-icon.png", root))
console.log("The production HTML includes the catalog, canonical metadata, structured data, and sitemap with valid asset paths.")
