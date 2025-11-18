---
"title": "ChatGPT & GitHub Models Overview"
"description": "Explanation of the different ChatGPT 5 models and guidance on when to use each, along with an overview of GitHub models for Copilot."
"last_updated": "2025-10-17"
"version": "v1.0"
"owners":
  - "LightSpeed Engineering"
"file_type": "documentation"
---

# Introduction

ChatGPT models differ in latency, cost, and capability. Selecting the appropriate model for a task ensures balanced performance and resource usage. This document summarises the key characteristics of **ChatGPT 5 Auto**, **Instant**, **Thinking**, **Pro** and **4o**, and describes when to choose each. It also introduces GitHub’s proprietary models for Copilot.

# ChatGPT 5 Models

## ChatGPT 5 Auto

- **Overview**: Auto mode dynamically selects the appropriate underlying model (Instant or Thinking) based on the task. It balances speed and quality without explicit user selection.
- **Best For**: General queries, small coding tasks, or when you’re unsure which model to choose.
- **Pros**: Convenience; automatic optimisation.
- **Cons**: Less control over performance; may not pick the optimal model for specialised tasks.

## ChatGPT 5 Instant

- **Overview**: Prioritises response speed over depth. Uses smaller, faster models to deliver quick answers.
- **Best For**: Short Q&A, clarifications, lightweight coding assistance, quick calculations, or brainstorming ideas.
- **Pros**: Low latency; lower cost.
- **Cons**: Reduced reasoning ability; may miss nuanced details or context.

## ChatGPT 5 Thinking

- **Overview**: Designed for complex reasoning and multi‑step problem solving. It uses a larger context window and more compute, resulting in slower responses but deeper analysis.
- **Best For**: Deep research, planning, debugging difficult code, architectural discussions, or tasks requiring chain‑of‑thought.
- **Pros**: High reasoning ability; better at long context tasks.
- **Cons**: Higher latency and cost.

## ChatGPT 5 Pro

- **Overview**: Enhanced version of Thinking with improved accuracy, safety checks and more advanced planning. Provides access to the latest training data and features.
- **Best For**: Mission‑critical tasks such as detailed technical research, sensitive document drafting, or generating production‑quality code.
- **Pros**: Highest quality output; better safety filtering.
- **Cons**: Most expensive; may still require manual review.

## ChatGPT 5 4o

- **Overview**: A multimodal model optimised for on‑device or offline scenarios (the “4o” stands for “for offline”). It offers reduced size and latency while supporting basic text and image understanding.
- **Best For**: Tasks requiring offline inference, embedded systems, or when connectivity is limited.
- **Pros**: Lightweight; can run locally on supported devices.
- **Cons**: Lower capacity and context compared to other models; limited to smaller prompts.

# Model Selection Guidance

| Scenario | Recommended Model |
|---|---|
| Quick answers or brainstorming | **Instant** |
| Complex reasoning or deep research | **Thinking** or **Pro** |
| Balanced general use | **Auto** |
| Production‑quality outputs with maximum safety | **Pro** |
| Offline or resource‑constrained environments | **4o** |

When in doubt, start with **Auto** and monitor latency and quality. If responses lack depth, switch to **Thinking**. For high‑stakes tasks, prefer **Pro**.

# GitHub Models for Copilot

GitHub Copilot uses fine‑tuned models trained on public and proprietary code. Key model families include:

- **GitHub Code Search Models** – Used for semantic code search and navigation. Enable Copilot to understand repository context and find relevant files or symbols.
- **GitHub Completion Models** – Generate code completions, docstrings, and test suggestions. Optimised for programming languages and frameworks.
- **GitHub Review Models** – Provide code review comments, suggest improvements, and enforce style guides. Available in Copilot Code Review and Copilot PR features.
- **GitHub Natural Language Models** – Assist with documentation, issue summarisation and non‑code tasks.

## Responsible Use

Both ChatGPT and GitHub models must be used responsibly. Respect licence terms, avoid exposing secrets, and adhere to LightSpeed’s safety guidelines. When generating code or documentation, review outputs for accuracy, security, and compliance.

---
