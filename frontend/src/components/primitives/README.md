# Primitives

Lightweight, composable UI building blocks. Keep them *minimal* and push additional styling into higher-level components or feature modules.

## Philosophy
- Small surface area: only add props when there is a repeated, validated use-case.
- Centralize style tokens in `theme.ts` (avoid scattering color/spacing definitions).
- Variants should represent true semantic distinctions (state, emphasis), not arbitrary per-screen tweaks.
- Prefer composition over extending these primitives with one-off booleans.

## Files
| File | Purpose |
| ---- | ------- |
| `utils/cn.ts` | Tiny className combiner. |
| `theme.ts` | Central variant + size maps. Add cautiously. |
| `Card.tsx` | Surface container. Minimal styling + optional interactivity. |
| `Badge.tsx` | Semantic label with variant + soft mode. |
| `Typography.tsx` | `Heading` + `Text` primitives for consistent type scale. |
| `index.ts` | Barrel exports. |

## Card
```tsx
<Card>
  <Heading level={3}>Lesson Overview</Heading>
  <Text size="sm" muted>Quick summary of today's objectives.</Text>
</Card>
```
Options:
- `interactive` adds hover/focus elevation.
- `padded={false}` lets you control spacing manually.

## Badge
```tsx
<Badge variant="success">Correct</Badge>
<Badge variant="warning" soft>Nearly</Badge>
```
- `soft` attempts an automatic translucent style.
- Provide `leadingIcon` / `trailingIcon` for small glyphs.

## Typography
```tsx
<Heading level={2}>Alphabet Basics</Heading>
<Text size="sm" muted>The Thai script has 44 consonant symbols.</Text>
```
- `Heading level` 1–4 only (avoid deeper unless necessary).
- `Text` supports semantic `variant` or quick `muted` toggle.
- Use `as` prop when semantic HTML differs from visual level (e.g., `as="h1" level={2}`).

## Adding a new variant
1. Add token(s) to Tailwind config if needed.
2. Extend the relevant map in `theme.ts`.
3. Update docs/examples only after a real usage emerges.
4. Do *not* inline ad-hoc colors in components; raise a discussion instead.

## Anti-patterns
- Stuffing business logic into primitives.
- Adding layout responsibilities (grid/flex wrappers) here.
- Creating rarely-used one-off variants.

## Next planned primitives
- `LetterGrid` / `LetterTile`
- `Feedback`
- `AudioPlayer`

Keep changes intentional; small diffs make refactors safer.
