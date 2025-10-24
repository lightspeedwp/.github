---
title: Agile Sprint Planning Session
model: copilot-spaces
use_case: general
status: ready
version: 1.0.0
author: LightSpeed WP Team
last_updated: 2024-10-17
---

## Goal

Facilitate effective sprint planning sessions that result in well-defined, achievable sprint goals with properly estimated user stories and clear team commitment.

## Inputs

Before starting the sprint planning session, gather:

- **Sprint Duration**: 1-4 weeks (typically 2 weeks)
- **Team Capacity**: Available team members and their capacity percentage
- **Product Backlog**: Prioritized and refined user stories
- **Team Velocity**: Historical velocity data from previous sprints
- **Sprint Goal**: High-level objective for the upcoming sprint
- **Definition of Done**: Agreed-upon criteria for story completion
- **Dependencies**: External dependencies or blocking issues
- **Previous Sprint**: Review of completed work and lessons learned
- **Stakeholders Present**: Product owner, scrum master, development team

## Instructions

1. **Review Previous Sprint (15 minutes)**
   - Celebrate completed work and achievements
   - Discuss any incomplete stories and reasons
   - Review velocity and capacity utilization
   - Identify process improvements for upcoming sprint

2. **Establish Sprint Goal (10 minutes)**
   - Product owner presents proposed sprint goal
   - Team discusses and refines the goal
   - Ensure goal is specific, measurable, and valuable
   - Get team agreement and commitment to the goal

3. **Capacity Planning (15 minutes)**
   - Calculate available team capacity in story points/hours
   - Account for holidays, planned time off, and other commitments
   - Factor in historical velocity and team efficiency
   - Set realistic capacity target for sprint

4. **Story Selection and Estimation (60-90 minutes)**
   - Start with highest priority items from product backlog
   - Review each story for clarity and acceptance criteria
   - Estimate effort using planning poker or similar technique
   - Ensure stories align with sprint goal
   - Continue until capacity is reasonably filled

5. **Task Breakdown (30 minutes)**
   - Break down selected stories into specific tasks
   - Identify dependencies between stories and tasks
   - Assign initial ownership or volunteer for stories
   - Create technical implementation approach for complex items

6. **Sprint Commitment (15 minutes)**
   - Review total selected work against capacity
   - Make final adjustments to story selection
   - Get explicit commitment from each team member
   - Document sprint backlog and sprint goal

## Quality Checks

Ensure your sprint planning results in:

- [ ] Clear, measurable sprint goal that adds business value
- [ ] Realistic story selection based on team capacity and velocity
- [ ] All selected stories have clear acceptance criteria
- [ ] Story estimates reflect team consensus and confidence
- [ ] Dependencies are identified and mitigation plans exist
- [ ] Each story can be completed within the sprint timeframe
- [ ] Team has explicit commitment to sprint scope
- [ ] Sprint backlog is documented and accessible to all
- [ ] Next steps and first tasks are clearly identified

## Safety & Limits

**Avoid these common pitfalls:**

- Overcommitting beyond historical team velocity
- Selecting stories without clear acceptance criteria
- Ignoring dependencies or external blocking factors
- Planning without considering team member availability
- Making commitments without full team consensus

**Always ensure:**

- Psychological safety for team members to voice concerns
- Realistic expectations based on historical performance
- Buffer time for unexpected issues and learning
- Clear understanding of story priorities and trade-offs
- Respect for team capacity and sustainable pace

## Examples

### Example Input

- **Sprint Duration**: 2 weeks
- **Team Capacity**: 5 developers, 80% capacity (vacation/meetings)
- **Product Backlog**: 25 refined stories, top 10 ready for development
- **Team Velocity**: Average 45 story points per sprint (last 3 sprints)
- **Sprint Goal**: "Implement user authentication and basic profile management"
- **Definition of Done**: Code reviewed, tested, deployed to staging
- **Dependencies**: External API integration pending vendor response
- **Previous Sprint**: Completed 42 story points, 3 stories carried over

### Example Output

# Sprint 15 Planning Results

## Sprint Goal

**"Implement user authentication and basic profile management to enable secure user access and personalized experiences"**

## Team Capacity Analysis

- **Development Team**: 5 developers (QA and design capacity tracked separately)
- **Sprint Duration**: 10 working days  
- **Net Available Capacity**: 334 hours
- **Target Story Points**: 42 points

## Selected Stories (42 points total)

### Epic: User Authentication (26 points)

- **US-101**: User Registration (8 points)
- **US-102**: User Login/Logout (5 points)  
- **US-103**: Password Reset Flow (8 points)
- **US-104**: Session Management (5 points)

### Epic: Profile Management (16 points)

- **US-201**: View Profile Information (3 points)
- **US-202**: Edit Basic Profile (8 points)
- **US-203**: Avatar Upload (5 points)

## Sprint Commitment

All team members committed to sprint scope and goals. Definition of Done criteria established for each story.

**Success Metrics**: Complete all 42 story points, achieve sprint goal, maintain quality standards.
