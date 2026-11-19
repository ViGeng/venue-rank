# Local verification completed at 2026-11-10T13:59:40+01:00.

The implementation was checked on Node.js 25.6.1 and npm 11.9.0. The package declares support for Node.js 22.14 and newer. The CI workflow is configured for Node.js 22, but GitHub-hosted CI has not run because the repository has not been published.

## The automated checks passed.

- The deterministic import check reproduced the bundled snapshot from local raw sources.
- ESLint completed without errors.
- TypeScript checked the core library, website, and Raycast source without errors.
- All 28 library and metadata regression tests passed.
- Vite built the production static website successfully.
- The packed npm archive installed into an isolated temporary consumer without accessing the ranking services.
- The isolated consumer verified ESM, CommonJS, TypeScript declarations, the engine-only entry point, and the raw JSON export.
- The Raycast CLI built the extension successfully inside the workspace.
- The standalone Raycast export installed the local npm archive and passed its distribution build independently of sibling source directories.

The final npm archive is release/venue-rank-0.1.0.tgz and contains 293,078 compressed bytes. The website's JavaScript, including metadata, compresses to 67.87 kB. Its CSS compresses to 3.18 kB. No external font or image service is required.

## The browser interactions passed.

The production website was served locally and inspected in an actual browser. The following interactions were verified against rendered state.

- A misspelled sigcom query placed SIGCOMM first and showed both CCF A and ICORE A*.
- An unrelated query displayed the empty state, and clearing it restored browsing.
- A CCF A filter returned 96 venues, and every visible CCF assessment was A.
- A journal filter and the IEEE IoT Journal alias returned the journal and marked ICORE as not applicable.
- Venue details retained original source links and source editions.
- Copying a reference displayed its success message.
- Reloading a shareable venue URL restored its details dialog.
- The source information dialog showed both source counts and coverage explanations.
- The pagination button expanded the visible result count from 24 to 48.
- The slash shortcut focused search, the down arrow focused a result, Enter opened details, and Escape closed the dialog.
- The 390-pixel mobile viewport and 1100-pixel desktop viewport had no page-wide horizontal overflow.
- The inspected browser console contained no error entries.

The desktop and mobile previews are saved in docs/screenshots. The temporary preview server was stopped after inspection.

## The remaining limits are explicit.

The native Raycast application has not been used to run the extension. The Store author handle is proposed as vigeng and requires confirmation. The standalone local validation lockfile uses the unpublished local archive and must be regenerated against the npm registry after publication.

The CCF transcription contains 679 retained assessments after reviewed import corrections. The ICORE portal snapshot contains all 987 public ICORE2026 records. Together they produce 1,347 venue identities and 1,666 assessments. Coverage is conservatively partial because the CCF transcription and all cross-source identity associations have not been exhaustively audited. Missing associations remain unknown.

CSRankings, Tsinghua, and HKUST data is not bundled. npm publication, public repository creation, GitHub Pages deployment, and Raycast Store submission have not occurred. The user's publication accounts and repository destination must be confirmed before those steps.

## The revised website appearance was verified at 2026-11-10T14:16:29+01:00.

The current UI removes the promotional hero, snapshot sidebar, example chips, footer copy, and decorative row labels. It retains search, contextual filters, venue names, and source-specific assessments. The grade filter appears only after a source is selected. Source notes are available in dialogs and collapsed details.

The final palette follows system appearance through prefers-color-scheme. Light mode uses a white surface. Dark mode uses #27282b for the page, #2e2f33 for elevated surfaces, #dddde2 for primary text, and #a5a5ae for secondary text. The logo inverts its foreground and background contrast, and all source-specific grades use the same neutral gray badge styling. The favicon and browser theme color follow the same appearance preference.

Lint, TypeScript checking for the website, and the production build passed. All 28 existing tests passed during the UI revision. In-browser checks confirmed search results, source-specific filtering, contextual grade controls, collapsed source details, copying, and the Data & sources dialog. Desktop and 390-pixel mobile layouts were checked in both palettes without page-wide horizontal overflow. The inspected console had no error entries.

The browser was using a light system preference. Dark rendering was verified by temporarily activating the exact dark token block under that preference. The original dark media condition was restored before final verification and build. The operating system appearance was not changed. The existing development server at http://127.0.0.1:5173 belongs to the user's project and was left running.

The four current preview screenshots have clean-light, clean-dark, clean-light-mobile, and clean-dark-mobile filenames in docs/screenshots. The initial screenshots remain as historical references.

## The lettermark revision was verified at 2026-11-10T14:38:48+01:00.

