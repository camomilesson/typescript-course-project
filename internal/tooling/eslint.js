import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import { defineConfig } from "eslint/config"

/** @param {string} directory */
export default function eslintConfig(directory) {
  return defineConfig([
    {
      files: ["**/*.{js,mjs,cjs,ts,tsx}"],
      extends: [
        js.configs.recommended,
        tseslint.configs.recommendedTypeChecked,
      ],
      languageOptions: {
        globals: globals.node,
        parserOptions: {
          projectService: true,
          tsconfigRootDir: directory,
        },
      },
    },
  ])
}
