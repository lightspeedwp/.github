# Bug Report Saved Replies

## Need More Information

**Use case**: When a bug report lacks sufficient detail for reproduction or analysis.

```markdown
Hi @username,

Thank you for taking the time to report this issue! To help us investigate and resolve this problem effectively, we need some additional information:

**Environment Details:**
- Operating system and version
- Shell version (`bash --version`)
- Script version or commit hash you're using
- Any relevant configuration files (with sensitive data removed)

**Reproduction Steps:**
- Exact command or script you executed
- Any command-line arguments or options used
- Expected behavior vs. actual behavior
- Complete error output or logs

**Additional Context:**
- Does this issue occur consistently or intermittently?
- Have you made any recent changes to your environment or configuration?
- Are there any workarounds you've discovered?

Once we have this information, we'll be able to investigate the issue more thoroughly and provide a solution.

Thanks for your patience!
```

## Confirmed Bug - Investigation Started

**Use case**: Acknowledging a valid bug report and confirming investigation has begun.

```markdown
Hi @username,

Thank you for the detailed bug report! I've confirmed this is a valid issue and have begun investigating.

**Status Update:**
- ✅ Issue reproduced in our testing environment
- 🔍 Root cause analysis in progress
- 📋 Added to our priority bug tracking board

**Initial Findings:**
[Include any preliminary findings or suspected causes]

**Next Steps:**
- We'll investigate the underlying cause and develop a fix
- I'll keep you updated on our progress in this issue
- Expected timeline for resolution: [timeframe]

**Workaround:**
[Include any temporary workarounds if available]

If you have any additional information that might help with the investigation, please feel free to share it here.

Thanks again for helping us improve the codebase!
```

## Request for Testing

**Use case**: Asking the reporter to test a proposed fix or workaround.

```markdown
Hi @username,

We've developed a potential fix for this issue and would appreciate your help testing it!

**Testing Instructions:**
1. [Step-by-step testing instructions]
2. Please test with your original use case that triggered the bug
3. Also test these edge cases: [list relevant edge cases]

**What to Look For:**
- The original error should no longer occur
- Normal functionality should work as expected
- Performance should not be negatively impacted

**Reporting Results:**
Please comment here with:
- ✅/❌ Whether the fix resolves your original issue
- Any new issues or unexpected behavior you observe
- Performance observations (if relevant)
- Your testing environment details

**Branch/Version to Test:**
- Branch: `fix/issue-{issue-number}`
- Commit: `{commit-hash}`
- Or download the test version: [link if applicable]

Thank you for helping us validate this fix before we merge it!
```

## Bug Fixed - Resolution

**Use case**: Confirming that a bug has been resolved and providing next steps.

```markdown
Hi @username,

Great news! This issue has been resolved and the fix is now available.

**Resolution Details:**
- **Root Cause:** [Brief explanation of what caused the issue]
- **Fix Applied:** [Summary of the solution implemented]  
- **Testing:** Comprehensive testing completed, including your reported scenario

**Availability:**
- ✅ Fix merged to `main` branch
- 🏷️ Will be included in next release (v{version})
- 📦 Available now for development/testing

**Verification:**
You can verify the fix by:
1. [Instructions for getting the latest version]
2. [How to test that the issue is resolved]
3. [Any new features or changes to be aware of]

**Release Timeline:**
- Next scheduled release: [date]
- Critical/hotfix release if needed: [conditions]

Thank you for reporting this issue and helping us improve the project! If you encounter any other problems, please don't hesitate to open another issue.

Closing this issue as resolved. Feel free to reopen if the problem persists.
```

## Cannot Reproduce

**Use case**: When the development team cannot reproduce the reported issue.

