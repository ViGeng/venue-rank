import { access, mkdir, symlink } from "node:fs/promises"
import { createRequire } from "node:module"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

// The Raycast CLI expects TypeScript inside the extension even when npm hoists it.
const local = fileURLToPath(new URL("../node_modules/typescript", import.meta.url))
try { await access(local) } catch {
  const require = createRequire(import.meta.url)
  const installed = dirname(require.resolve("typescript/package.json"))
  await mkdir(dirname(local), { recursive: true })
  await symlink(installed, local, "dir")
}

const localBin = fileURLToPath(new URL("../node_modules/.bin/tsc", import.meta.url))
try { await access(localBin) } catch {
  const require = createRequire(import.meta.url)
  const compiler = require.resolve("typescript/bin/tsc")
  await mkdir(dirname(localBin), { recursive: true })
  await symlink(compiler, localBin, "file")
}
