# Design System Documentation

## Overview

The Thai Learn design system provides a consistent foundation for building UI components. It includes design tokens, reusable components, and guidelines that ensure visual and functional consistency across the application.

## Design Tokens

Located in `/src/design-system/tokens.js`, these tokens define the core design values:

### Colors
- **Primary**: #1E40AF (Deep Royal Blue) - main brand color
- **Secondary**: #DC2626 (Bright Red) - secondary actions  
- **Accent**: #FACC15 (Golden Yellow) - highlight actions
- **Neutral**: #334155 (Slate Gray) - text and borders

### Typography
- **Heading**: Inter, Poppins - for headings and titles
- **Body**: Roboto, Noto Sans - for body text
- **Thai**: Sarabun - for Thai language content

### Spacing & Layout
- Standard spacing scale from 4px (xs) to 48px (3xl)
- Border radius with 16px (2xl) as default per guidelines
- Font sizes from 12px (xs) to 48px (5xl)

## Components

### Badge

Used for status indicators, lesson types, and consonant classes.

```jsx
import { Badge } from '../design-system';

// Status badges
<Badge variant="outstanding">Outstanding</Badge>
<Badge variant="inProgress">In progress</Badge>
<Badge variant="complete">Complete</Badge>

// Consonant class badges
<Badge variant="high">High class</Badge>
<Badge variant="mid">Mid class</Badge>
<Badge variant="low">Low class</Badge>

// Lesson type badges
<Badge variant="core">Core</Badge>
<Badge variant="practice">Practice</Badge>
<Badge variant="phrasebook">Phrasebook</Badge>
```

**Available variants:**
- `outstanding`, `inProgress`, `complete` - for status
- `high`, `mid`, `low` - for consonant classes
- `core`, `practice`, `phrasebook` - for lesson types
- `primary`, `secondary`, `accent`, `success`, `warning`, `error`, `info` - generic

**Sizes:** `sm`, `md`, `lg`

### Button

Consistent button styling with multiple variants.

```jsx
import { Button } from '../design-system';

<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="accent">Accent Action</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="outline">Outline Button</Button>
```

**Available variants:**
- `primary` - main actions (blue)
- `secondary` - secondary actions (gray)
- `accent` - highlight actions (yellow)
- `outline` - outlined style
- `ghost` - minimal style
- `danger` - destructive actions (red)

**Sizes:** `sm`, `md`, `lg`, `xl`

### Card

Base container component following the design system.

```jsx
import { Card, CardHeader, CardContent, CardFooter } from '../design-system';

<Card size="md" variant="default">
  <CardHeader>Header content</CardHeader>
  <CardContent>Main content</CardContent>
  <CardFooter>Footer content</CardFooter>
</Card>
```

**Available variants:**
- `default` - standard card with border
- `elevated` - with shadow
- `outlined` - with thicker border
- `ghost` - transparent background

**Sizes:** `sm`, `md`, `lg`, `xl`

## Usage Guidelines

### Import Pattern
```jsx
import { Badge, Button, Card } from '../design-system';
```

### Styling Philosophy
- Use design system components instead of custom Tailwind classes
- Maintain consistency with existing component patterns
- Follow the PROJECT_GUIDELINES.md for color and typography usage

### Component Refactoring
When refactoring existing components:
1. Replace hardcoded styles with design system components
2. Maintain existing visual appearance
3. Use appropriate variants that match the original styling
4. Test thoroughly to ensure no visual regressions

## Components Using Design System

### ThaiGlyphTile
- Uses `Card` for container
- Uses `Badge` for consonant class and status indicators
- Uses `Button` for edit actions

### LessonCard  
- Uses `Card` for container
- Uses `Badge` for lesson type indicators

## Future Enhancements

- Add more component variants as needed
- Extend spacing and typography scales
- Add animation/transition tokens
- Create composition utilities for common patterns