# Releases distribute the same code and data to different destinations.

The local repository is the development source of truth. The npm registry stores versioned core packages. GitHub Pages serves the built website. The raycast/extensions repository stores the extension's submitted source, and the Raycast Store distributes its built extension.

## Local verification comes first.

```sh
npm ci
npm run check
npm run build:raycast
npm run prepare:raycast -- --local
```

The generated npm archive is saved in release. The isolated package test uses that archive in a separate temporary project. The local Raycast preparation command bundles the catalog source and snapshot into an independent directory, installs public registry dependencies, and runs official lint and the distribution build. Its lockfile is suitable for Store submission.

## The core package is published to npm.

You must confirm the intended npm owner, package name, and licensing before the first public publication. The proposed name venue-rank was available at the initial unauthenticated registry check on 2026-11-10, but availability must be checked again at publication time. A scoped name can be substituted consistently if necessary.

After local verification and authentication through the user's normal npm workflow, the package can be published from packages/core.

```sh
npm publish --workspace venue-rank --access public
```

The package's prepack script builds the JavaScript and declarations and copies license, attribution, and data files. Each published version should be treated as immutable. Data changes require a new package version even when the API stays the same.

## The website is deployed to GitHub Pages.

You must confirm the GitHub repository and push the reviewed source. In the repository settings, Pages should use GitHub Actions. The Deploy to GitHub Pages workflow can then be triggered manually. It runs checks, builds the site, and uploads only apps/web/dist. Its relative asset base works under a project subpath.

Website visitors receive the built JavaScript and metadata from Pages. They do not install dependencies from npm when entering a search. A new npm publication does not change an existing deployment until that deployment is rebuilt with the intended version.

## The extension is submitted to Raycast.

The verified Raycast author is ViGeng, and the Store slug is venue-rank. The extension code and icon are MIT licensed. NOTICE.md preserves third-party data attribution.

The core package does not need to be published to npm before submitting the extension.

```sh
npm run prepare:raycast -- --local
cd release/raycast/venue-rank
npm run lint
npm run build
```

The export copies the shared catalog source and metadata into src/catalog, uses public registry dependencies, and generates a normal package-lock.json. Verify the distribution build in Raycast before submitting. You can use the publishing command below or open a normal fork PR to raycast/extensions main.

```sh
npm run publish
```

The Raycast CLI creates a Pull Request to raycast/extensions. Review and merge are controlled by Raycast. Merging publishes the extension to the Store. This command is distinct from npm publish, which publishes the core package.

Official extension contributions must be pulled back into the development source before subsequent publication, using the official pull-contributions command where appropriate.

```sh
npx @raycast/api@latest pull-contributions
```

The Raycast publishing guide is https://developers.raycast.com/basics/publish-an-extension and the Store preparation guide is https://developers.raycast.com/basics/prepare-an-extension-for-store.

## A metadata update follows a short release sequence.

You should update the public source snapshots, rebuild the dataset, review grade and identity changes, and run the checks. You should then publish a new core package, redeploy the website, and regenerate the standalone Raycast export and submit an extension update with the same snapshot. Each interface shows its data version, so publication delays remain visible.

No runtime data service or background metadata download is part of the first release.
