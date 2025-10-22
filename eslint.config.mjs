// ESLint v9+ Flat Config (optional). If you use this, remove .eslintrc.*
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,cjs,mjs,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module"
    },
    plugins: { prettier: eslintPluginPrettier },
    rules: {
      "prettier/prettier": "warn"
    }
  }
];
