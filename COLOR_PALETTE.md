# Color Palette Documentation

## Primary Colors

### Main Brand Color
- **Primary**: `#486371` - Main color used in buttons, backgrounds, and key UI elements
- **Primary Light**: `#5a7482` - Lighter variant for hover states and highlights
- **Primary Dark**: `#3a4f5a` - Darker variant for pressed states and emphasis
- **Primary Lighter**: `#6b8591` - Even lighter for subtle accents
- **Primary Darker**: `#2e3f47` - Darkest variant for strong emphasis

### Text Colors
- **Text Primary**: `#121212` - Main font color for headings and important text
- **Text Secondary**: `#4a4a4a` - Secondary text color for body content
- **Text Muted**: `#6b6b6b` - Muted text for less important information
- **Text Light**: `#ffffff` - Light text for use on dark backgrounds

### Background Colors
- **Background**: `#ffffff` - Main background color
- **Background Secondary**: `#f8f9fa` - Secondary background for cards and sections
- **Background Tertiary**: `#f1f3f4` - Tertiary background for subtle sections

### Border Colors
- **Border**: `#e1e5e9` - Standard border color
- **Border Light**: `#f0f2f4` - Light borders for subtle divisions
- **Border Dark**: `#c8d0d6` - Darker borders for emphasis

### Status Colors
- **Success**: `#10b981` - Green for success states
- **Warning**: `#f59e0b` - Orange for warning states
- **Error**: `#ef4444` - Red for error states
- **Info**: `#3b82f6` - Blue for informational states

## Usage Guidelines

### CSS Custom Properties
All colors are defined as CSS custom properties in `:root` and can be used throughout the application:

```css
/* Example usage */
.my-button {
  background-color: var(--color-primary);
  color: var(--color-text-light);
  border: 1px solid var(--color-primary);
}

.my-button:hover {
  background-color: var(--color-primary-dark);
}
```

### Dark Mode Support
The color palette includes dark mode variants that automatically apply based on the user's system preference:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-text-primary: #ffffff;
    --color-background: #1a1a1a;
    /* ... other dark mode colors */
  }
}
```

### Color Combinations
- **Primary + Light Text**: Use `var(--color-primary)` background with `var(--color-text-light)` text
- **Secondary Background + Primary Text**: Use `var(--color-background-secondary)` background with `var(--color-text-primary)` text
- **Borders**: Use `var(--color-border)` for standard borders, `var(--color-border-light)` for subtle divisions

## Implementation Notes

1. All colors are defined in `src/index.css` as CSS custom properties
2. The color system supports both light and dark modes
3. Colors are semantic and can be easily maintained by updating the CSS custom properties
4. The palette provides sufficient contrast ratios for accessibility
5. Status colors follow common UI patterns (green for success, red for errors, etc.)

## Accessibility

The color palette has been designed with accessibility in mind:
- High contrast ratios between text and background colors
- Color is not the only way information is conveyed
- Dark mode support for users who prefer it
- Focus states are clearly defined with outline colors
