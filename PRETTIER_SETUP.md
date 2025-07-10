# Prettier Configuration for Long ClassNames

## Overview

This project has been configured to automatically format long classNames across multiple lines for better readability and maintainability.

## Configuration Changes

### 1. Updated `.prettierrc.json`

Added the following configuration options:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "htmlWhitespaceSensitivity": "css",
  "bracketSameLine": false,
  "jsxSingleQuote": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 2. Installed Tailwind CSS Prettier Plugin

- **Package**: `prettier-plugin-tailwindcss`
- **Purpose**: Automatically sorts Tailwind CSS classes in a consistent order and handles long className strings intelligently

## Before and After Examples

### Before Formatting:

```tsx
className={`fixed top-30 z-30 bg-white border border-wds-gray-20 rounded-lg p-2 cursor-pointer transition-all duration-300 ease-in-out shadow-lg hover:bg-wds-gray-5 hover:shadow-xl flex items-center justify-center text-auditinsight-primary ${
  isOpen ? "right-84" : "right-4"
}`}
```

### After Formatting:

```tsx
className={`border-wds-gray-20 hover:bg-wds-gray-5 text-auditinsight-primary fixed top-30 z-30 flex cursor-pointer items-center justify-center rounded-lg border bg-white p-2 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl ${
  isOpen ? "right-84" : "right-4"
}`}
```

## Key Benefits

1. **Automatic Class Sorting**: Tailwind classes are automatically sorted in a consistent, logical order
2. **Better Readability**: Long classNames are broken into manageable lines
3. **Consistent Formatting**: All team members will have the same formatting applied automatically
4. **Maintainability**: Easier to scan and modify className strings

## Usage

### Automatic Formatting

- **VS Code**: Save any file to trigger auto-formatting (if you have Prettier extension installed)
- **Command Line**: Run `npx prettier --write "src/**/*.{ts,tsx,js,jsx}"`

### Manual Formatting

To format specific files:

```bash
# Format a single file
npx prettier --write src/app/components/MyComponent.tsx

# Format all TypeScript/React files
npx prettier --write "src/**/*.{ts,tsx}"

# Format all files in components directory
npx prettier --write "src/app/components/**/*.tsx"
```

## Class Ordering

The Tailwind CSS plugin automatically orders classes in this sequence:

1. Layout (display, position, etc.)
2. Flexbox & Grid
3. Spacing (margin, padding)
4. Sizing (width, height)
5. Typography
6. Backgrounds
7. Borders
8. Effects (shadows, opacity)
9. Filters
10. Tables
11. Transitions & Animations
12. Transforms

## Integration with Development Workflow

### Pre-commit Hooks (Recommended)

Consider adding a pre-commit hook to automatically format files:

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["prettier --write", "git add"]
  }
}
```

### VS Code Settings

Add to your VS Code settings for automatic formatting:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Troubleshooting

### Common Issues

1. **Plugin not working**: Ensure `prettier-plugin-tailwindcss` is installed in your project
2. **Classes not sorting**: Check that the plugin is listed in your `.prettierrc.json` plugins array
3. **Formatting conflicts**: Make sure no other formatters are conflicting with Prettier

### Verification

To verify the setup is working:

1. Create a component with a long className
2. Save the file or run Prettier manually
3. Check that classes are sorted and formatted properly

## Files Updated

All component files have been automatically formatted with the new configuration:

- All files in `src/app/components/` and subdirectories
- Consistent className formatting applied throughout the codebase
