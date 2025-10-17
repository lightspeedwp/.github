# Code Review Saved Replies

## Shell Script Standards

**Use case**: When shell scripts don't follow LightSpeed WP standards.

```markdown
Hi @username,

Thanks for this contribution! I've reviewed the shell script changes and noticed a few areas where we can improve adherence to our LightSpeed WP shell scripting standards:

**Required Improvements:**

1. **Error Handling:** Please add `set -euo pipefail` after the shebang line for robust error handling
2. **Variable Quoting:** Ensure all variable expansions are quoted (e.g., `"$variable"` instead of `$variable`)
3. **Function Documentation:** Please add documentation blocks for functions following our [documentation standards](.github/instructions/shell-script-header-and-docs.md)

**Specific Suggestions:**
- Line {X}: {Specific issue and suggested fix}
- Line {Y}: {Specific issue and suggested fix}

**Helpful Resources:**
- [Shell Script Copilot Instructions](.github/instructions/shell-script-copilot.md)
- [Script Header Standards](.github/instructions/shell-script-header-and-docs.md)

Once these changes are made, this will be ready to merge. Thanks for helping improve our automation tools!
```

## Missing Tests

**Use case**: When a PR lacks required test coverage.

```markdown
Hi @username,

Thank you for this contribution! The code changes look good, but we need to add test coverage before we can merge this PR.

**Required Tests:**
Based on our [testing standards](.github/instructions/bats-tests-and-runner-scripts.md), please add:

1. **Bats Tests:** Create `tests/test-{script-name}.bats` with coverage for:
   - Basic functionality (happy path)
   - Error handling (invalid inputs, missing dependencies)
   - Dry-run mode testing
   - Edge cases specific to your changes

2. **Test Categories Needed:**
   - ✅ Basic functionality
   - ⚠️  Error handling (missing)
   - ⚠️  Parameter validation (missing)
   - ⚠️  Integration testing (missing)

**Example Test Structure:**
```bash
@test "script-name: executes successfully with valid parameters" {
    run ./scripts/path/script-name.sh --dry-run --valid-option
    [ "$status" -eq 0 ]
    [[ "$output" =~ "expected success message" ]]
}

@test "script-name: fails gracefully with invalid input" {
    run ./scripts/path/script-name.sh --invalid-option
    [ "$status" -ne 0 ]
    [[ "$output" =~ "error message" ]]
}
```

**Running Tests:**
You can run your tests locally with:
```bash
bats tests/test-{script-name}.bats
```

Let me know if you need any help with the test implementation!
```

## Documentation Updates Needed

**Use case**: When code changes require documentation updates.

```markdown
Hi @username,

Great work on this functionality! The implementation looks solid. To complete this PR, we need to update the documentation to reflect these changes:

**Required Documentation Updates:**

1. **README Updates:**
   - Add usage examples for the new functionality
   - Update any changed command-line options or parameters
   - Include any new dependencies or requirements

2. **Inline Documentation:**
   - Script header needs to be updated with new usage information
   - New functions need documentation blocks
   - Complex logic sections need explanatory comments

3. **Related Documentation:**
   - Update [relevant documentation file] with new information
   - Add examples to demonstrate the new capabilities
   - Update troubleshooting guides if applicable

**Documentation Standards:**
Please follow our [documentation guidelines](.github/instructions/documentation-standards.md) for:
- Clear, concise language
- Practical examples
- Proper formatting and structure

**Specific Areas Needing Updates:**
- {File/section 1}: {What needs to be updated}
- {File/section 2}: {What needs to be updated}

Once the documentation is updated, this will be ready to merge. Thanks for the great contribution!
```

## Performance Concerns

**Use case**: When code changes may have performance implications.

```markdown
Hi @username,

Thank you for this contribution! I've reviewed the changes and have some concerns about potential performance implications:

**Performance Considerations:**

1. **{Specific Issue 1}:** 
   - Current implementation: {description}
   - Performance impact: {explanation}
   - Suggested improvement: {recommendation}

2. **{Specific Issue 2}:**
   - Concern: {description}
   - Potential optimization: {suggestion}

**Benchmarking Request:**
Could you please run some basic performance tests to compare before/after performance? For example:
```bash
# Test current performance
time ./script-name.sh --test-scenario

# Test with large dataset
time ./script-name.sh --large-input-test
```

**Optimization Suggestions:**
- Consider caching results for repeated operations
- Use more efficient algorithms for data processing
- Minimize external command calls in loops
- Implement batch processing where appropriate

**Resources:**
- [Performance best practices documentation]
- [Benchmarking tools and techniques]

If the performance impact is minimal for typical use cases, we can proceed. Otherwise, let's explore optimization options together.

Thanks for your understanding and cooperation!
```

## Security Review Required

**Use case**: When code changes involve security-sensitive operations.

