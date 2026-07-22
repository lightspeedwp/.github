# PHASE 2 BATCH PROMPTS: Agents 5-14

Quick reference prompts for agents 5 through 14. Each follows the standard 8-phase process from PROMPT_2_GENERIC_AGENT_REWRITE.md.

---

## Agent 5: Design Partner Agent

**Location:** `.github/agents/design-partner-agent/`  
**Domain:** design  
**Focus:** partner-collaboration  
**Purpose:** Collaborate on design decisions, provide design guidance, and manage design workflows  
**Effort:** 2-4 hours

**Key Capabilities:**
- Design consultation & guidance
- Design system management
- UI/UX review & feedback
- Accessibility assessment (WCAG 2.2 AA)
- Design documentation
- Figma integration

**Tools/Skills:**
- design-review, accessibility-checker, design-system-validator
- figma-integration, component-library-management
- accessibility-assessment, wcag-compliance

**Plugin:** `lightspeed-design-partner`

---

## Agent 6: Proposal Desk Agent

**Location:** `.github/agents/proposal-desk-agent/`  
**Domain:** proposals  
**Focus:** proposal-generation  
**Purpose:** Create, manage, and track client proposals and project quotes  
**Effort:** 2-4 hours

**Key Capabilities:**
- Proposal template generation
- Quote creation & estimation
- Project scope definition
- Client communication
- Proposal tracking & status
- Invoice generation

**Tools/Skills:**
- proposal-create, proposal-template, quote-generator
- scope-estimator, timeline-planner, invoice-generator
- proposal-tracker, client-communication

**Plugin:** `lightspeed-proposals`

---

## Agent 7: Client Website Discovery Assistant

**Location:** `.github/agents/client-website-discovery-assistant-agent/`  
**Domain:** discovery  
**Focus:** website-assessment  
**Purpose:** Analyze client websites, identify needs, and recommend improvements  
**Effort:** 2-4 hours

**Key Capabilities:**
- Website audit & analysis
- Competitor analysis
- Feature gap analysis
- UX assessment
- Performance analysis
- Recommendation generation

**Tools/Skills:**
- website-analyzer, seo-auditor, performance-tester
- ux-assessor, competitor-analyzer, recommendation-engine
- report-generator, improvement-roadmap

**Plugin:** `lightspeed-discovery-services`

---

## Agent 8: Website Scope Estimator

**Location:** `.github/agents/website-scope-estimator-agent/`  
**Domain:** estimation  
**Focus:** project-scoping  
**Purpose:** Estimate website project scope, timeline, and resource requirements  
**Effort:** 2-4 hours

**Key Capabilities:**
- Feature scope analysis
- Effort estimation
- Timeline generation
- Resource planning
- Budget estimation
- Risk assessment
- Complexity calculation

**Tools/Skills:**
- scope-analyzer, effort-estimator, timeline-planner
- resource-calculator, budget-estimator, risk-assessor
- estimation-validator, recommendation-generator

**Plugin:** `lightspeed-estimation-services`

---

## Agent 9: Website Content Strategist

**Location:** `.github/agents/website-content-strategist-agent/`  
**Domain:** content  
**Focus:** content-strategy  
**Purpose:** Develop content strategies, audit content, and create content roadmaps  
**Effort:** 2-4 hours

**Key Capabilities:**
- Content strategy development
- Content audit & analysis
- Content gap analysis
- SEO content optimization
- Content calendar generation
- Content template creation
- User journey mapping

**Tools/Skills:**
- content-strategist, content-auditor, gap-analyzer
- seo-optimizer, keyword-researcher, content-planner
- user-journey-mapper, content-template-generator

**Plugin:** `lightspeed-content-strategy`

---

## Agent 10: PageSpeed Agent

**Location:** `.github/agents/pagespeed-agent/`  
**Domain:** performance  
**Focus:** performance-optimization  
**Purpose:** Analyze page performance, identify bottlenecks, and recommend optimizations  
**Effort:** 2-4 hours

**Key Capabilities:**
- Performance analysis (Core Web Vitals)
- Load time optimization
- Resource optimization
- Caching strategy
- CDN optimization
- Image optimization
- Code optimization

**Tools/Skills:**
- pagespeed-analyzer, performance-tester, bottleneck-detector
- optimization-recommender, caching-strategist, cdn-optimizer
- image-optimizer, code-minifier, bundle-analyzer

**Plugin:** `lightspeed-performance-optimization`

