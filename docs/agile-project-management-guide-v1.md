# **Agile PM Guide**

## *A practical, plain‑English starter for how we plan, build and ship software at LightSpeed.*

***Version:*** 1.0 • ***Last updated:*** 9 Oct 2025  
---

## **1\) Why Agile (and DevOps) exists**

Agile is an iterative way to deliver value fast, reduce risk, and adapt to change. DevOps complements Agile by automating delivery and improving collaboration between dev and ops. The goal: ship small, learn fast, and keep software healthy.

**What this means for you**

* Work in small chunks, get feedback often.

* Visualise work so the team can spot bottlenecks.

* Automate where sensible (tests, builds, deploys).

* Measure outcomes, not just output.

---

## **2\) The Agile mindset in 10 lines**

* Individuals & interactions over processes & tools

* Working software over comprehensive documentation

* Customer collaboration over contract negotiation

* Responding to change over following a plan

* Deliver early, improve continuously

* Keep feedback loops short

* Make work visible

* Limit work‑in‑progress (WIP)

* Focus on user value

* Reflect regularly and adjust

Tip: When unsure, ask “What delivers the most value to the user next?”

---

## **3\) Scrum at a glance**

**Best when** you can plan in time‑boxed iterations (sprints) and want a regular delivery cadence.

### **Roles**

* **Product Owner** – owns the product goal and backlog priority.

* **Scrum Master** – coaches the team, removes impediments.

* **Developers** – design, build, test, and deliver increments.

### **Core events**

* **Sprint (1–2 weeks)** – fixed timebox to deliver a usable increment.

* **Sprint Planning** – set the **Sprint Goal** and select work.

* **Daily Stand‑up (≤15 mins)** – yesterday/today/blockers; swarming on blockers \> status recitals.

* **Sprint Review** – show working software, get stakeholder feedback.

* **Retrospective** – improve process; pick 1–2 concrete experiments for the next sprint.

### **Artefacts**

* **Product Backlog** – ordered list of value.

* **Sprint Backlog** – the plan for the sprint.

* **Increment** – the working product at sprint end.

### **Guard‑rails**

* **Definition of Ready (DoR)** – story is clear, testable, small enough.

* **Definition of Done (DoD)** – code, tests, docs, security checks, deployed if applicable.

**Scrum quick checklist**

* Keep sprints the same length (predictability).

* Tie work to a clear Sprint Goal; say “no” to or re‑scope extras.

* Break stories so each can be completed inside one sprint.

* Demo real software in Reviews; avoid slideware.

* End every Retrospective with owners and due dates.

---

## **4\) Kanban at a glance**

**Best when** work arrives continuously (support, ops, mixed work) or priorities change often.

### **Principles**

1. Start with what you do now.

2. Pursue incremental, evolutionary change.

3. Respect current roles and processes.

4. Encourage leadership at every level.

### **Core practices**

* **Visualise the workflow** on a board with clear columns.

* **Limit WIP** – set explicit caps per column to prevent multitasking and queues.

* **Manage flow** – watch **cycle time**, **throughput**, **work age**.

* **Make policies explicit** – entry/exit criteria per column.

* **Improve continuously** – small experiments often.

**Kanban quick checklist**

* Keep columns unambiguous (e.g., *Ready → In Progress → In Review → In QA → Done*).

* Set WIP limits that feel slightly uncomfortable; adjust with data.

* Focus on finishing over starting. Measure cycle time weekly.

* Use **blocked** tags and swarm to unblock.

---

## **5\) Scrumban (hybrid)**

Blend Scrum’s cadence (planning, stand‑ups, retros) with Kanban’s flow and WIP limits. Great for teams doing both planned feature work and unplanned requests.

### **How we’ll run it in lsx-demo-theme (GitHub‑first)**

* **Planning cadence**: keep a light sprint rhythm (2‑week milestones), but **pull** work continuously with Kanban WIP limits.