Two original vector directions were compared at 16, 24, and 32 pixels with the same wordmark and on white and charcoal backgrounds. The first compact vr was revised after user feedback to open its internal spacing and connect its strokes through a smooth curve. The revised vr is the current selection, and both v. and the original compact vr remain as editable alternatives.

The website uses the selected inline SVG with currentColor, while the favicon uses the same geometry and appearance-aware foreground colors. The actual header retains bold venue at weight 700 and regular rank at weight 400. A 390 pixel mobile viewport showed no page-wide horizontal overflow, and a SIGCOMM search continued to show CCF A and ICORE A*. The inspected browser console contained no errors.

Lint, the website TypeScript check, the static production build, and the Raycast build passed. The existing 28-test suite passed during this iteration. The SVG assets are well-formed, and the selected Raycast PNG is exactly 512 by 512 pixels. SVG rasterization used a temporary SVG rendering tool without adding website runtime dependencies.

The design sources, final comparison, and integration screenshots are in docs/branding. Public publication and native Raycast client verification remain outside this design revision.

## The native Raycast redesign was verified at 2026-11-10T15:03:42+01:00.

The default native list now uses the full window width, shows full-name subtitles when space permits, and keeps assessments in compact neutral text accessories. The optional split preview removes those subtitles and accessories from the narrow left list. Detail headings and source editions are compact, with assessments displayed through Raycast metadata. Provenance paragraphs and dataset context are available only in the separate Data & Sources view.

The native application was used to verify the full-width list, SIGCOMM results, detail navigation, source navigation through Command-I, and preview switching through Command-D. SIGCOMM retained CCF A and ICORE A* in each view. The standalone detail page correctly exposes Copy Assessments as its default action. The user-facing development process remains running for further manual testing.

The actual native screenshots are docs/screenshots/raycast-list.jpg, raycast-detail.jpg, and raycast-preview.jpg. Lint, the Raycast TypeScript check, all 28 existing library tests, and the workspace extension build passed. The core metadata and search semantics are covered by the existing tests.

## The independent Store submission was verified at 2026-11-10T15:36:36+01:00.

The generated export in release/raycast/venue-rank matches all submitted files, including package-lock.json. Its dependencies use public npm registry URLs and contain no local paths or workspace links. Official Raycast author and icon validation, ESLint, Prettier, the explicit dist build, and all 28 existing catalog tests against the standalone source passed. The native distribution build displayed the expected SIGCOMM assessments and supported details, preview, and source information. The submission is https://github.com/raycast/extensions/pull/33381. Official CI was still running at creation time.

## The public GitHub Pages website was verified at 2026-11-10T16:00:30+01:00.

The successful deployment is https://github.com/ViGeng/venue-rank/actions/runs/42839101983, serving https://wgeng.site/venue-rank/ from commit 230c5dc. Its clean Linux workflow passed dataset reproduction, lint, TypeScript, all 28 tests, the Vite build, and isolated package verification. The live browser rendered the approved layout, returned SIGCOMM first for sigcom with CCF A and ICORE A*, and opened venue details with source links and dataset 2026.11.10. The saved live screenshot is docs/screenshots/published-site.jpg. The repository retains the manual Pages deployment workflow.

## SEO and Store review validation passed at 2026-11-10T16:32:23+01:00.

The production build emits the initial 24 catalog rows directly in HTML, canonical metadata for https://wgeng.site/venue-rank/, structured WebSite and WebApplication metadata, sharing metadata, and sitemap.xml. Production-output checks confirmed the initial content, unique element IDs, parseable structured data, a single canonical sitemap URL, and valid asset paths. The existing 28 tests and complete project check passed, and a production browser session verified typo search and venue detail navigation.

The official Store screenshot validator passed the user-generated 2000 by 1250 Capture Window PNG, including padding and symmetry checks. Visual privacy review found only public venue information and no personal paths, account details, or unrelated application content. Text changes were reviewed for private paths and credential-like assignments without exposing any matched values. The root robots.txt allows crawling. Search Console verification and Google indexing have not been claimed.

## The published SEO artifacts and PR update were verified at 2026-11-10T16:41:25+01:00.

The successful website run is https://github.com/ViGeng/venue-rank/actions/runs/42845394010. An HTTPS fetch of the public site confirmed the new title, root canonical URL, 24 static venue rows, parseable JSON-LD, a valid sitemap, and the sharing image. The existing live browser tab was reloaded and still returned SIGCOMM with CCF A and ICORE A* for sigcom. The five original Raycast bot threads are resolved, and Greptile re-review, metadata validation, extension validation, and dependency-security checks passed for commit 9eb7ec6aad. The screenshot contains no location or account information in its EXIF. Its remaining metadata describes dimensions and a generic display color profile.

