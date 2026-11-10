import { defineConfig } from "tsup"

export default defineConfig({
  entry: { index: "src/index.ts", engine: "src/engine.ts" },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  target: "es2022",
  splitting: false,
  sourcemap: true,
})
