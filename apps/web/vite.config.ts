import { readFileSync } from "node:fs"
import { defineConfig } from "vite"
import { getDefaultCatalog } from "venue-rank"
import { renderStaticShell } from "./src/shell.ts"
import { renderSeoHead, siteUrl } from "./src/site.ts"

export default defineConfig({
  base: "./",
  plugins: [{
    name: "static-catalog",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const mark = readFileSync(new URL("./src/brand-mark.svg", import.meta.url), "utf8")
        return html.replace("<!--seo-head-->", renderSeoHead()).replace("<!--app-html-->", renderStaticShell(mark, getDefaultCatalog()))
      },
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl}</loc></url></urlset>\n` })
    },
  }],
})
