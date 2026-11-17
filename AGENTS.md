# Repository ownership

This repository owns the shared `venue-rank` package, its dataset, and the website.

The Raycast extension lives in the separate `raycast/extensions` checkout at `../extensions/extensions/venue-rank`. Make all Raycast interface, manifest, asset, and Store submission changes there. The extension depends on the published `venue-rank` package. Do not add a Raycast workspace, extension source, or export script to this repository.

Shared search, API, and dataset changes belong in `packages/core`. Publish a package version before updating independent consumers to use it.