## The updated Raycast submission was validated at 2026-11-17T15:52:51+01:00.

The interface changes from f4ae75c were exported with venue-type icons, explicit-grade colors, result counts, action groups, and dataset metadata. The original ranking data and PR dependency lockfile were retained. Independent npm ci, official lint, the distribution build, and all 28 existing tests passed. Three current native captures passed the official Store image validator. README media is separate from metadata, and all submitted files match the formatted export. The changed text and screenshot metadata contain no private home paths, credential assignments, account details, or location data. The agent did not perform native Raycast interaction tests for this synchronization.

## The repository separation was checked at 2026-11-17T16:31:38+01:00.

Raycast source and the exporter were removed from this repository. The shared package, website, and data importer remain here. The full project check passed snapshot reproduction, ESLint, TypeScript, all 28 tests, the website production build, and isolated ESM, CommonJS, TypeScript, and JSON package consumers. The extension source in the separate extensions checkout imports the package and has no copied catalog implementation or snapshot. Official extension lint, TypeScript, and the distribution build passed with the local package archive.

The core package remains unpublished. The authorized npm publish request failed, and npm whoami returned 401 Unauthorized. Public registry installation requires restored authentication and successful publication. The previous Raycast sections above describe historical workspace and export checks, whose paths no longer apply to current development. Native Raycast interaction was not tested during this separation.

## Public npm consumption was verified at 2026-11-17T16:39:41+01:00.

The public registry serves venue-rank@0.1.0 without authentication. Its integrity matches the locally tested archive and the independent extension lockfile. The extension completed npm ci against the public registry with a fresh cache, then passed official Raycast lint, the explicit distribution build, and TypeScript. Publication and public installation are complete. These results supersede the authentication and publication limits recorded in the previous section. Native Raycast interaction was not tested in this publication step.

## The published npm archive received a retrospective privacy review at 2026-11-17T16:43:41+01:00.

This review happened after publication and does not establish that a prepublication privacy check occurred. The archive matches the public registry integrity and the intended 17-file inventory. The review checked all 17 text files, four source maps, and eight embedded source contents for credential patterns, private filesystem paths, private network addresses, authenticated URLs, and unexpected email addresses. It also checked the expected package documentation and declared author identity. No findings were reported by these checks. The author email is deliberate public attribution.

The review covers the npm archive, which contains no screenshots. Unpublished Git changes and screenshots outside that archive were not covered. Pattern checks cannot prove the absence of every form of private information. The release guide now requires review of the final artifact before future publication.

## The public 0.1.1 archive was verified at 2026-11-19T16:48:58+01:00.

The full project check passed snapshot reproduction, ESLint, TypeScript, all 28 tests, the production website build, and isolated ESM, CommonJS, JSON, and TypeScript consumers. Before publication, the final 17-file archive, four source maps and embedded source content, six website files, public logo image, and outgoing source diff received a scoped privacy review with no findings. Deliberate public author attribution was retained. Pattern checks support this review and cannot prove the absence of all private information.

The public npm registry now serves venue-rank@0.1.1 with the public repository URL and packages/core directory. Its archive matches the reviewed SHA-256 `e150277901f9b62bf09f2722e7ff972dba7eb4692bb37b10d2818168f0e71ba9` and registry integrity `sha512-Jecec3g9T9pLOypWILlyyaymWJqfWEyAbWEin61fQdJXvyaiF3Mg8jnM6/I3HdN7CqdGUCGmo5CNGjK2pzsiyA==`. Compared with the public 0.1.0 archive, only package.json and README.md changed. The engine, declarations, bundled dataset, and source maps are byte-identical. A fresh-cache public installation returned SIGCOMM for the sigcom query.

## The 0.1.1 downstream updates were verified at 2026-11-19T16:51:40+01:00.

The [Pages workflow](https://github.com/ViGeng/venue-rank/actions/runs/44558805797) completed successfully from commit `430186460f2ca4a68c4928a466134bc366d46ed8`. All six live HTTPS website files match the privacy-reviewed build byte for byte. The deployed HTML retains 24 static venue rows, the canonical URL, and parseable JSON-LD. The sitemap and public branding assets are available.

The separate Raycast extension pins venue-rank@0.1.1 and the matching public registry integrity in commit `59e02ed891bbb41c3cb0a984fee94283b9485ae9`. Independent npm ci, official Raycast lint, and the explicit distribution build passed. The three-file dependency and README diff passed a scoped privacy review before its push to [PR 33381](https://github.com/raycast/extensions/pull/33381). Its description now includes the published version, repository metadata, immutable core source link, and current validation. The source project retains the single shared implementation. Native Raycast interactions were not tested during this dependency release.
