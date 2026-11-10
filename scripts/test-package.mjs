import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("../", import.meta.url))
const release = join(root, "release")
await mkdir(release, { recursive: true })
const manifest = JSON.parse(await readFile(join(root, "packages/core/package.json"), "utf8"))
const output = execFileSync("npm", ["pack", "--workspace", "venue-rank", "--ignore-scripts", "--pack-destination", release, "--json"], { cwd: root, encoding: "utf8", maxBuffer: 10_000_000 })
const packages = JSON.parse(output.slice(output.indexOf("[")))
const archive = join(release, packages[0].filename)
const paths = packages[0].files.map(file => file.path)
for (const expected of ["dist/index.js", "dist/index.cjs", "dist/index.d.ts", "dist/index.d.cts", "dist/engine.js", "dist/snapshot.json", "LICENSE", "NOTICE.md", "README.md"]) assert(paths.includes(expected), `The package is missing ${expected}.`)
assert(!paths.some(path => path.startsWith("src/") || path.includes(".env")), "The package contains unintended source files.")
const consumer = await mkdtemp(join(tmpdir(), "venue-rank-consumer-"))
try {
  await writeFile(join(consumer, "package.json"), JSON.stringify({ private: true, type: "module" }))
  execFileSync("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund", "--offline", archive], { cwd: consumer, stdio: "pipe" })
  const test = `
    import assert from 'node:assert/strict'
    import { searchVenues, getAssessments, createCatalog, bundledDataset } from 'venue-rank'
    import { createCatalog as engineOnly } from 'venue-rank/engine'
    const result = searchVenues('sigcom')[0]
    assert.equal(result.venue.id, 'conf:sigcomm')
    assert(getAssessments(result.venue.id).every(item => item.status === 'assessed'))
    assert.equal(createCatalog(bundledDataset).dataset.version, bundledDataset.version)
    assert.equal(typeof engineOnly, 'function')
    const snapshot = (await import('venue-rank/data', { with: { type: 'json' } })).default
    assert.equal(snapshot.schemaVersion, 1)
    console.log('The ESM package, engine entry point, and JSON export work offline.')
  `
  execFileSync(process.execPath, ["--input-type=module", "-e", test], { cwd: consumer, stdio: "inherit" })
  execFileSync(process.execPath, ["--input-type=commonjs", "-e", "const assert = require('node:assert/strict'); const { searchVenues } = require('venue-rank'); assert.equal(searchVenues('SIGCOMM')[0].venue.id, 'conf:sigcomm'); console.log('The CommonJS package works offline.')"], { cwd: consumer, stdio: "inherit" })
  await writeFile(join(consumer, "consumer.ts"), 'import { searchVenues, createCatalog, type VenueDataset } from "venue-rank"\nimport { createCatalog as createEngine } from "venue-rank/engine"\nconst id: string | undefined = searchVenues("SIGCOMM")[0]?.venue.id\nconst factory: (data: VenueDataset) => ReturnType<typeof createCatalog> = createEngine\nconsole.log(id, factory)\n')
  execFileSync(process.execPath, [join(root, "node_modules/typescript/bin/tsc"), "--noEmit", "--strict", "--skipLibCheck", "--target", "ES2022", "--module", "NodeNext", "--moduleResolution", "NodeNext", "consumer.ts"], { cwd: consumer, stdio: "inherit" })
  console.log(`The isolated TypeScript consumer passed for ${manifest.name}@${manifest.version}.`)
  console.log(`Created ${archive} (${packages[0].size.toLocaleString()} bytes).`)
} finally { await rm(consumer, { recursive: true, force: true }) }
