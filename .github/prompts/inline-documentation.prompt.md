---
description: "Prompt for adding comprehensive inline documentation to PHP and JavaScript code following WordPress standards."
license: "GPL-3.0"
---

# WordPress Inline Documentation Prompt

Use this prompt to add comprehensive inline documentation to WordPress PHP and JavaScript code following WordPress core standards.

## Instructions

Add proper inline documentation to the provided code following these guidelines:

### For PHP Code:
- Add file headers with package information, since version, and description (omit per-file @author)
- Document all functions with PHPDoc format including @since, @param, @return tags
- Document all class properties and methods
- Include hook documentation for WordPress actions and filters
- Use proper type hints and describe complex array parameters
- Follow WordPress PHP documentation standards

### For JavaScript Code:
- Add file headers with package information and description  
- Document all functions with JSDoc format including @since, @param, @return tags
- Document React components with props and return types
- Include WordPress block editor specific documentation
- Document async functions with @async tag and Promise return types
- Follow WordPress JavaScript documentation standards

### Documentation Requirements:
1. **@since tag** - Always include the project/plugin/theme version (or "Unreleased" during development)
2. **@param tags** - Document all parameters with type and description
3. **@return tags** - Document return values with type and description  
4. **Descriptions** - Write clear, concise explanations of functionality
5. **WordPress hooks** - Properly document actions and filters
6. **Security** - Note sanitization and escaping requirements where relevant

### Code Quality:
- Maintain existing code functionality
- Preserve code formatting and structure
- Add documentation without changing logic
- Ensure documentation is accurate and helpful
- Use WordPress coding standards terminology

## Example Request Format:

"Add WordPress inline documentation to this PHP/JavaScript code following WordPress core standards. Include proper file headers, function documentation, parameter descriptions, and return value documentation."

Then provide your code for documentation.

## References:
- [WordPress PHP Documentation Standards](https://github.com/WordPress/wpcs-docs/blob/master/inline-documentation-standards/php.md)
- [WordPress JavaScript Documentation Standards](https://github.com/WordPress/wpcs-docs/blob/master/inline-documentation-standards/javascript.md)
