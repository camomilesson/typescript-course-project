import eslintConfig from "tooling/eslint"

export default [{ ignores: ["dist/**"] }, ...eslintConfig(import.meta.dirname)]
