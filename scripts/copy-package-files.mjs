import { copyFile, mkdir } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const root = new URL("../", import.meta.url)
const target = new URL("packages/core/", root)
await mkdir(new URL("dist/", target), { recursive: true })
for (const name of ["LICENSE", "NOTICE.md"]) await copyFile(new URL(name, root), new URL(name, target))
await copyFile(new URL("src/data/snapshot.json", target), new URL("dist/snapshot.json", target))
console.log(`Prepared package files in ${fileURLToPath(target)}`)
