import js from "@eslint/js"
import tseslint from "typescript-eslint"

export default tseslint.config(
  { ignores: ["**/dist/**", "**/raycast-env.d.ts", "**/node_modules/**", "release/**", "packages/core/src/data/snapshot.json"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ["**/*.ts", "**/*.tsx"], rules: { "no-undef": "off" } },
  { files: ["**/*.mjs"], languageOptions: { globals: { process: "readonly", console: "readonly", URL: "readonly", Buffer: "readonly" } } },
  { files: ["apps/web/**/*.ts"], languageOptions: { globals: { document: "readonly", window: "readonly", navigator: "readonly", HTMLElement: "readonly", HTMLInputElement: "readonly", HTMLSelectElement: "readonly", URL: "readonly", URLSearchParams: "readonly", history: "readonly", location: "readonly" } } },
)
