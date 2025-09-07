# types directory

Central place for ambient and shared TypeScript declarations.

Contents:
- global.d.ts – ambient declarations for asset imports (mp3, yaml, svg).

Guidelines:
1. Keep ambient declarations minimal; avoid polluting the global scope unnecessarily.
2. Prefer explicit, module-scoped types in source files unless truly global.
3. When adding new asset types (e.g. images), place them in `global.d.ts` and keep them grouped.
4. For domain models (VocabularyEntry, Lesson, etc.), consider:
   - Define interfaces/types in `src/domain/` (preferred) and only move here if needed globally.
   - Validate runtime data with a schema library (e.g. zod) and export the inferred TypeScript types.
5. If a declaration starts as `unknown`, refine it once the data shape stabilizes.

Migration notes:
- During the JS→TS transition, expect mixed `.jsx` and `.tsx`. The ESLint config supports both.
- After most components are converted, we can tighten rules (e.g. elevate some warnings to errors).

Next potential steps (optional):
- Add a dedicated `tsconfig.json` `types` entry pointing to this folder if needed (currently TypeScript will pick up `.d.ts` files automatically).
- Introduce a `src/types/` or `src/domain/` directory for domain-specific types distinctly from ambient declarations.