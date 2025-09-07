# TypeScript Migration Inventory

Last updated: 2025-09-07 18:48 UTC  
Maintainer: (add name)  
Source inventory basis: Manual file list (REPO_CONTENT.md provided in chat)

---

## 1. Purpose & Goals

**Why migrate (or complete migration):**  
- Strengthen refactor safety for UI and data-driven letter/lesson features.  
- Provide reliable contracts for dynamic content loaded from JSON/YAML (alphabet, lessons, phrases, words).  
- Reduce runtime bugs in hooks (`useLettersData`) and admin/editor surfaces.  
- Support future expansion (spaced repetition logic, progress tracking, auth/admin features).  

**Initial non-goals (can be revisited):**  
- Converting back-end (`backend/`) placeholder structure (no actual code yet).  
- Converting build / content generation scripts unless they become shared runtime libraries.  
- Immediate full runtime schema validation (can add zod/io-ts later).

---

## 2. Migration Phases (Overview)

| Phase | Scope | Outcome | Exit Criteria |
|-------|-------|---------|---------------|
| 0 | Tooling bootstrap | tsconfig + deps + typecheck script | `npm run typecheck` passes (allowing JS) |
| 1 | App Shell | `main.jsx`, `App.jsx`, layout + navigation | Core routes typed |
| 2 | Shared Components | Components (non-admin first) | Prop interfaces established |
| 3 | Data Models & Hooks | `useLettersData`, data interfaces | Letter/Lesson types consumed everywhere |
| 4 | Pages | All route pages to TSX | No remaining .jsx in `pages/` |
| 5 | Content & Editor | Admin/editor components (LetterEditorModal, AdminGate) | Editing paths safe |
| 6 | Strictness Ramp | Enable strict TS flags | Zero errors with chosen flags |
| 7 | Cleanup & Hardening | Remove temporary anys, add runtime checks | Audited models + CI gate |

---

## 3. Repository Structure (Relevant for TS)

