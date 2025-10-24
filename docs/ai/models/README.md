# LightSpeed AI Templates

This repository contains a collection of templates and explainers to help LightSpeed teams harness AI effectively. It includes:

- **Overall AI Explainer** – A high‑level guide to combining ChatGPT, GitHub Copilot and Figma Make (`overall-ai-explainer.md`).
- **ChatGPT Instructions & Prompts** – Generic and mode‑specific instruction templates (`chatgpt-instructions-template.md`) and prompt templates for deep research, agent mode, web search, image creation, canvas, study & learn, and using connectors. Each is paired with a concise prompt template.
- **Copilot Instructions & Spaces** – Templates and explainers for writing Copilot instructions (`copilot-instructions-template.md`, `copilot-instructions-explainer.md`) and setting up Copilot Spaces (`copilot-space-explainer.md`, `copilot-space-template.md`).
- **GitHub New Repo Prompt** – A template for creating new repositories with names, descriptions and Copilot prompts (`github-new-repo-prompt.md`).
- **Figma Make Guidelines & Prompt** – A comprehensive template for `guidelines.md` and a starter prompt for new website projects (`figma-make-guidelines-template.md`, `figma-make-website-prompt.md`).
- **Models Explainer** – An overview of ChatGPT 5 model variants and GitHub models with selection guidance (`models-explainer.md`).
- **Agent Templates** – A specification template and a JavaScript stub for building Copilot agents (`agent-template-spec.md`, `agent-template.js`).

## Using the Templates

1. **Select the relevant template** for your task. For example, use the deep research instructions when drafting a report or the canvas instructions when building a React dashboard.
2. **Copy the template into your project** and fill in placeholders (marked in brackets) with project‑specific details.
3. **Load the instructions** into your ChatGPT or Copilot session. For Copilot, place instruction files under `.github/instructions/` or reference them in your prompts.
4. **Write your prompt** using the paired prompt template. Provide clear objectives, constraints and any additional context.
5. **Review and iterate** on the generated outputs. Update your instructions or prompts as necessary.

## Contributions

These templates are starting points. Feel free to adapt them to your specific workflows. Contributions and refinements are welcome—please ensure changes adhere to LightSpeed’s style and safety guidelines.

# AI Model Guides & Resources

This directory contains guides, comparisons, and resources for understanding and choosing between different AI models and platforms.

## Directory Structure

```
models/
├── guides/             # Comprehensive guides for AI model usage
│   └── ai-model-comparison.md
├── comparisons/        # Detailed comparisons between models
└── README.md          # This file
```

## What's Included

### Model Guides (`/guides/`)

Comprehensive documentation covering:

- **AI Model Comparison**: Side-by-side comparison of ChatGPT, Claude, Gemini, and GitHub Copilot
- **Use Case Recommendations**: Which model to use for specific scenarios
- **Feature Matrices**: Detailed capability comparisons
- **Integration Guidelines**: How to implement different models
- **Cost Analysis**: Pricing considerations for different use cases

### Comparison Resources (`/comparisons/`)

Detailed analyses including:

- Performance benchmarks across different task types
- Quality assessments for various use cases
- Feature availability matrices
- API capabilities and limitations
- Enterprise features and support levels

## Choosing the Right AI Model

### Quick Selection Guide

**For Content Creation & Marketing**
→ Use **ChatGPT** templates in `/chatgpt/`

**For Technical Analysis & Support**
→ Use **Claude** templates in `/claude/`

**For Research & Data Analysis**
→ Use **Gemini** or **Claude** templates in respective directories

**For Software Development**
→ Use **GitHub Copilot** templates in `/copilot/` and `/copilot-spaces/`

**For Automation & Workflows**
→ Use **Figma + Make** templates in `/figma-make/`

### Factors to Consider

1. **Task Complexity**: Some models excel at complex reasoning
2. **Response Style**: Different models have different "personalities"
3. **Safety Requirements**: Some models are more conservative
4. **Integration Needs**: API availability and ecosystem support
5. **Cost Constraints**: Pricing varies significantly between models
6. **Context Length**: How much information you need to process
7. **Multimodal Needs**: Image, audio, and text capabilities

## Model-Specific Strengths

### ChatGPT (OpenAI)

- **Best for**: Creative writing, general conversation, coding assistance
- **Strengths**: Versatile, well-documented, large ecosystem
- **Templates**: `/chatgpt/` directory

### Claude (Anthropic)

- **Best for**: Analysis, research, technical writing, safety-critical applications
- **Strengths**: Long context, careful reasoning, ethical considerations
- **Templates**: `/claude/` directory

### Gemini (Google)

- **Best for**: Research, data analysis, Google ecosystem integration
- **Strengths**: Multimodal capabilities, search integration, competitive pricing
- **Templates**: `/gemini/` directory

### GitHub Copilot

- **Best for**: Code completion, development workflows, pair programming
- **Strengths**: IDE integration, code-specific training, development focus
- **Templates**: `/copilot/` and `/copilot-spaces/` directories

## Using These Resources

### For Decision Making

1. **Read the comparison guide** to understand trade-offs
2. **Identify your primary use case** from the categories
3. **Review model-specific strengths** for your scenario
4. **Test with sample templates** before committing
5. **Consider cost and integration requirements**

### For Implementation

1. **Start with the recommended model** for your use case
2. **Use the appropriate template directory** for that model
3. **Follow model-specific best practices** outlined in guides
4. **Monitor results and iterate** based on performance

### For Teams

1. **Establish model selection criteria** based on organizational needs
2. **Train team members** on different model capabilities
3. **Create workflows** that leverage multiple models when appropriate
4. **Document decisions** and lessons learned

## Contributing Model Resources

We welcome contributions to the model guides and comparisons:

### Types of Contributions

- **New model guides** for emerging AI platforms
- **Updated comparisons** with latest capabilities and pricing
- **Use case studies** showing real-world model performance
- **Best practice guides** for specific industries or scenarios
- **Integration tutorials** for enterprise implementations

### Contribution Process

1. **Research thoroughly** and test with multiple models
2. **Follow the guide template** structure for consistency
3. **Include concrete examples** and evidence
4. **Update comparison matrices** with new data
5. **Submit pull request** with clear documentation

## Staying Current

AI models evolve rapidly. This section helps you stay informed:

### Update Schedule

- **Monthly**: Review for major model updates and new releases
- **Quarterly**: Update pricing information and feature matrices  
- **Biannually**: Comprehensive review of recommendations and guides

### Information Sources

- Official model documentation and release notes
- Community benchmarks and evaluations
- Enterprise user feedback and case studies
- Academic research on model capabilities

### Version Tracking

Each guide includes:

- **Last Updated**: Date of most recent revision
- **Model Versions**: Specific model versions evaluated
- **Changes**: Summary of updates from previous version

---

*These guides are based on publicly available information and community feedback. Always test models with your specific requirements and use cases before making production decisions.*