---

## Agent 11: Linear Advisor Agent

**Location:** `.github/agents/linear-advisor-agent/`  
**Domain:** project-management  
**Focus:** linear-integration  
**Purpose:** Manage Linear issues, projects, and workflows; provide issue resolution guidance  
**Effort:** 2-4 hours

**Key Capabilities:**
- Linear issue management
- Project planning & tracking
- Issue workflow automation
- Release planning
- Sprint management
- Team coordination
- Issue analysis & resolution guidance

**Tools/Skills:**
- linear-api-client, issue-manager, project-planner
- sprint-organizer, release-planner, workflow-automator
- issue-analyzer, resolution-recommender

**Plugin:** `lightspeed-project-management-linear`

---

## Agent 12: Harvest Analytical Agent

**Location:** `.github/agents/harvest-analytical-agent/`  
**Domain:** analytics  
**Focus:** time-tracking-analysis  
**Purpose:** Analyze time tracking data, generate reports, and provide insights on team productivity  
**Effort:** 2-4 hours

**Key Capabilities:**
- Time tracking data analysis
- Project profitability analysis
- Team productivity metrics
- Budget utilization tracking
- Report generation (daily, weekly, monthly)
- Billing & invoice generation
- Insights & recommendations

**Tools/Skills:**
- harvest-api-client, data-analyzer, report-generator
- productivity-metrics, profitability-calculator, billing-generator
- insights-engine, trend-analyzer, recommendation-engine

**Plugin:** `lightspeed-time-tracking-analytics`

---

## Agent 13: Zendesk Support Agent

**Location:** `.github/agents/zendesk-support-agent/`  
**Domain:** support  
**Focus:** customer-support  
**Purpose:** Manage support tickets, provide customer assistance, and improve support workflows  
**Effort:** 2-4 hours

**Key Capabilities:**
- Support ticket management
- Customer communication
- Issue resolution guidance
- Knowledge base creation
- Support metrics & reporting
- Workflow automation
- FAQ generation

**Tools/Skills:**
- zendesk-api-client, ticket-manager, issue-resolver
- knowledge-base-creator, faq-generator, communication-helper
- metrics-analyzer, workflow-automator, satisfaction-tracker

**Plugin:** `lightspeed-support-zendesk`

---

## Agent 14: AI Readiness Estimator

**Location:** `.github/agents/ai-readiness-estimator-agent/`  
**Domain:** assessment  
**Focus:** ai-readiness  
**Purpose:** Assess client readiness for AI/ML implementation and provide recommendations  
**Effort:** 2-4 hours

**Key Capabilities:**
- AI readiness assessment
- Data maturity analysis
- Infrastructure assessment
- Team capability analysis
- Implementation roadmap
- Risk & opportunity assessment
- ROI estimation

**Tools/Skills:**
- readiness-assessor, data-analyzer, infrastructure-evaluator
- capability-assessor, roadmap-planner, risk-analyzer
- roi-calculator, recommendation-engine, gap-identifier

**Plugin:** `lightspeed-assessment-ai-readiness`

---

## EXECUTION PATTERN

**For each agent (5-14):**

1. **Analyze** current export folder
2. **Create** new folder structure (claude/, copilot/, openai/, shared/)
3. **Write** AGENT.md specification
4. **Create** core prompt (provider-agnostic)
5. **Create** provider configs (Claude, Copilot, OpenAI)
6. **Define** tools/functions per provider
7. **Create** plugin with all configs
8. **Validate** & test before merge

---

## QUICK CHECKLIST (Per Agent)

- [ ] Analysis complete
- [ ] Folder structure created
- [ ] AGENT.md written & validated
- [ ] Core prompt created
- [ ] Provider configs created
- [ ] Tool definitions specified
- [ ] Plugin created
- [ ] Schema validation passing
- [ ] Hook validation passing
- [ ] Tests passing
- [ ] PR merged to develop

---

## TIMELINE (Per Agent)

Each agent: **2-4 hours**
- Agents 5-10: ~15-20 hours total
- Agents 11-14: ~8-12 hours total
- **Total Agents 5-14: ~23-32 hours**

---

## REFERENCE

**Use PROMPT_2_GENERIC_AGENT_REWRITE.md for:**
- Detailed 8-phase breakdown
- Task-by-task instructions
- Template examples
- Validation procedures

---

**All agents follow the same standardization process. Adapt parameter map and capabilities for each agent, then execute 8 phases.**
