export const siteUrl = "https://wgeng.site/venue-rank/"
const title = "Venue Rank | CCF and CORE / ICORE Conference & Journal Rankings"
const description = "Search computer science conference and journal rankings by acronym or name. Compare CCF 2026 and ICORE2026 grades with source links and versioned metadata."

export function renderSeoHead(): string {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${siteUrl}#website`, name: "Venue Rank", alternateName: "VenueRank", url: siteUrl, description, inLanguage: "en" },
      { "@type": "WebApplication", "@id": `${siteUrl}#application`, name: "Venue Rank", url: siteUrl, description, applicationCategory: "ReferenceApplication", operatingSystem: "Any", isAccessibleForFree: true, browserRequirements: "JavaScript is required for interactive search." },
    ],
  }
  return `<title>${title.replaceAll("&", "&amp;")}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${siteUrl}" />
    <link rel="sitemap" type="application/xml" href="${siteUrl}sitemap.xml" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Venue Rank" />
    <meta property="og:title" content="Venue Rank · CCF and ICORE Rankings" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${siteUrl}" />
    <meta property="og:image" content="${siteUrl}social-icon.png" />
    <meta property="og:image:width" content="512" />
    <meta property="og:image:height" content="512" />
    <meta property="og:image:alt" content="The monochrome Venue Rank lettermark." />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Venue Rank · CCF and ICORE Rankings" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${siteUrl}social-icon.png" />
    <script type="application/ld+json">${JSON.stringify(schema)}</script>`
}
