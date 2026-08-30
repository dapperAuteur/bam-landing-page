import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// Flat config, ESLint 9. This repo had NO eslint config of any kind before 2026-08-30: the `lint`
// script ran `next lint`, which Next 16 removed, and even before that there was nothing on disk for
// it to read. So this is the first working linter here, not a port of an old one.
//
// eslint-config-next 16 ships NATIVE flat configs (arrays) from its `./core-web-vitals` and
// `./typescript` subpaths. Do NOT wrap them in FlatCompat: that is the Next 14/15 recipe, it is
// still all over the web, and against v16 it throws inside @eslint/eslintrc rather than saying so.
export default [
  {
    ignores: [".next/**", "out/**", "build/**", "node_modules/**", "next-env.d.ts", "public/**"],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // OFF, deliberately. The first run reported 895 problems and 629 of them were this one rule:
      // apostrophes and quotation marks in JSX prose. On a blog whose whole content is prose typed
      // into JSX, it fires forever, catches nothing, and buries the ~70 findings that matter. A rule
      // that produces 83% of your output and 0% of your bugs trains you to ignore the linter.
      "react/no-unescaped-entities": "off",

      // WARN, not error. 57 of these accumulated over years with no linter running. They are worth
      // seeing and worth chipping at, but they are not defects, and blocking on them on day one
      // would make the linter's first act be to stop all work.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
