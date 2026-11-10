# Venue Rank implementation plan

This project provides a reusable TypeScript library, a static website, and a Raycast extension for looking up computer science venue assessments. Metadata ships with the library, and searches run locally.

## First release

1. The library will expose typed venue search and assessment APIs, use Fuse.js for fuzzy matching, and accept additional datasets without changing the search implementation.
2. The bundled dataset will preserve source identities, source versions where established, provenance, and coverage. The initial release will prioritize CCF and CORE/ICORE. Sources that cannot be verified or redistributed will remain explicitly unavailable.
3. The website will run as a static Vite application suitable for GitHub Pages and will show venue identity, assessments, source links, and dataset versions.
4. The Raycast extension will use the same library and dataset. Its distributable project must install and build independently from the monorepo.
5. Automated checks will cover search ambiguity, assessment semantics, dataset integrity, TypeScript, linting, static builds, and installing the packed npm artifact in a separate consumer.
6. Documentation will describe data extension, data refresh, local development, npm packaging, GitHub Pages deployment, and Raycast submission. The changelog will record implementation and verified limitations.

## Publication

The initial package version will be 0.1.0. Public npm publication, repository creation or pushing, GitHub Pages deployment, and Raycast Store submission will follow local validation and confirmation of the publication identities and destinations.

## Metadata policy

The library will distinguish an explicit assessment, absence from a complete source snapshot, a source that does not apply to a venue type, and unknown results from incomplete coverage. It will preserve source-specific labels without combining them into a global quality score. Fuzzy search will rank user-facing candidates and will not automatically merge venue identities during imports.