* **GitHub mapping**:

  * **Projects** → your Kanban/Scrumban board (columns: *Backlog → Ready → In Progress → In Review → In QA → Done*).

  * **Parent issues** → **Epics** (product theme areas; e.g., *Logging*, *Docs*, *Theme Templates*).

  * **Child issues** → **User stories/tasks** that fit in ≤ 2–3 days, each with acceptance criteria.

  * **Pull requests** → reference the issue ("Fixes \#123"). Small PRs; draft early; CI must pass.

  * **Milestones** → timeboxes: *1.0 Beta 1*, *1.0 RC1*, *1.0 Final*. Treat each milestone as a sprint.

  * **Releases** → tagged output of a milestone (changelog \+ notes).

* **Asana**: track **non‑code** work (studies, research, meetings) on a Kanban board; link Asana tasks from issue descriptions when relevant.

* **Policies**: explicit WIP limits; Definition of Ready/Done stated on the Project README; blocked items get a **Blocked** label and are swarmed.

* **Flow metrics**: watch cycle time & throughput weekly; use them to tune WIP limits and scope.

---

## **6\) Lean Thinking & Continuous Improvement**

* **Define value** (from the customer’s view).

* **Map the value stream** (steps from idea to value).

* **Create flow** (remove bottlenecks and handoff pain).

* **Pull, don’t push** (start new work only when there’s capacity).

* **Pursue perfection** (small, constant improvements).

Seven wastes to watch for: waiting, handoffs/transport, over‑processing, excess inventory/WIP, motion/context switching, defects/rework, overproduction.

**Retro recipe**

* Data: What happened (metrics, facts)?

* Insights: Why did it happen?

* Actions: What one or two changes will we try next sprint/week?

---

## **7\) Agile project management workflow (mapped to Agile)**

**Phases:** Initiation → Planning → Execution → Monitoring & Control.  
 In Agile, you cycle through these each sprint/iteration.

### **Planning the work**

* **Epics → Stories → Tasks**

  * **Initiatives** group epics toward a bigger goal.

  * **Epics** are large value chunks broken into **user stories**.

  * **Stories** are user‑centred slices of value.

**Write great stories**

* Template: *As a \[user\], I want \[capability\] so that \[benefit\].*

* Add **acceptance criteria** (Given‑When‑Then is ideal).

* Keep stories independent, valuable, small, testable.

**Estimating**

* Prefer **relative** estimates (story points or T‑shirt sizes).

* Use **Planning Poker** to share understanding and expose risk.

* Track **throughput** and **cycle time**; treat velocity as a planning signal, not a target.

---

## **8\) Objectives, goals, milestones — know the difference**

* **Goals** – direction (e.g., improve feedback loops).

* **Objectives** – measurable outcomes (e.g., “Add 5 in‑app feedback channels in 60 days”).

* **Milestones** – checkpoints on the path (e.g., “Feedback page launched by 8 June”).

Use **SMART** objectives and attach KPIs (quality, time, budget, customer impact).

---

## **9\) DevOps essentials (for Agile teams)**

* **Culture & collaboration** – shared ownership; blameless post‑mortems; security built‑in.

* **CI/CD** – automate build, test, and deployment pipelines.

* **Infrastructure as Code** – versioned environments; peer‑reviewed changes.

* **Trunk‑based or short‑lived branches** – small PRs, fast merges.

* **Observability** – logs, metrics, traces; alert on symptoms users feel.

* **GitOps** – desired state lives in Git; changes happen via PR; controllers reconcile actual to desired.

**DevOps quick checklist**

* Protect main; require reviews and checks to pass.

* Keep PRs under \~300 lines where possible; aim for \<24h cycle.

* Every merge should be deployable; feature‑flag risky changes.

* Tag releases; write crisp changelogs.

---

## **10\) Board hygiene & weekly rhythm (baseline)**

* **Backlog**: groom weekly; stories meet DoR.

