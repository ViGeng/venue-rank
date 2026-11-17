# Releases distribute the library and website.

This repository owns the core library, versioned dataset, and website. The npm registry stores versioned core packages, and GitHub Pages serves the built website. The Raycast extension is maintained separately in `raycast/extensions`, under `extensions/venue-rank`, and depends on the published `venue-rank` package. All extension development and Store submissions take place there.

## Every public release requires a privacy review.

Review the exact final artifact before publication, including generated files and embedded source-map content. Check the file inventory before reading contents, and exclude credential or authentication files without opening them. Check for private information and unintended configuration while preserving deliberate public attribution. Pattern scanning supports contextual review and does not prove that an artifact contains no sensitive information. A successful build, lint run, or dependency audit does not replace this review. Rebuild and repeat the relevant review after any release-content correction.

## Local verification comes first.

```sh
npm ci
npm run check
```

The generated npm archive is saved in release. The isolated package test installs that archive in a temporary project and verifies ESM, CommonJS, TypeScript declarations, and the JSON export.

## The core package is published to npm.

The first package, [venue-rank@0.1.0](https://www.npmjs.com/package/venue-rank/v/0.1.0), was published on 2026-11-17. Its code uses the MIT license. An anonymous registry request and installation with a fresh npm cache verified public availability and the archive integrity. Future publication requires the owner's authorization and authentication through the normal npm workflow.

```sh
npm publish --workspace venue-rank --access public
```

The package's prepack script builds the JavaScript and declarations and copies license, attribution, and data files. Each published version is immutable. Data changes require a new package version even when the API stays the same. Independent consumers must use a version that is available in the public registry.

## The website is deployed to GitHub Pages.

The development repository is ViGeng/venue-rank. Its GitHub Pages site inherits the existing wgeng.site domain and is served at https://wgeng.site/venue-rank/. Pages uses GitHub Actions. The Deploy to GitHub Pages workflow can be triggered manually. It runs checks, builds the site, and uploads only apps/web/dist. Its relative asset base works under a project subpath.

Website visitors receive the built JavaScript and metadata from Pages. The website uses the local workspace library during its build. Publishing an npm package does not change an existing deployment until the website is rebuilt and deployed.

## Metadata changes require coordinated releases.

Update the public source snapshots, rebuild the dataset, review grade and identity changes, and run the checks. Publish a new core package and redeploy the website. Independent consumers can then update their package dependencies in their own repositories. No source-copying step is needed. Each interface shows its data version, so publication delays remain visible.

The website build renders the initial catalog directly into HTML and emits canonical metadata, structured data, and sitemap.xml. The production check validates these artifacts before deployment. Search Console can receive https://wgeng.site/venue-rank/sitemap.xml after the owner verifies the site. Search engine inclusion and ranking are not guaranteed by deployment.
