import { execFileSync } from "node:child_process"
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("../", import.meta.url))
const destination = join(root, "release/raycast/venue-rank")
const extension = join(root, "apps/raycast")
await rm(destination, { recursive: true, force: true })
await mkdir(join(destination, "src"), { recursive: true })
for (const name of ["assets", "README.md"]) await cp(join(extension, name), join(destination, name), { recursive: true })
for (const name of ["LICENSE", "NOTICE.md"]) await cp(join(root, name), join(destination, name))
await cp(join(root, "packages/core/src"), join(destination, "src/catalog"), { recursive: true })
const command = await readFile(join(extension, "src/search-venues.tsx"), "utf8")
await writeFile(join(destination, "src/search-venues.tsx"), command.replaceAll('from "venue-rank"', 'from "./catalog"'))
const manifest = JSON.parse(await readFile(join(extension, "package.json"), "utf8"))
const core = JSON.parse(await readFile(join(root, "packages/core/package.json"), "utf8"))
const workspace = JSON.parse(await readFile(join(root, "package.json"), "utf8"))
manifest.name = "venue-rank"
manifest.scripts = { build: "ray build -e dist", dev: "ray develop", "fix-lint": "ray lint --fix", lint: "ray lint", publish: "npx @raycast/api@latest publish" }
delete manifest.dependencies["venue-rank"]
manifest.dependencies["fuse.js"] = core.dependencies["fuse.js"]
manifest.devDependencies = { "@raycast/eslint-config": "2.2.0", "@types/node": workspace.devDependencies["@types/node"], "@types/react": manifest.devDependencies["@types/react"], eslint: workspace.devDependencies.eslint, prettier: "3.9.10", typescript: workspace.devDependencies.typescript }
await writeFile(join(destination, "package.json"), JSON.stringify(manifest, null, 2) + "\n")
const config = { $schema: "https://json.schemastore.org/tsconfig", include: ["src/**/*", "raycast-env.d.ts"], compilerOptions: { lib: ["ES2023"], module: "commonjs", target: "ES2023", strict: true, isolatedModules: true, esModuleInterop: true, skipLibCheck: true, forceConsistentCasingInFileNames: true, jsx: "react-jsx", resolveJsonModule: true } }
await writeFile(join(destination, "tsconfig.json"), JSON.stringify(config, null, 2) + "\n")
await writeFile(join(destination, "eslint.config.mjs"), 'import raycastConfig from "@raycast/eslint-config";\n\nexport default [...raycastConfig];\n')
await writeFile(join(destination, ".prettierrc"), "{}\n")
await writeFile(join(destination, "CHANGELOG.md"), "# Venue Rank Changelog\n\n## [Initial Release] - {PR_MERGE_DATE}\n\nThe extension searches computer science conferences and journals offline, shows CCF 2026 and ICORE2026 assessments with source links, and supports venue filtering, detail previews, and reference copying.\n")
await mkdir(join(destination, "media"), { recursive: true })
for (const name of ["list", "detail", "preview"]) await cp(join(root, `docs/screenshots/raycast-${name}.jpg`), join(destination, `media/${name}.jpg`))
if (process.argv.includes("--local")) {
  execFileSync("npm", ["install", "--no-audit", "--no-fund"], { cwd: destination, stdio: "inherit" })
  execFileSync("npm", ["run", "fix-lint"], { cwd: destination, stdio: "inherit" })
  execFileSync("npm", ["run", "build"], { cwd: destination, stdio: "inherit" })
}
console.log(`Prepared ${destination}. The catalog and metadata are bundled, so npm publication is not required.`)
