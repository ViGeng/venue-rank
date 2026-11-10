# The changelog records each implementation iteration.

## The initial implementation began at 2026-11-10T13:44:26+01:00.

The plan is to build a shared offline TypeScript package, a static GitHub Pages website, and a Raycast extension with bundled metadata. The initial source snapshots contain 1,349 venue identities and 1,671 assessments. The importer retains provenance and separates known identity collisions. Search, filtering, source details, package distribution, and publication workflows have been implemented. Validation is in progress, and no public publication has occurred.

## The first local release was verified at 2026-11-10T13:59:40+01:00.

The final snapshot contains 1,347 venue identities and 1,666 assessments. Reviewed historical aliases were unified, while conflicting explicit DBLP references and ambiguous Inscrypt/ICISC records were kept separate. The final checks passed all 28 tests, lint, TypeScript, website builds, isolated npm consumer checks, and workspace and standalone Raycast distribution builds. Browser checks verified search, filters, copying, share links, pagination, keyboard interaction, and mobile and desktop layouts. Preview screenshots and the verification report were saved. Public publication and native Raycast interaction remain outstanding because publication identities require confirmation and the native client has not been exercised.

## The minimal website revision began at 2026-11-10T14:06:49+01:00.

The plan is to preserve the existing logo and palette while removing the hero, promotional copy, snapshot sidebar, example chips, footer, and decorative row labels. The implementation now places search, compact filters, and assessments first. Source context remains available in dialogs, and source notes in venue details are collapsed by default. The grade selector is shown only after a reference list is selected. Lint, TypeScript, production build, and browser verification are pending.

## The system appearance revision began at 2026-11-10T14:09:18+01:00.

The user refined the visual direction to neutral black, white, and gray with automatic system light and dark appearance. The website now uses semantic color tokens and prefers-color-scheme rather than a stored theme choice. The logo shape is retained with monochrome colors, all assessment badges use neutral gray, and the favicon and browser theme color follow the same system preference. The previous green palette is superseded for the website. Appearance and responsive browser verification are pending.

## The dark appearance was softened at 2026-11-10T14:13:10+01:00.

The user requested a gentler dark appearance after inspecting the first monochrome preview. The revised palette uses a #27282b base, a #2e2f33 elevated surface, #dddde2 primary text, and #a5a5ae secondary text. This follows the layered surface and adaptive foreground principles described in Apple's Dark Mode guidance at https://developer.apple.com/design/human-interface-guidelines/dark-mode. Neutral assessment badges and the adaptive logo are retained. Final appearance verification is pending.

## The minimal adaptive website was verified at 2026-11-10T14:16:29+01:00.

The final website uses a minimal search-first layout and automatically follows system appearance. The dark palette was softened to layered charcoal surfaces and gray text after user feedback. The adaptive monochrome logo and source-neutral assessment badges are in place. Lint, the website TypeScript check, and the production build passed. All 28 existing tests passed during this revision. Browser checks verified conditional grade filters, source details, collapsed provenance notes, reference copying, and the data dialog. The light and dark layouts were checked at desktop and 390-pixel mobile widths without page-wide horizontal overflow. The dark colors were previewed with a temporary CSS media condition, after which the actual prefers-color-scheme rule was restored. No OS appearance setting was changed. The user's existing development server was reused and remains running. Preview images are saved in docs/screenshots/clean-light.jpg and clean-dark.jpg, with mobile counterparts.

## Two lettermark directions were drafted at 2026-11-10T14:27:15+01:00.

The user requested original v. and vr designs and delegated the choice after comparison. Both monochrome SVG drafts use custom paths and retain the existing bold venue and regular rank wordmark. The local study compares light and charcoal appearances and 16, 24, and 32 pixel marks. Small-size inspection and final selection are pending.

## The v. lettermark was selected at 2026-11-10T14:29:13+01:00.

Both designs were inspected with the unchanged wordmark and at 16, 24, and 32 pixel sizes on light and charcoal surfaces. The selected v. has a clearer small-size silhouette and a separate terminal dot. The vr ligature is retained as an alternative, but its central strokes are denser at 16 pixels. The website now uses the unframed currentColor SVG, and its adaptive favicon uses the same paths. A neutral rounded-square application icon source is saved for Raycast. Final builds and integration verification are pending.

## The vr ligature was opened and smoothed at 2026-11-10T14:32:36+01:00.

The user requested a smoother connection and less crowding before a final choice. The revised vr uses a continuous curved transition into the r stem, a rounded shoulder, and more internal space in a wider optical canvas. The original compact vr is preserved as vr-compact.svg. The comparison page now places the revised version against v. for reassessment.

## The revised vr became the current brand selection at 2026-11-10T14:34:47+01:00.