* **WIP**: respect limits; finish before starting new.

* **Stand‑ups**: 15 mins max; focus on flow and blockers. *Cohort note:* interns meet **daily at 09:00 (Asia/Bangkok)** on the shared Meet link.

* **Reviews/Demos**: show working software to stakeholders.

* **Retros**: pick 1–2 improvements; assign owners.

* **Metrics**: watch cycle time, throughput, failure rate, and lead time for changes.

**Intern cohort setup (from kickoff notes)**

* Connect personal GitHub repos to the **Slack GitHub app** for review notifications.

* Create **public WordPress.org profiles** and favourite key plugins.

* Use the **Asana Interns** project with tags (Studies, LSX Demo Theme, Research).

* Create GitHub **Epics** and **child issues** before each milestone; keep PRs small; grant admin access per guidance.

* Plan **unit tests & builds** for Sprints 4–5; begin **GitOps** training.

---

## **11\) Tool‑agnostic workflow**

Works in Jira, Trello, Asana, GitHub Projects, etc. Suggested columns:  
 **Backlog → Ready → In Progress → In Review → In QA → Done**  
 Add **Blocked** and **Waiting on Stakeholder** tags to surface delays. Use components/labels for service areas.

---

## **12\) Glossary (fast terms)**

* **Agile** – iterative, value‑first way of working.

* **Scrum** – Agile framework with sprints and fixed ceremonies.

* **Kanban** – visual flow with WIP limits and continuous delivery.

* **Epic / Story / Initiative** – hierarchy from big to small, grouped by goal.

* **Sprint** – fixed timebox (usually 1–2 weeks) to deliver an increment.

* **DoR / DoD** – entry/exit standards for quality and readiness.

* **Cycle time** – start → finish time for a work item.

* **Throughput** – items finished per time period.

* **CI/CD** – automated integration and delivery.

* **GitOps** – ops driven by Git versioned desired state.

---

## **13\) One‑week onboarding practice**

**Day 1**: Read this guide; shadow stand‑up; pull the repo; run tests locally.

**Day 2**: Pair on a small story; help break it into tasks; add acceptance criteria.

**Day 3**: Pick one task; open a draft PR early; ask for feedback.

**Day 4**: Write an automated test; get the task to Done; update the board.

**Day 5**: Demo your work; propose one retro improvement for next week.

---

## **14\) References & further reading**

