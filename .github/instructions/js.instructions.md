---
applyTo: "**/*.{js,jsx,ts,tsx}"
description: "JavaScript/TypeScript coding rules"
---

# JavaScript Instructions

## WordPress JavaScript Standards

- Prefer ES modules over CommonJS
- Use `@wordpress/scripts` for builds and linting
- Run `npm run lint` before commits
- Keep DOM interactions block-editor–first (avoid jQuery)

## Development Guidelines

### Modern JavaScript
- Use ES6+ features (arrow functions, destructuring, template literals)
- Prefer `const` and `let` over `var`
- Use async/await for asynchronous operations
- Implement proper error handling with try/catch

### WordPress Block Development
- Use `@wordpress/block-editor` components when possible
- Follow WordPress Gutenberg development patterns
- Implement proper block registration and attributes
- Use WordPress data stores for state management

### Code Quality
- Use ESLint with WordPress configuration
- Format code with Prettier
- Write descriptive function and variable names
- Use JSDoc for function documentation

### Performance
- Minimize bundle size with tree shaking
- Use dynamic imports for code splitting
- Optimize React components with proper memoization
- Avoid unnecessary re-renders

### Testing
- Write unit tests for utility functions
- Use Playwright for end-to-end testing
- Test across different browsers and devices
- Ensure accessibility compliance

### Build Process
- Use `npm run start` for development with hot reload
- Use `npm run build:production` for optimized builds
- Configure webpack through `@wordpress/scripts`
- Optimize assets for production deployment

### WordPress Integration
- Use `wp.hooks` for WordPress action/filter system
- Integrate with WordPress REST API when needed
- Follow WordPress JavaScript coding standards
- Ensure compatibility with WordPress core updates