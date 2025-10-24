---
title: Comprehensive Code Review Prompt
model: copilot
use_case: development
status: ready
version: 1.0.0
author: LightSpeed WP Team
last_updated: 2024-10-17
---

## Goal

Generate thorough, constructive code reviews that identify bugs, security issues, performance problems, and maintainability concerns while providing actionable improvement suggestions.

## Inputs

Before using this template, provide the following information:

- **Programming Language**: Primary language of the code being reviewed
- **Code Context**: Brief description of what the code does (component, function, feature)
- **Code Complexity**: Simple, medium, or complex
- **Review Focus**: Security, performance, maintainability, or all areas
- **Team Experience Level**: Junior, mid-level, senior
- **Project Type**: Web app, mobile app, API, library, etc.
- **Framework/Stack**: React, Django, Express, etc. (if applicable)

## Instructions

1. Analyze the code structure and organization
2. Check for potential bugs and logic errors
3. Review security vulnerabilities and best practices
4. Assess performance implications
5. Evaluate code readability and maintainability
6. Identify missing error handling
7. Suggest improvements with specific examples
8. Highlight what was done well
9. Provide priority levels for each suggestion (critical, high, medium, low)
10. Include relevant documentation or learning resources

## Quality Checks

The generated code review should include:

- [ ] Specific line references where issues exist
- [ ] Clear explanation of each problem identified
- [ ] Concrete suggestions for improvement
- [ ] Examples of better implementations
- [ ] Positive feedback on good practices
- [ ] Priority levels for each suggestion
- [ ] Security considerations addressed
- [ ] Performance implications noted
- [ ] Maintainability concerns identified
- [ ] Links to relevant documentation or standards

## Safety & Limits

**Do not suggest:**
- Changes that could break existing functionality without clear warnings
- Overly complex refactoring for minor improvements
- Removing security measures without proper alternatives
- Framework or library changes without justification
- Personal coding style preferences as requirements

**Always consider:**
- Team coding standards and conventions
- Project constraints and requirements
- Learning opportunities for the developer
- Business impact of suggested changes
- Backward compatibility requirements

## Examples

### Example Input:
- **Programming Language**: JavaScript
- **Code Context**: User authentication function for web application
- **Code Complexity**: Medium
- **Review Focus**: Security and maintainability
- **Team Experience Level**: Mid-level
- **Project Type**: Web application
- **Framework/Stack**: Express.js with JWT

### Example Code to Review:
```javascript
function loginUser(req, res) {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const token = jwt.sign({ id: user.id }, 'secret123');
    res.json({ token: token, user: user });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}
```

### Example Output:

# Code Review: User Authentication Function

## Summary
This authentication function has several critical security vulnerabilities that need immediate attention. While the basic structure is sound, security best practices are not being followed.

## Critical Issues 🚨

### 1. Plain Text Password Comparison (Line 4)
**Issue**: Passwords are being stored and compared in plain text, which is a severe security vulnerability.

**Risk**: If the database is compromised, all user passwords are immediately exposed.

**Solution**: Use bcrypt to hash passwords:
```javascript
const bcrypt = require('bcrypt');

// When storing passwords
const hashedPassword = await bcrypt.hash(password, 12);

// When comparing
const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
```

### 2. Hardcoded JWT Secret (Line 7)
**Issue**: Using a hardcoded secret in the source code.

**Risk**: Secret is exposed in version control and cannot be rotated easily.

**Solution**: Use environment variables:
```javascript
const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
  expiresIn: '1h'
});
```

## High Priority Issues ⚠️

### 3. Missing Rate Limiting
**Issue**: No protection against brute force attacks.

**Solution**: Implement rate limiting middleware before this function.

### 4. Information Disclosure (Line 8)
**Issue**: Returning full user object may expose sensitive information.

**Solution**: Return only necessary user data:
```javascript
res.json({ 
  token: token, 
  user: { 
    id: user.id, 
    email: user.email, 
    name: user.name 
  } 
});
```

## Medium Priority Issues 📝

### 5. Missing Input Validation
**Issue**: No validation of email format or password requirements.

**Solution**: Add validation middleware or use a library like Joi.

### 6. No Token Expiration
**Issue**: JWT tokens don't expire, creating security risk.

**Solution**: Add expiration time as shown in issue #2.

## What's Done Well ✅

- Clear function structure and naming
- Proper HTTP status codes
- Consistent error response format
- Readable code organization

## Recommended Resources

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [bcrypt documentation](https://www.npmjs.com/package/bcrypt)
- [JWT best practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

## Next Steps

1. **Immediate**: Fix password hashing (Critical)
2. **This Sprint**: Implement environment variables for secrets (Critical)
3. **Next Sprint**: Add rate limiting and input validation (High)
4. **Future**: Consider using established authentication libraries like Passport.js