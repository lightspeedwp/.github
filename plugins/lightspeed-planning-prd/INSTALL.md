# LightSpeed Planning PRD Plugin — Installation Guide

## Prerequisites

- **Claude users:** Claude.ai account or Claude Code
- **Copilot users:** GitHub account with Copilot access
- **OpenAI users:** OpenAI API key
- Basic familiarity with product planning concepts

## Installation Methods

### Method 1: Claude.ai / Claude Code

**Step 1:** Open Claude.ai or Claude Code  
**Step 2:** Access the Plugins section (gear icon → Plugins)  
**Step 3:** Search for "lightspeed-planning-prd"  
**Step 4:** Click "Install"  
**Step 5:** Accept permissions and confirm

**Verify Installation:**

```
/plugins list
# Should show: lightspeed-planning-prd (v2.0.0) ✓ Active
```

### Method 2: GitHub Copilot

**Step 1:** Open your IDE with Copilot enabled (VS Code, JetBrains, etc.)  
**Step 2:** Open Copilot Chat  
**Step 3:** Run command:

```
@lightspeed-planning-prd
```

**Or add to `.vscode/settings.json` (VS Code):**

```json
{
  "github.copilot.plugins": {
    "lightspeed-planning-prd": {
      "version": "2.0.0",
      "enabled": true
    }
  }
}
```

**Verify Installation:**

- Try slash commands: `/prd create`, `/features plan`, `/roadmap create`

### Method 3: OpenAI API

**Step 1:** Get your OpenAI API key from <https://platform.openai.com/api-keys

**Step 2:** Create or update an assistant:

```bash
curl https://api.openai.com/v1/assistants \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "model": "gpt-4-turbo",
    "name": "PRD Agent",
    "description": "Expert product planning agent",
    "tools": [
      {"type": "code_interpreter"},
      {
        "type": "function",
        "function": {
          "name": "create_prd",
          "description": "Generate complete PRD document",
          "parameters": {...}
        }
      }
    ]
  }'
```

**Step 3:** Store your Assistant ID for future use

```bash
export ASSISTANT_ID=asst_...
```

**Verify Installation:**

```bash
curl https://api.openai.com/v1/assistants/$ASSISTANT_ID \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
```

## Post-Installation Setup

### 1. Configure Your Preferences

**For Claude:**
Edit your system prompt to include specific requirements:

```markdown
# Additional Instructions for PRD Agent
- Always include timeline contingency of 25%
- Format PRDs in Markdown with clear hierarchy
- Validate completeness before final output
```

**For Copilot:**
Create `.copilot/config.json`:

```json
{
  "agents": {
    "prd": {
      "enabled": true,
      "github_integration": true,
      "auto_create_issues": false,
      "sync_to_projects": true
    }
  }
}
```

**For OpenAI:**
Set environment variables:

```bash
export OPENAI_API_KEY="sk-..."
export OPENAI_ORG_ID="org-..."  # if applicable
```

### 2. Create Your Workspace

**Claude:**

- Create a new chat for each project/PRD
- Save important PRDs to your library

**Copilot:**

- Create a GitHub issue to track PRD reviews
- Use GitHub Projects for planning tracking

**OpenAI:**

- Store API responses in your workflow system
- Integrate with CI/CD pipelines

### 3. Test the Installation

**Claude:**

```
Create a sample PRD for a note-taking app with:
- Target users: busy professionals
- Key requirement: offline support
- Timeline: 3 months
```

**Copilot:**

```
/prd template
# Select "MVP Note-Taking App"
```

**OpenAI:**

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-4-turbo",
    "assistant_id": "'$ASSISTANT_ID'",
    "messages": [
      {
        "role": "user",
        "content": "Create a PRD for a note-taking app"
      }
    ]
  }'
```

## Uninstallation

### Claude

```
/plugins disable lightspeed-planning-prd
/plugins uninstall lightspeed-planning-prd
```

### Copilot

Remove from `.copilot/config.json` or disable in settings.

### OpenAI

Delete the assistant:

```bash
curl -X DELETE https://api.openai.com/v1/assistants/$ASSISTANT_ID \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## Troubleshooting

### Plugin not appearing in list

- **Claude:** Clear cache and reload (Cmd/Ctrl + Shift + R)
- **Copilot:** Restart IDE completely
- **OpenAI:** Verify API key and permissions

### Errors during PRD creation

- Check that all required fields are provided
- Review error message for specific missing information
- Try a simpler request first to verify basic functionality

### GitHub integration issues (Copilot)

- Verify GitHub authentication: `gh auth status`
- Check repository permissions: `gh repo view`
- Ensure Copilot has org access: GitHub Settings → Applications

### Rate limits (OpenAI)

- Check usage: <https://platform.openai.com/account/usage/overview
- Implement exponential backoff for retries
- Request higher limits from OpenAI if needed

### Performance issues

- Claude: Shorter context often helps; break work into smaller pieces
- Copilot: Ensure good network connection to GitHub
- OpenAI: Check API response times on status page

## Security & Permissions

### Data Protection

- PRDs contain potentially sensitive product information
- Only share with authorized team members
- Use GitHub organization-level permissions (Copilot)
- Implement API authentication and rate limiting (OpenAI)

### Best Practices

✅ Don't include credentials in PRDs  
✅ Anonymize customer data in examples  
✅ Version control all PRD artifacts  
✅ Use GitHub branch protection for production PRDs  
✅ Audit changes regularly  

## Getting Help

### Documentation

- **Full Guide:** `.github/agents/prd-agent/AGENT.md`
- **Cookbook:** `cookbook/project-planning-and-prd-playbook.md`
- **Provider Configs:** `agents/prd-agent/{claude,copilot,openai}/agent.md`

### Support Channels

- **Issues:** <https://github.com/lightspeedwp/.github/issues
- **Discussions:** <https://github.com/lightspeedwp/.github/discussions
- **Email:** <contact@lightspeedwp.agency>

### Common Questions

**Q: Can I use all three providers for the same PRD?**  
A: Yes! Start with Claude for initial draft, refine in Copilot with GitHub integration, then automate with OpenAI.

**Q: What if I need custom planning templates?**  
A: Edit `agents/prd-agent/shared/core-prompt.md` and rebuild the plugin.

**Q: Can I export PRDs in other formats?**  
A: Currently Markdown and JSON. Other formats available through GitHub Actions.

**Q: How do I update to new versions?**  
A: Claude and Copilot update automatically. For OpenAI, recreate the assistant with new function definitions.

---

## Next Steps

1. ✅ Install the plugin
2. ✅ Run the test request
3. ✅ Review the sample output
4. ✅ Create your first real PRD
5. ✅ Share with your team
6. ✅ Iterate based on feedback

**Happy Planning! 🎯**
