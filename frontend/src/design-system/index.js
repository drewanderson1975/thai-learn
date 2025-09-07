/**
 * Design System Components
 * 
 * Central export for all design system components and tokens
 */

// Tokens
export * from './tokens.js';

// Components
export { default as Badge } from './Badge.jsx';
export { default as Button } from './Button.jsx';
export { default as Card, CardHeader, CardContent, CardFooter } from './Card.jsx';

// Component mappings for easy access
export const components = {
  Badge,
  Button, 
  Card,
  CardHeader,
  CardContent,
  CardFooter,
};

// Re-import for direct usage
import Badge from './Badge.jsx';
import Button from './Button.jsx';
import Card, { CardHeader, CardContent, CardFooter } from './Card.jsx';