The smoother vr was compared again with v. in both appearances and at 16, 24, and 32 pixels. The revised connection retains a clearer interior and provides a direct link to both Venue Rank initials. This revised vr is now the current selection, superseding the initial v. choice. The website, adaptive favicon, and neutral application icon source use the same geometry. The wordmark remains bold venue with regular rank. Final integration verification is pending.

## The revised vr integration was verified at 2026-11-10T14:38:48+01:00.

The final vr was inspected in the actual website and alongside v. in light and charcoal panels. The comparison preserves actual 16, 24, and 32 pixel samples. The website wordmark retains font weights 700 and 400, and the new icon has a transparent background in the page header. A 390 pixel mobile check showed no page-wide horizontal overflow. SIGCOMM search still returns its CCF A and ICORE A* assessments, and the inspected console had no errors. Lint, website TypeScript, the static build, and the Raycast distribution build passed. All 28 existing tests passed during this design iteration. All vector exports parse as SVG, and the Raycast PNG is exactly 512 by 512 pixels. The final comparison and desktop and mobile screenshots are saved in docs/branding.

## The vr identity was approved at 2026-11-10T14:43:37+01:00.

The user confirmed the smooth vr design as the final identity. The website header, adaptive favicon, and Raycast source icon already use this geometry. The standalone Raycast release still contained an older icon and is being regenerated to match the approved assets. The README and branding guide now record the user-approved choice.

## The approved vr assets were synchronized at 2026-11-10T14:44:38+01:00.

The website SVG and favicon match the approved vr master geometry. The built website contains the same favicon as the source. The Raycast source icon, branding export, and freshly regenerated standalone release icon are byte-identical. Lint and all 28 existing tests passed, and both the static website and standalone Raycast distribution built successfully.

## Local Raycast testing began at 2026-11-10T14:49:26+01:00.

The user requested a running local extension for manual testing. The workspace development command compiled successfully, and Venue Rank appeared in Raycast's Development list. The Search Venues command was opened in the native application and displayed the local venue list and source details. The development process is left running for the user's testing and live updates. Native startup and rendering are now verified, while broader interactive testing remains in progress.

## The Raycast interface revision began at 2026-11-10T14:55:56+01:00.

The user reported that the split layout looked crowded and the default detail view contained excessive prose. The plan is to give the result list its full width, replace large accessories with compact neutral text, and show grades in native metadata rows. The implementation adds concise detail navigation and an optional preview that removes repeated row subtitles and accessories. Detailed provenance is available through Data & Sources rather than the main panel. Checks and native visual verification are pending.

## The redesigned Raycast views were verified at 2026-11-10T15:03:42+01:00.

The native app displayed the full-width result list with compact CCF and ICORE text. The SIGCOMM detail view displayed its full name, CCF 2026 A, ICORE 2026 A*, venue type, and DBLP link without source prose in the primary view. Command-I opened the separate source-information view, and Command-D displayed the optional preview with uncluttered list items and native metadata. The detail action context was corrected so the standalone detail view defaults to copying assessments instead of offering another nested detail action. Lint, TypeScript, the existing 28 tests, and the workspace Raycast build passed. Actual list, detail, and preview screenshots are saved in docs/screenshots. The local development process remains running.

## The redesigned standalone extension was synchronized at 2026-11-10T15:05:11+01:00.

The independent export now contains the same revised interface source as the development extension and passed its distribution build. The verified native UI remains available through the running development process.

## The Raycast Store submission was prepared at 2026-11-10T15:34:34+01:00.

The independent export bundles shared catalog source and metadata without an unpublished npm dependency. Its verified author is ViGeng, and its Store slug is venue-rank. Official lint, the distribution build, and all 28 existing tests against the standalone catalog passed. The native app displayed search, details, preview, and source information from the independent build. The exporter and release instructions now describe this packaging.

## The Raycast PR was created at 2026-11-10T15:36:36+01:00.

The formal submission is https://github.com/raycast/extensions/pull/33381. Commit 69e3cf2276 on ViGeng/extensions branch codex/venue-rank contains only the new extension. The generated standalone export matches the submitted files byte for byte, including its public-registry lockfile. Local official lint, distribution build, 28 existing catalog tests, and native distribution interactions passed. The PR is open, allows maintainer edits, and has started official CI checks.

## The GitHub Pages release was prepared at 2026-11-10T15:41:10+01:00.

The requested release will publish the shared project to ViGeng/venue-rank and deploy apps/web/dist through the existing manual GitHub Pages workflow. The artifact upload action was aligned with the current GitHub Pages documentation. Full local checks will run before the initial public commit.

## The clean CI package check was repaired at 2026-11-10T15:43:57+01:00.

The first Pages workflow passed data validation, lint, TypeScript, all 28 tests, and the website build. The isolated package installation then failed because strict offline mode required registry metadata absent from the new runner cache. The consumer install now prefers cached dependencies while allowing missing npm metadata to be downloaded. Runtime catalog checks still make no network requests. The clean-cache package check will run before redeployment.
