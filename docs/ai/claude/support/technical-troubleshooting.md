---
"title": "Technical Troubleshooting Guide Generator"
"model": "claude"
"use_case": "support"
"status": "ready"
"version": "1.0.0"
"author": "LightSpeed WP Team"
"last_updated": "2024-10-17"
"file_type": "documentation"
---

## Goal

Create comprehensive, step-by-step troubleshooting guides that help users systematically identify and resolve technical issues with minimal support escalation.

## Inputs

Provide the following information before using this template:

- **Product/System**: Name of the software, platform, or system being troubleshot
- **Issue Category**: Type of problem (connectivity, performance, functionality, installation, etc.)
- **User Skill Level**: Beginner, intermediate, or advanced
- **Common Symptoms**: List of 3-5 typical symptoms users report
- **Known Causes**: Potential root causes for this issue type
- **Available Tools**: Diagnostic tools or resources users have access to
- **Escalation Criteria**: When users should contact advanced support
- **Resolution Success Rate**: Expected percentage of users who can self-resolve

## Instructions

1. Create a clear, descriptive title for the troubleshooting guide
2. Begin with a brief problem statement and what users will accomplish
3. List prerequisites and required access/permissions
4. Structure troubleshooting steps in order of likelihood and complexity (easiest first)
5. For each step, provide:
   - Clear action to take
   - Expected result
   - Screenshots or visual aids description
   - Alternative approaches if the primary method fails
6. Include verification steps to confirm resolution
7. Provide escalation path for unresolved issues
8. Add prevention tips to avoid future occurrences

## Quality Checks

The generated troubleshooting guide should include:

- [ ] Clear, actionable steps with specific instructions
- [ ] Logical progression from simple to complex solutions
- [ ] Expected outcomes for each troubleshooting step
- [ ] Visual aid descriptions (where screenshots would be helpful)
- [ ] Verification method to confirm issue resolution
- [ ] Clear escalation criteria and contact information
- [ ] Estimated time requirements for each major section
- [ ] Prevention recommendations
- [ ] No technical jargon without explanation for target skill level

## Safety & Limits

**Do not create guides that:**

- Require users to modify system files without clear warnings
- Involve potentially destructive commands or actions
- Bypass security measures or authentication
- Require administrator access without explicit warnings
- Could void warranties or violate terms of service

**Always include:**

- Backup recommendations before making changes
- Warnings about data loss risks
- Clear statements about when to stop and seek help
- Appropriate skill level warnings for advanced procedures

## Examples

### Example Input

- **Product/System**: WordPress Website
- **Issue Category**: Performance/Loading Speed
- **User Skill Level**: Beginner
- **Common Symptoms**: Slow page loading, timeout errors, high bounce rate, poor user experience
- **Known Causes**: Large images, too many plugins, poor hosting, outdated themes
- **Available Tools**: WordPress admin, basic web browser tools
- **Escalation Criteria**: Technical changes beyond plugin settings
- **Resolution Success Rate**: 70%

### Example Output

# WordPress Website Loading Speed Troubleshooting Guide

## Problem Statement

Your WordPress website is loading slowly, causing poor user experience and potentially affecting search rankings. This guide will help you identify and resolve common speed issues that account for 70% of WordPress performance problems.

**Estimated Time**: 30-45 minutes  
**Skill Level**: Beginner  
**Prerequisites**: WordPress admin access

## Step 1: Test Your Current Speed (5 minutes)

**Action**: Use a speed testing tool to establish baseline metrics

1. Go to GTmetrix.com or Google PageSpeed Insights
2. Enter your website URL
3. Wait for the analysis to complete
4. Record your current loading time and performance scores

**Expected Result**: You'll see loading time (should be under 3 seconds) and performance scores
**Screenshot Needed**: Speed test results showing metrics

## Step 2: Deactivate Unnecessary Plugins (10 minutes)

**Action**: Temporarily disable plugins to identify performance culprits

1. Go to WordPress Admin > Plugins > Installed Plugins
2. Deactivate all plugins except essential ones (security, backup)
3. Test your site speed again using the same tool from Step 1
4. If speed improves significantly, reactivate plugins one by one to find the problematic one

**Expected Result**: 30-50% speed improvement if plugins were the issue
**Alternative**: If you can't deactivate plugins on a live site, use a staging environment

## Step 3: Optimize Images (15 minutes)

**Action**: Check and compress large images

1. Go to your Media Library in WordPress
2. Look for images larger than 500KB
3. Install and activate the Smush plugin (free version)
4. Run bulk optimization on existing images
5. Configure Smush to automatically optimize future uploads

**Expected Result**: 20-40% improvement in loading times
**Prevention Tip**: Always compress images before uploading

## Verification Steps

After completing troubleshooting steps:

1. Run the speed test again and compare to your baseline
2. Test your website on different devices and browsers
3. Check that all functionality still works properly

## When to Escalate

Contact technical support if:

- Loading time is still over 4 seconds after all steps
- You need to modify server settings or hosting configuration  
- You're uncomfortable making changes to themes or core files
- The issue started after a recent update or change you can't identify

## Prevention Tips

- Keep WordPress, themes, and plugins updated
- Use a reputable hosting provider with SSD storage
- Implement caching (WP Rocket or W3 Total Cache)
- Regularly audit and remove unused plugins
- Optimize images before uploading

**Support Contact**: If these steps don't resolve your issue, contact our technical team with your speed test results and a list of steps you've completed.