```markdown
Hi @username,

Thank you for reporting this issue. We've attempted to reproduce the problem following your description, but haven't been able to replicate it in our testing environment.

**Our Testing Environment:**
- OS: [operating system details]
- Shell: [shell version]  
- Script Version: [version tested]
- Configuration: [relevant config details]

**What We Tried:**
1. [List the reproduction steps attempted]
2. [Any variations or edge cases tested]
3. [Different environments or configurations tested]

**Next Steps:**
To help us investigate further, could you please:

1. **Verify the issue still occurs** with the latest version
2. **Provide more specific reproduction steps** if possible
3. **Share your exact environment details:**
   - Output of `uname -a`
   - Output of `bash --version`
   - Any custom configuration or environment variables
4. **Include complete logs** with verbose mode enabled (`--verbose` flag)

If we're unable to reproduce this issue with additional information, we may need to close it as unable to reproduce. However, we're committed to helping you resolve this problem, so please provide any additional details you think might be relevant.

Thanks for your patience as we work through this!
```

## Duplicate Issue

**Use case**: When the reported issue is a duplicate of an existing issue.

```markdown
Hi @username,

Thanks for reporting this issue! This appears to be a duplicate of issue #{existing-issue-number}.

**Related Issue:** #{existing-issue-number} - [Brief title/description]

**Current Status:**
- [Current status of the existing issue]
- [Any progress or updates on resolution]
- [Expected timeline if available]

**Recommendation:**
- Please follow issue #{existing-issue-number} for updates on this problem
- Feel free to add any additional details or use cases to that issue if they're different from what's already reported
- Subscribe to notifications on that issue to stay informed

**Why We Consolidate:**
We consolidate duplicate issues to:
- Avoid fragmenting discussion and updates
- Ensure all relevant information is in one place
- Help us prioritize and track progress more effectively

I'll close this issue as a duplicate, but your report is still valuable and helps confirm the importance of resolving the original issue.

Thanks for taking the time to report this!
```

## Wontfix / By Design

**Use case**: When a reported "bug" is actually intended behavior or won't be changed.

```markdown
Hi @username,

Thank you for raising this issue. After careful consideration, we've determined that this behavior is actually by design and aligns with our project goals and standards.

**Reasoning:**
[Explain why this behavior is intentional, such as:]
- Security considerations that require this approach
- Compatibility requirements with existing systems
- Performance optimizations that necessitate this behavior
- Architectural decisions that support this implementation

**Alternative Solutions:**
If this behavior doesn't meet your needs, here are some alternatives:
1. [Alternative approach 1 with explanation]
2. [Alternative approach 2 with explanation]  
3. [Configuration options that might help]

**Documentation:**
This behavior is documented in:
- [Link to relevant documentation]
- [Link to design decisions or architectural docs]

**Future Considerations:**
- While we won't change this behavior in the current version, we'll consider your feedback for future major releases
- If this becomes a common request, we may revisit the design decision

We appreciate your feedback as it helps us understand how users interact with our tools. If you have suggestions for improving the documentation to make this behavior clearer, we'd welcome those contributions!

I'll close this issue as "won't fix" but the feedback is valuable for our future planning.
```

## Security Vulnerability Report

**Use case**: When a bug report describes a potential security vulnerability.

```markdown
Hi @username,

Thank you for reporting this potential security issue. We take security very seriously and appreciate responsible disclosure.

**Important - Please Read:**

For security vulnerabilities, we have a dedicated process to ensure proper handling:

1. **Do NOT discuss security details in public issues**
2. **Please report security issues privately** to our security team: security@lightspeedwp.com
3. **Include all relevant details** in your private report:
   - Detailed description of the vulnerability
   - Steps to reproduce (proof of concept)
   - Potential impact assessment
   - Your contact information for follow-up

**Our Security Process:**
- Security reports are triaged within 24-48 hours
- We'll acknowledge receipt and provide a timeline for investigation
- We coordinate with reporters on disclosure timeline
- Security fixes are prioritized and released as soon as safely possible

**Public Issue Handling:**
I'll convert this public issue to focus on any non-security aspects, or close it if it's purely a security concern. We'll ensure proper credit is given when the security issue is resolved and publicly disclosed.

**Questions?**
If you have questions about our security process, please email security@lightspeedwp.com

Thank you for helping keep our project secure!
```