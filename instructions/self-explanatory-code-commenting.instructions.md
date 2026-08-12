---
file_type: instructions
title: Self-Explanatory Code & Commenting Standards
description: Guidelines for writing self-documenting code and adding comments only when necessary to clarify non-obvious intent, constraints, or workarounds.
scope: organization-wide
applyTo: 'src/**'
version: v1.0
last_updated: '2026-05-29'
owners:
- LightSpeedWP Team
tags:
- code-quality
- documentation
- best-practices
- readability
status: active
---

# Self-Explanatory Code & Commenting Standards

You are a LightSpeedWP code clarity champion. Follow our commenting standards to write code that explains itself through clear naming, structure, and intent. Add comments only to clarify the WHY, not the WHAT—well-named identifiers already do that. Avoid comment clutter that rots as code evolves.

## Overview

Defines standards for writing self-documenting code and applying comments judiciously. Emphasises that good code structure, meaningful names, and clear logic reduce the need for comments. Comments exist to explain non-obvious decisions, hidden constraints, subtle invariants, and workarounds—not to restate what the code obviously does.

**What this covers:**

- Naming conventions for variables, functions, classes, modules
- Code structure and readability practices
- When comments are necessary (and when they're not)
- Comment tone and style
- Avoiding comment rot

**What this does not cover:**

- Code organisation or architectural patterns (language-specific instruction files)
- API documentation (covered by language-specific doc standards)

## General Rules

- **Code is the primary documentation:** Well-named identifiers, clear logic flow, and consistent structure are your first line of clarity
- **Comments explain WHY, not WHAT:** Don't comment obvious code; comment non-obvious decisions, constraints, or workarounds
- **No comment clutter:** Remove comments that state what code obviously does; they rot and confuse as code evolves
- **One-line comments only:** Use concise single-line comments; multi-paragraph docstrings are reserved for function/module APIs only
- **Treat comments as technical debt:** If code needs a comment to be clear, first consider refactoring to make it self-explanatory
- **No references to tasks/issues in comments:** Use PR descriptions and commit messages for context; comments should survive refactoring

## Detailed Guidance

### Naming Conventions

Use full, descriptive names that express intent:

- **Functions:** Use verbs that describe actions: `calculateTotalPrice`, `validateEmail`, `fetchUserProfile`
- **Variables:** Use nouns that describe what's stored: `userCount`, `isActive`, `emailAddress` (not `u`, `a`, `e`)
- **Boolean properties:** Use affirmative predicates: `isActive`, `hasPermission`, `canDelete` (not `isInactive`)
- **Collections:** Use plural nouns: `users`, `items`, `entries` (clarity that it's a collection)
- **Constants:** Use UPPER_SNAKE_CASE: `MAX_RETRIES`, `DEFAULT_TIMEOUT`
- **Classes:** Use PascalCase nouns: `UserManager`, `PaymentProcessor`

### When Comments Are Necessary

Add a comment ONLY when the WHY is non-obvious:

1. **Hidden constraints:** Business rules, API limitations, or performance requirements not obvious from code
   - Example: "Retry up to 3 times because external API has transient failures"

2. **Subtle invariants:** Assumptions about state, ordering, or relationships that aren't enforced by type systems
   - Example: "Array must be sorted before calling binarySearch"

3. **Workarounds:** References to external bugs, known issues, or platform quirks that forced an unusual implementation
   - Example: "iOS Safari doesn't support CSS custom properties in media queries (WebKit bug #XXX)"

4. **Non-obvious performance decisions:** Trade-offs or optimisations that aren't evident from the algorithm
   - Example: "Using a HashSet instead of a List because lookup speed dominates over insertion order"

5. **Complex mathematical or domain logic:** If the logic encodes domain knowledge not obvious from variable names
   - Example: "Leap year calculation: years divisible by 100 are not leap years unless also divisible by 400"

### Code Structure for Clarity

Structure code to be self-explanatory:

- **Extract methods:** Break complex logic into small, named functions; the name explains the step
- **Use intermediate variables:** Instead of a single complex expression, use named variables for sub-expressions
- **Guard clauses:** Return early from conditional branches; avoid deeply nested if/else
- **Consistent patterns:** Repeat the same structure for similar tasks; consistency is clarity
- **Semantic HTML:** Use appropriate elements (`<button>` not `<div onclick>`); markup structure tells the story

### Comment Style

When you do add comments:

- Use lowercase unless starting a proper noun
- Write concise, grammatically correct sentences
- Avoid vague language ("fix bug", "handle edge case") in favour of specifics
- Link to external references when relevant (bug trackers, RFC documents)

### What NOT to Comment

Remove comments that:

- Restate what the code obviously does (`i++` doesn't need "increment i")
- Reference the current task or issue ("Added for feature X", "Handles bug #123") — belongs in commit/PR
- Are left behind from debugging ("TODO: remove this hack")
- Parrot function signatures or obvious control flow

## Examples

**Good:** Clear naming + minimal comment for non-obvious constraint:

```javascript
function calculateShippingCost(weightKg, isInternational) {
  const baseRate = isInternational ? 15 : 5;
  // Royal Mail charges per 500g step; ceil ensures partial kg is billed as full
  const weightSteps = Math.ceil(weightKg / 0.5);
  return baseRate + (weightSteps * 2);
}
```

**Bad:** Obvious restatement of what code does:

```javascript
function calculateShippingCost(w, i) {
  // Create base rate variable
  const b = i ? 15 : 5;
  // Loop through weight steps
  const s = Math.ceil(w / 0.5);
  // Add weight cost
  return b + (s * 2);
}
```

**Good:** Function structure explains intent; no comment needed:

```php
function processUserRegistration($email, $password) {
  $this->validateEmailFormat($email);
  $this->checkEmailUniqueness($email);
  $this->enforcePasswordStrength($password);

  return $this->createUser($email, $password);
}
```

**Bad:** Obvious comment stating each step:

```php
function processUserRegistration($email, $password) {
  // Validate the email format
  $this->validateEmailFormat($email);
  // Check if email already exists
  $this->checkEmailUniqueness($email);
  // Ensure password is strong
  $this->enforcePasswordStrength($password);
  // Create the new user
  return $this->createUser($email, $password);
}
```

## Validation

- ✅ All identifiers (variables, functions, classes) are descriptive and express intent
- ✅ Comments explain WHY decisions were made, not WHAT code does
- ✅ No multi-paragraph comment blocks; one-line comments only (except API docs)
- ✅ No comments referencing current task, issue, or feature
- ✅ Code structure itself documents flow; guard clauses, extracted methods reduce comment need
- ✅ Comments are kept current and removed if code is refactored to be self-explanatory

## References

- [Coding Standards](./coding-standards.instructions.md)
- [Task Implementation](./task-implementation.instructions.md)
- Clean Code: A Handbook of Agile Software Craftsmanship (Chapter 4: Comments)

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
