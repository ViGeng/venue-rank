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