```markdown
Hi @username,

Thank you for this contribution! This PR involves security-sensitive operations, so I need to request a thorough security review before we can proceed:

**Security Concerns Identified:**

1. **Input Validation:**
   - User inputs need proper validation and sanitization
   - File path inputs should be validated to prevent directory traversal
   - Command injection prevention required

2. **Privilege Handling:**
   - Script appears to run with elevated privileges
   - Need to verify principle of least privilege is followed
   - Consider dropping privileges when possible

3. **Sensitive Data:**
   - Ensure no secrets are logged or exposed
   - Verify secure handling of configuration data
   - Check for information leakage in error messages

**Required Security Improvements:**
```bash
# Example: Input validation
validate_input() {
    local input="$1"
    if [[ ! "$input" =~ ^[a-zA-Z0-9_-]+$ ]]; then
        echo "Error: Invalid input format" >&2
        return 1
    fi
}

# Example: Secure file handling
if [[ "$file_path" =~ \.\. ]]; then
    echo "Error: Invalid file path" >&2
    exit 1
fi
```

**Security Checklist:**
- [ ] All user inputs are validated
- [ ] No command injection vulnerabilities
- [ ] File operations are secure
- [ ] Secrets are properly handled
- [ ] Error messages don't leak sensitive information

**Next Steps:**
1. Please address the identified security concerns
2. Add security-focused tests to your test suite
3. Update documentation to include security considerations

Our security team will do a final review once these items are addressed. Thanks for helping us maintain secure code!
```

## Code Style and Formatting

**Use case**: When code doesn't follow formatting standards.

```markdown
Hi @username,

Thanks for this contribution! The functionality looks great, but we need to address some code style and formatting issues to maintain consistency across the codebase:

**Formatting Issues:**

1. **Indentation:** Please use consistent 2-space indentation throughout
2. **Line Length:** Some lines exceed our 100-character limit
3. **Spacing:** Add consistent spacing around operators and after commas
4. **Naming Conventions:** Use kebab-case for file names and snake_case for variables

**Specific Fixes Needed:**
- Line {X}: {Specific formatting issue}
- Line {Y}: {Another formatting issue}
- Function {name}: {Naming convention issue}

**Automated Fixes:**
You can automatically fix many of these issues by running:
```bash
# For shell scripts
shfmt -i 2 -w script-name.sh

# For JavaScript
npm run format

# For Python  
black script-name.py
```

**Linting:**
Please also run our linters to catch any remaining issues:
```bash
# Shell scripts
shellcheck script-name.sh

# JavaScript
npm run lint

# Python
flake8 script-name.py
```

**Standards Reference:**
- [Coding Standards](.github/instructions/coding-standards.md)
- [Style Guide Documentation]

Once these formatting issues are resolved, this will be ready for final review. Thanks for your attention to code quality!
```

## Architecture and Design Feedback

**Use case**: When suggesting improvements to code architecture or design.

```markdown
Hi @username,

Thank you for this substantial contribution! The functionality is impressive, and I can see you've put a lot of thought into this. I have some suggestions for improving the architecture and maintainability:

**Architectural Suggestions:**

1. **Separation of Concerns:**
   ```bash
   # Consider splitting this large function into smaller, focused functions:
   # Current: process_deployment() does everything
   # Suggested: 
   #   - validate_config()
   #   - backup_data()  
   #   - deploy_files()
   #   - verify_deployment()
   ```

2. **Error Handling Strategy:**
   - Implement consistent error handling across all functions
   - Consider using a centralized error logging function
   - Add proper cleanup in error scenarios

3. **Configuration Management:**
   - Extract hardcoded values to configuration variables
   - Make the script more configurable for different environments
   - Validate configuration early in the process

**Design Patterns to Consider:**
- **Template Method Pattern:** For deployment workflows with customizable steps
- **Strategy Pattern:** For different deployment types (staging vs production)
- **Command Pattern:** For undoable operations and rollback capability

**Refactoring Suggestions:**
```bash
# Instead of one large function:
deploy_application() {
    # 200+ lines of mixed logic
}

# Consider this structure:
deploy_application() {
    validate_prerequisites || return 1
    create_backup || return 2
    execute_deployment || return 3
    verify_success || return 4
}
```

**Benefits of These Changes:**
- Improved testability (smaller functions)
- Better error handling and debugging
- Enhanced maintainability and readability
- Easier to add new deployment strategies

Would you be interested in refactoring this into smaller, more focused functions? I'm happy to help with the design if needed.

Great work overall – these suggestions are about making good code even better!
```

## Approval and Praise

**Use case**: When approving a well-written PR.

```markdown
Hi @username,

Excellent work! 🎉 This is a high-quality contribution that demonstrates great attention to detail and adherence to our standards.

**What I Particularly Appreciate:**

✅ **Code Quality:**
- Clean, readable code with excellent documentation
- Proper error handling and edge case coverage
- Follows all LightSpeed WP coding standards

✅ **Testing:**
- Comprehensive test coverage including edge cases
- Well-structured tests that are easy to understand
- Good use of test helpers and utilities

✅ **Documentation:**
- Clear commit messages and PR description
- Updated documentation reflects all changes
- Excellent inline code comments

✅ **Security & Performance:**
- No security concerns identified
- Efficient implementation with good performance characteristics
- Proper input validation and error handling

**Impact:**
This contribution will {describe the positive impact on the project/users}.

**Next Steps:**
- ✅ All checks passed
- ✅ No conflicts with base branch
- 🚀 Ready to merge!

Thank you for taking the time to create such a well-crafted contribution. This is exactly the kind of work that makes our project better!

**Approved and ready to merge** ✨
```