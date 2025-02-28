import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    languageOptions: {
      ecmaVersion: "latest", // Active les dernières fonctionnalités JS
      sourceType: "module",  // Si tu utilises import/export, sinon mets "script"
      globals: {
        ...globals.node // Active les globales de Node.js (process, require, etc.)
      }
    },
    rules: {
      "no-undef": "off" // Désactive l’erreur sur require et process
    }
  },
  pluginJs.configs.recommended
];
