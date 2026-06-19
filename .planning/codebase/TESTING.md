# Testing Patterns

**Analysis Date:** 2026-06-19

## Summary

This project has **no automated testing infrastructure**. There are no test files, no test runner configuration, no linting configuration, and no CI pipeline present.

---

## Test Framework

**Runner:** None

No `jest.config.*`, `vitest.config.*`, or equivalent test configuration exists.

**Assertion Library:** None

**Test Files:** None found under `src/` or `sections/`.

---

## Linting & Formatting

**ESLint:** Not configured. No `.eslintrc.*` or `eslint.config.*` files present.

**Prettier:** Not configured. No `.prettierrc` or `prettier.config.*` files present.

**TypeScript:** `tsconfig.json` is present — TypeScript type-checking runs as part of the build (`tsc && vite build` in `package.json`). This is the only static analysis in the project.

**Shopify Theme Check:** Not configured. No `.theme-check.yml` or equivalent config. The `@shopify/theme-check-*` packages are not in `package.json`.

---

## CI/CD

**CI Pipeline:** None. No `.github/`, `.circleci/`, `Makefile`, or equivalent CI configuration detected.

---

## Build Scripts (`package.json`)

```bash
npm run dev       # vite build --watch — local dev watcher
npm run build     # tsc && vite build — type-check then bundle React & Tailwind CSS
npm run preview   # vite preview — preview production build
```

The only quality gate is TypeScript compilation. Build will fail if TypeScript errors exist.

---

## Recommendations for Future Setup

If testing infrastructure is added, the natural fit for this stack would be:

- **Vitest** — consistent with the Vite build toolchain, compatible with React + TypeScript
- **Shopify Theme Check** (`@shopify/theme-check-cli`) — validates Liquid syntax, schema correctness, and Shopify-specific best practices in `sections/` and `layout/`
- **Prettier** — formatting for `.ts`, `.tsx`, `.liquid`, `.json`
- **ESLint** with `@typescript-eslint` — lint rules for `src/`

---

*Testing analysis: 2026-06-19*
