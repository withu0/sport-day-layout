# Tailwind CSS Setup Documentation

## Installation Complete ✅

Tailwind CSS has been successfully installed and configured for your Vite React project with your custom color palette.

## What's Been Installed

```bash
npm install -D tailwindcss postcss autoprefixer
```

## Configuration Files Created

### 1. `tailwind.config.js`
- Configured with your custom color palette
- Content paths set for Vite React project
- Custom colors mapped to your specifications:
  - Primary: `#486371`
  - Text Primary: `#121212`
  - All color variations included

### 2. `postcss.config.js`
- PostCSS configuration for Tailwind processing
- Autoprefixer included for browser compatibility

## Color Palette Integration

Your custom colors are now available as Tailwind utilities:

### Primary Colors
```html
<!-- Background colors -->
<div class="bg-primary">Primary background</div>
<div class="bg-primary-light">Light primary</div>
<div class="bg-primary-dark">Dark primary</div>

<!-- Text colors -->
<p class="text-primary">Primary text</p>
<p class="text-text-primary">Main text color</p>
<p class="text-text-secondary">Secondary text</p>
<p class="text-text-muted">Muted text</p>
```

### Background Colors
```html
<div class="bg-background">Main background</div>
<div class="bg-background-secondary">Secondary background</div>
<div class="bg-background-tertiary">Tertiary background</div>
```

### Border Colors
```html
<div class="border border-border">Standard border</div>
<div class="border border-border-light">Light border</div>
<div class="border border-border-dark">Dark border</div>
```

## Custom Components

### Button Component
```html
<button class="btn-primary">Primary Button</button>
```
This uses the custom `.btn-primary` class defined in your CSS.

### Card Component
```html
<div class="card">Card content</div>
```
This uses the custom `.card` class with your styling.

## CSS Integration

### Updated Files
1. **`src/index.css`** - Added Tailwind directives and custom layers
2. **`src/App.css`** - Converted to use Tailwind utilities
3. **`src/App.tsx`** - Updated to use Tailwind classes

### CSS Layers Used
- `@layer base` - Base styles that work with Tailwind
- `@layer components` - Custom component styles
- `@layer utilities` - Additional utility classes

## Usage Examples

### Basic Layout
```html
<div class="min-h-screen bg-background">
  <div class="max-w-5xl mx-auto p-8">
    <h1 class="text-5xl font-bold text-text-primary mb-8">
      Your Title
    </h1>
  </div>
</div>
```

### Button with Hover Effects
```html
<button class="btn-primary hover:scale-105 transition-transform">
  Click me
</button>
```

### Card with Custom Styling
```html
<div class="card max-w-md mx-auto">
  <h2 class="text-xl font-semibold text-text-primary mb-4">Card Title</h2>
  <p class="text-text-secondary">Card content goes here</p>
</div>
```

## Dark Mode Support

Your color palette includes dark mode support that automatically activates based on system preferences:

```css
@media (prefers-color-scheme: dark) {
  /* Dark mode colors are automatically applied */
}
```

## Development Workflow

1. **Start development server**: `npm run dev`
2. **Use Tailwind classes**: Add utility classes directly in your JSX
3. **Custom components**: Use the predefined `.btn-primary` and `.card` classes
4. **Color consistency**: All colors use your defined palette

## Available Tailwind Classes

### Spacing
- `p-8`, `px-5`, `py-3` - Padding
- `m-4`, `mx-auto`, `mb-8` - Margins
- `gap-8`, `space-y-4` - Gaps and spacing

### Typography
- `text-5xl`, `text-xl`, `text-sm` - Font sizes
- `font-bold`, `font-medium`, `font-semibold` - Font weights
- `text-center`, `text-left` - Text alignment

### Layout
- `flex`, `grid` - Display types
- `justify-center`, `items-center` - Flexbox alignment
- `max-w-5xl`, `max-w-md` - Max widths
- `min-h-screen` - Min heights

### Colors (Your Custom Palette)
- `bg-primary`, `text-primary` - Primary colors
- `bg-background`, `text-text-primary` - Background and text
- `border-border` - Border colors

## Next Steps

1. **Start building**: Use Tailwind classes in your components
2. **Customize**: Add more custom components in the `@layer components` section
3. **Extend**: Add more colors or utilities to `tailwind.config.js` as needed
4. **Optimize**: Tailwind will automatically purge unused styles in production

Your Tailwind CSS setup is now complete and ready for development! 🎉