| Directory | Contents Summary | Migration Priority | Notes |
|-----------|------------------|--------------------|-------|
| frontend/src/ | App, pages, components, hooks, data | High | Primary focus |
| frontend/src/components/primitives/ | Already in TS/TSX | Done (baseline) | Ensure naming consistency (Index.ts → index.ts) |
| frontend/src/pages/ | 11 page-level JSX files | High | Thin wrappers |
| frontend/src/components/ | 13 JSX components (UI & admin/editor) | High | Define prop interfaces |
| frontend/src/hooks/ | `useLettersData.js` | High | Data shape centralization |
| frontend/src/content/lessons/ | Mixed JSX + index.js | Medium | Treat as typed modules |
| frontend/src/data/ | JSON data (alphabet, lessons, words, phrases) | Medium | Add model interfaces |
| frontend/content/alphabet/* | 40 YAML letter definition files | Medium | Consider generation |
| frontend/public/assets/audio/letters/ | 37 mp3 audio files | Low | Declarations if imported |
| scripts/ | Node scripts (.cjs/.js/.mjs) | Low | Leave JS early |
| servers/ | Node server prototype | Low/Separate | Separate track |
| backend/ | Placeholders only (.gitkeep) | Defer | No impact now |

---

## 4. Quantitative Snapshot

| Metric | Count / Value | Notes |
|--------|---------------|-------|
| .jsx files (to convert) | 24 | Full list below |
| Existing .ts / .tsx files | 6 (3 TSX, 3 TS) | primitives + util |
| Hooks (JS) | 1 (`useLettersData.js`) | High leverage |
| Page components (.jsx) | 11 | Convert after models |
| Non-component JS (lib) | 2 (`admin.js`, `firebase.js`) | Add types soon |
| Content scripts (.mjs/.cjs/.js) | 6 | Leave JS for now |
| YAML letter files | 40 | Candidate for generated types |
| Audio assets (mp3) | 37 | Provide module typing |
| JSON data files (domain) | 4 | Model interface coverage |
| Config JS (eslint, vite, tailwind) | 3 | Keep JS |

---

## 5. Baseline Task Checklist

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Add `tsconfig.json` | TODO |  | Start permissive (`allowJs`) |
| Install `typescript`, `@types/react`, `@types/react-dom` | TODO |  | Pin versions |
| Add `npm run typecheck` (`tsc --noEmit`) | TODO |  | |
| ESLint TypeScript integration | TODO |  | `typescript-eslint` flat config |
| Ambient declaration file (`global.d.ts`) | TODO |  | mp3, yaml, svg |
| Create `types/letters.ts` & `types/lessons.ts` | TODO |  | Base schemas |
| Convert primitives index naming (Index.ts → index.ts) | TODO |  | Consistency |
| Convert App shell to TSX | TODO |  | `main.jsx`, `App.jsx` |
| Introduce CI typecheck (GitHub Action) | TODO |  | After Phase 1 |
| Gradually enable strict flags | TODO |  | Section 11 |
| Remove legacy anys / index signatures | TODO |  | Final phase |

---

## 6. Detailed File Inventory & Suggested Plan

### 6.1 JSX Components & Pages (24)

| File | Category | Target | Complexity (1–5) | Notes |
|------|----------|--------|------------------|-------|
| src/main.jsx | Bootstrap | main.tsx | 1 | Straight rename |
| src/App.jsx | Router root | App.tsx | 2 | Add route element types |
| components/Layout.jsx | Layout | Layout.tsx | 1 | No props |
| components/NavBar.jsx | Navigation | NavBar.tsx | 2 | `NavLink` generics optional |
| components/Header.jsx | UI | Header.tsx | 1 | Static props |
| components/Footer.jsx | UI | Footer.tsx | 1 | Simple |
| components/Breadcrumbs.jsx | UI util | Breadcrumbs.tsx | 2 | Provide crumb shape |
| components/LessonCard.jsx | Card UI | LessonCard.tsx | 3 | Define LessonCardProps |
| components/ThaiGlyphTile.jsx | Data UI | ThaiGlyphTile.tsx | 4 | Letter model integration |
| components/LetterEditorModal.jsx | Editor UI | LetterEditorModal.tsx | 4 | Modal + edit state types |
| components/AdminGate.jsx | Auth/UI | AdminGate.tsx | 3 | Gate state shape |
| components/AdminOnly.jsx | Auth wrapper | AdminOnly.tsx | 2 | Children typing |
| components/InfoPopover.jsx | UI | InfoPopover.tsx | 2 | Possibly generic content |
| content/lessons/alphabet-consonants-1.jsx | Lesson module | alphabet-consonants-1.tsx | 3 | Export typed lesson meta |
| pages/AlphabetMid.jsx | Page | AlphabetMid.tsx | 2 | Filter logic typed |
| pages/AlphabetHigh.jsx | Page | AlphabetHigh.tsx | 2 | Similar pattern |
| pages/AlphabetLow.jsx | Page | AlphabetLow.tsx | 2 | Similar pattern |
| pages/AlphabetIndex.jsx | Page | AlphabetIndex.tsx | 1 | Index aggregator |
| pages/Home.jsx | Page | Home.tsx | 1 | Static |
| pages/Lessons.jsx | Page | Lessons.tsx | 2 | Lesson list typed |
| pages/LessonDetail.jsx | Page | LessonDetail.tsx | 3 | Route param typing |
| pages/WordsIndex.jsx | Page | WordsIndex.tsx | 2 | Data list typing |
| pages/PhrasesIndex.jsx | Page | PhrasesIndex.tsx | 2 | Data list typing |
| pages/Progress.jsx | Page | Progress.tsx | 1 | Placeholder now |

### 6.2 Existing TypeScript / TSX (6)

| File | Role | Follow-up |
|------|------|-----------|
| primitives/Badge.tsx | UI primitive | Add generics if needed |
| primitives/Card.tsx | UI primitive | Ensure children typing |
| primitives/Typography.tsx | Typography system | Consider variant unions |
| primitives/Index.ts | Barrel | Rename to `index.ts` |
| primitives/theme.ts | Theme tokens | Convert tokens to `as const` |
| primitives/utils/cn.ts | Class utility | Type arguments strictly |

### 6.3 Hooks & Libraries

| File | Type | Target | Notes |
|------|------|--------|-------|
| hooks/useLettersData.js | Hook | useLettersData.ts | Assert `Letter[]` shape |
| lib/admin.js | Utility | admin.ts | Role / auth typing |
| lib/firebase.js | Utility | firebase.ts | Typed exports |
| content/lessons/index.js | Content index | index.ts | Registry Record<string, LessonContent> |

### 6.4 Data & Content

| File(s) | Type | Action | Notes |
|---------|------|--------|-------|
| data/alphabet/letters.json | JSON | Map to `Letter[]` | Possibly group by class |
| data/lessons.json | JSON | Map to `Lesson[]` | Add level enum later |
| data/lexicon/words.json | JSON | Map to `Word[]` | Provide Word interface |
| data/phrasebook/phrases.json | JSON | Map to `Phrase[]` | Provide Phrase interface |
| content/alphabet/**/*.yaml | YAML | (Option) generate TS | Build-time typed module |
| public/assets/audio/letters/*.mp3 | Media | Module declaration | `declare module "*.mp3"` |

---

## 7. Data Model Drafts

```ts
// types/letters.ts
export interface LetterAudio {
  glyph?: string;
  [k: string]: unknown;
}

export type ConsonantClass = "High" | "Mid" | "Low";

export interface Letter {
  id: string;
  glyph: string;
  type: "consonant" | "vowel" | "tone-mark" | string;
  consonantClass?: ConsonantClass;
  nameThai?: string;
  nameRtgs?: string;
  nameGloss?: string;
  ipa?: string;
  ipaNote?: string;
  initial?: string;
  final?: string;
  tip?: string;
  rtgs?: string;
  review?: boolean;
  audio?: LetterAudio;
  // TEMP looseness – remove after audit
  [k: string]: unknown;
}

// types/lessons.ts
export interface Lesson {
  slug: string;
  title: string;
  description: string;
  level?: number | string;
  badge?: string;
  locked?: boolean;
}

// types/words.ts
export interface Word {
  id?: string;
  thai: string;
  transliteration?: string;
  ipa?: string;
  meaning: string;
  audio?: string;
  [k: string]: unknown;
}

// types/phrases.ts
export interface Phrase {
  id?: string;
  thai: string;
  transliteration?: string;
  meaning: string;
  audio?: string;
  [k: string]: unknown;
}
```

Tightening steps later: remove index signatures; refine `type` union; add runtime validation (optional).

---

## 8. Conversion Order (Detailed Execution Plan)

1. Phase 0: Add `tsconfig.json`, dependencies, ambient declarations, typecheck script.  
2. Phase 1: Convert `main.jsx`, `App.jsx`, Layout family (Header, NavBar, Footer, Breadcrumbs).  
3. Phase 2: Convert primitives barrel naming + ensure prop generics; migrate remaining shared components (LessonCard, InfoPopover).  
4. Phase 3: Introduce `types/` models (Letter, Lesson, Word, Phrase). Convert `useLettersData.js` to TS using models.  
5. Phase 4: Convert all alphabet + lesson-related pages (batch PR).  
6. Phase 5: Migrate editor/admin components (LetterEditorModal, AdminGate, AdminOnly) and lib utilities (`admin.js`, `firebase.js`).  
7. Phase 6: Content/lesson modules & content index. Optional: YAML → generated `.ts` modules (script).  
8. Phase 7: Strict flags ramp (see Section 11).  
9. Phase 8: Remove temporary anys, finalize unions, CI gating.  

---

## 9. Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Hidden optional fields in YAML cause type mismatches | Medium | Medium | Start with optional fields + runtime guard |
| Firebase module shape changes | Medium | Low | Adapter wrapper with explicit exports |
| Overuse of `any` during transition | High | Medium | Enforce lint rule & TODO(any) tag |
| YAML structural drift vs interface | Medium | Medium | Build-time schema validation |
| Editor modal complex local state | Medium | Medium | Early prop/state interface |

---

## 10. Conventions

- Components: `.tsx`, utilities (no JSX): `.ts`.  
- Named exports preferred; default export OK for route pages.  
- Prop interfaces co-located; split large ones into `*.types.ts` if needed.  
- Use `ReadonlyArray<T>` for constant lists.  
- Tag temporary looseness: `// TODO(any): reason (remove by YYYY-MM-DD)`.  
- Delay path aliases until structure stable.  
- Avoid broad re-export barrels early (limit churn).  

---

## 11. Strictness Ramp Plan

| Stage | Flags Introduced | Prerequisite | Notes |
|-------|------------------|-------------|-------|
| S1 | `strictNullChecks` | Phases 1–4 done | Catch null/undefined early |
| S2 | `noImplicitAny`, `noImplicitThis` | Models + hooks stable | Forces explicitness |
| S3 | `noUncheckedIndexedAccess` | Data pages converted | Stronger data safety |
| S4 | `exactOptionalPropertyTypes` | Optional props audited | Avoid silent widening |
| S5 | Full `strict` | All pages/components typed | Baseline finish |
| S6 | Remove `skipLibCheck` (optional) | Library type noise resolved | Stretch goal |

---

## 12. Progress Log

| Date | Action | Notes |
|------|--------|-------|
| (plan) | Add tsconfig & deps |  |
| (plan) | Convert shell (main/App/Layout) |  |
| (plan) | Add models + convert hook |  |
| (plan) | Pages batch converted |  |
| (plan) | strictNullChecks enabled |  |
| (plan) | noImplicitAny enabled |  |
| (plan) | Final strict pass |  |

---

## 13. Checklist

### Core Setup
- [ ] tsconfig.json
- [ ] TypeScript deps installed
- [ ] global.d.ts (mp3, yaml, svg)
- [ ] Typecheck npm script
- [ ] ESLint TS config

### App Shell & Layout
- [ ] main.tsx
- [ ] App.tsx
- [ ] Layout.tsx
- [ ] NavBar.tsx
- [ ] Header.tsx
- [ ] Footer.tsx
- [ ] Breadcrumbs.tsx

### Components / UI
- [ ] LessonCard.tsx
- [ ] ThaiGlyphTile.tsx
- [ ] InfoPopover.tsx
- [ ] LetterEditorModal.tsx
- [ ] AdminGate.tsx
- [ ] AdminOnly.tsx

### Data & Hooks
- [ ] types/letters.ts
- [ ] types/lessons.ts
- [ ] types/words.ts
- [ ] types/phrases.ts
- [ ] useLettersData.ts
- [ ] content/lessons/index.ts

### Pages
- [ ] Alphabet pages (Mid/High/Low/Index)
- [ ] Lessons.tsx
- [ ] LessonDetail.tsx
- [ ] Home.tsx
- [ ] WordsIndex.tsx
- [ ] PhrasesIndex.tsx
- [ ] Progress.tsx
- [ ] alphabet-consonants-1.tsx

### Libraries
- [ ] firebase.ts
- [ ] admin.ts

### Strictness & Cleanup
- [ ] strictNullChecks
- [ ] noImplicitAny
- [ ] noUncheckedIndexedAccess
- [ ] Remove temporary anys
- [ ] CI Gate (GitHub Action)

---

## 14. Example tsconfig (Initial Permissive)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
    "moduleResolution": "NodeNext",
    "allowJs": true,
    "checkJs": false,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "strict": false,
    "baseUrl": "./frontend/src"
  },
  "include": ["frontend/src", "types"],
  "exclude": ["node_modules", "dist", "scripts"]
}
```

Later: enable `strict`, drop `allowJs`, consider removing `skipLibCheck`.

---

## 15. Ambient Declarations (global.d.ts Example)

```ts
declare module "*.mp3" {
  const src: string;
  export default src;
}

declare module "*.yaml" {
  const data: unknown;
  export default data;
}

declare module "*.yml" {
  const data: unknown;
  export default data;
}

declare module "*.svg" {
  import * as React from "react";
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default ReactComponent;
}
```

---

## 16. Optional: YAML → Typed Generation

Concept pipeline:
1. Parse all `frontend/content/alphabet/**/*.yaml`.
2. Validate with JSON schema or zod.
3. Emit `generated/alphabetLetters.ts` with `export const letters: Letter[] = [...] as const;`.
4. Replace raw YAML loading with generated module import.

Benefits: compile-time safety & schema drift control.

---

## 17. Temporary Looseness Removal Plan

| Temporary Measure | Purpose | Removal Condition |
|-------------------|---------|-------------------|
| `[k: string]: unknown` in models | Allow phased discovery | After audit + validation |
| `allowJs` | Incremental migration | Last .js/.jsx converted |
| `skipLibCheck` | Avoid external noise | Dependency types stable |
| Optional wide fields | Avoid premature narrowing | Schema locked |
| Generic string unions | Flexibility early | Replace with explicit unions |

---

## 18. Final Success Criteria

- 100% targeted `.jsx` migrated to `.tsx`.  
- Core domain models have no index signatures.  
- All strict flags active; `tsc --noEmit` clean.  
- Zero untagged `any`.  
- CI blocks merges on type errors.  
- Content schema validated or generated.

---

## 19. Recommended Next Three Actions

1. Add `tsconfig.json` + deps + ambient declarations (Phase 0).  
2. Convert shell (main/App/Layout/NavBar/Header/Footer) + introduce `types/`.  
3. Implement `Letter` & `Lesson` interfaces and convert `useLettersData.js` to TypeScript.  

---

(End of Document)