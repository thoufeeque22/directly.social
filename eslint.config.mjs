import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import sonarjs from "eslint-plugin-sonarjs";
import pluginSecurity from "eslint-plugin-security";

const downgradeToWarning = (config) => ({
  ...config,
  rules: Object.fromEntries(
    Object.entries(config.rules || {}).map(([rule, val]) => [
      rule,
      Array.isArray(val) ? ["warn", ...val.slice(1)] : (val === "error" || val === 2 ? "warn" : val)
    ])
  )
});

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  downgradeToWarning(sonarjs.configs.recommended),
  pluginSecurity.configs.recommended,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-e2e/**",
    "out/**",
    "build/**",
    "ios/**",
    "android/**",
    "next-env.d.ts",
    "run_ollama_audit.js",
  ]),
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          "selector": "JSXAttribute[name.name='legacyBehavior']",
          "message": "legacyBehavior is deprecated in Next.js 15+ and will be removed. Use the modern Link pattern instead."
        }
      ],
      "no-restricted-imports": ["error", {
        "patterns": [{
          "group": ["**/lib/platforms/*", "**/lib/worker/*"],
          "message": "Platform SDKs and Worker logic are server-only. Use Server Actions or API routes instead."
        }]
      }]
    }
  },
  {
    files: ["src/**/*.{ts,tsx,js,jsx}", "scripts/**/*.{ts,tsx,js,jsx}"],
    ignores: [
      "src/__tests__/**",
      "src/auth.ts",
      "src/lib/infrastructure/database/prisma.ts"
    ],
    rules: {
      "max-lines": ["error", { "max": 100, "skipBlankLines": true, "skipComments": true }]
    }
  },
  {
    files: [
      "src/app/api/**/*.ts", 
      "src/app/actions/**/*.ts", 
      "src/lib/worker/**/*.ts",
      "src/lib/platforms/**/*.ts",
      "src/lib/inngest/**/*.ts",
      "src/lib/infrastructure/**/*.ts",
      "src/__tests__/**/*.ts", 
      "src/__tests__/**/*.tsx",
      "scripts/**/*.ts",
      "src/lib/core/di.ts",
      "src/lib/services/linkedin-auth.ts"
    ],
    rules: {
      "no-restricted-imports": "off"
    }
  }
]);

export default eslintConfig;