* **Agile overview & manifesto, Scrum framework and events**:  
   [https://www.atlassian.com/agile](https://www.atlassian.com/agile)  
   [https://www.atlassian.com/agile/manifesto](https://www.atlassian.com/agile/manifesto)  
   [https://www.atlassian.com/agile/scrum](https://www.atlassian.com/agile/scrum)  
   [https://www.atlassian.com/agile/scrum/sprints](https://www.atlassian.com/agile/scrum/sprints)  
   [https://www.atlassian.com/agile/scrum/sprint-planning](https://www.atlassian.com/agile/scrum/sprint-planning)  
   [https://www.atlassian.com/agile/scrum/standups](https://www.atlassian.com/agile/scrum/standups)  
   [https://www.atlassian.com/agile/scrum/backlogs](https://www.atlassian.com/agile/scrum/backlogs)  
   [https://www.atlassian.com/agile/scrum/retrospectives](https://www.atlassian.com/agile/scrum/retrospectives)

* **Kanban basics & comparisons**:  
   [https://www.atlassian.com/agile/kanban](https://www.atlassian.com/agile/kanban)  
   [https://www.atlassian.com/agile/kanban/boards](https://www.atlassian.com/agile/kanban/boards)  
   [https://www.atlassian.com/agile/kanban/wip-limits](https://www.atlassian.com/agile/kanban/wip-limits)  
   [https://www.atlassian.com/agile/kanban/kanban-vs-scrum](https://www.atlassian.com/agile/kanban/kanban-vs-scrum)  
   [https://www.atlassian.com/agile/kanban/kanplan](https://www.atlassian.com/agile/kanban/kanplan)  
   [https://www.atlassian.com/agile/kanban/cards](https://www.atlassian.com/agile/kanban/cards)  
   [https://www.atlassian.com/agile/project-management/kanban-principles](https://www.atlassian.com/agile/project-management/kanban-principles)

* **Agile project management, workflows, epics/stories/initiatives, estimation, Scrumban, Lean, Continuous Improvement**:  
   [https://www.atlassian.com/agile/project-management](https://www.atlassian.com/agile/project-management)  
   [https://www.atlassian.com/agile/project-management/project-management-intro](https://www.atlassian.com/agile/project-management/project-management-intro)  
   [https://www.atlassian.com/agile/project-management/workflow](https://www.atlassian.com/agile/project-management/workflow)  
   [https://www.atlassian.com/agile/project-management/epics-stories-themes](https://www.atlassian.com/agile/project-management/epics-stories-themes)  
   [https://www.atlassian.com/agile/project-management/epics](https://www.atlassian.com/agile/project-management/epics)  
   [https://www.atlassian.com/agile/project-management/user-stories](https://www.atlassian.com/agile/project-management/user-stories)  
   [https://www.atlassian.com/agile/project-management/estimation](https://www.atlassian.com/agile/project-management/estimation)  
   [https://www.atlassian.com/agile/project-management/scrumban](https://www.atlassian.com/agile/project-management/scrumban)  
   [https://www.atlassian.com/agile/project-management/lean-methodology](https://www.atlassian.com/agile/project-management/lean-methodology)  
   [https://www.atlassian.com/agile/project-management/continuous-improvement](https://www.atlassian.com/agile/project-management/continuous-improvement)  
   [https://www.atlassian.com/agile/project-management/lean-principles](https://www.atlassian.com/agile/project-management/lean-principles)

* **Objectives vs goals vs milestones**:  
   [https://www.atlassian.com/work-management/project-management/project-objectives](https://www.atlassian.com/work-management/project-management/project-objectives)

* **DevOps & GitOps (for Sprints 4–5 groundwork)**:  
   [https://www.atlassian.com/devops](https://www.atlassian.com/devops)  
   [https://www.atlassian.com/devops/what-is-devops](https://www.atlassian.com/devops/what-is-devops)  
   [https://www.atlassian.com/devops/what-is-devops/devops-best-practices](https://www.atlassian.com/devops/what-is-devops/devops-best-practices)  
   [https://www.atlassian.com/devops/what-is-devops/devops-culture](https://www.atlassian.com/devops/what-is-devops/devops-culture)  
   [https://www.atlassian.com/devops/devops-tools/devops-pipeline](https://www.atlassian.com/devops/devops-tools/devops-pipeline)  
   [https://www.atlassian.com/devops/devops-tools/test-automation](https://www.atlassian.com/devops/devops-tools/test-automation)  
   [https://www.atlassian.com/devops/devops-tools/cicd-tools](https://www.atlassian.com/devops/devops-tools/cicd-tools)  
   [https://www.atlassian.com/continuous-delivery](https://www.atlassian.com/continuous-delivery)  
   [https://www.atlassian.com/continuous-delivery/principles](https://www.atlassian.com/continuous-delivery/principles)  
   [https://www.atlassian.com/continuous-delivery/continuous-integration](https://www.atlassian.com/continuous-delivery/continuous-integration)  
   [https://www.atlassian.com/continuous-delivery/software-testing](https://www.atlassian.com/continuous-delivery/software-testing)  
   [https://www.atlassian.com/git/tutorials/gitops](https://www.atlassian.com/git/tutorials/gitops)

---

*Version 1.1 – Updated with LightSpeed Scrumban mapping, cohort setup, and expanded references.* 1.0 – Designed for fast onboarding. Keep it handy; improve it as you learn.\*

