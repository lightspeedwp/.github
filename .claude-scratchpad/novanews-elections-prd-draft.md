# NovaNews Elections Dashboard & Hub — Internal PRD

**Status:** Draft for Jose  
**Source:** Linear LS-4461, Zendesk #13851 (summarised via Linear)  
**Date:** 13 October 2026  
**Prepared for:** Jose (technical lead & implementation planner)  
**Purpose:** Internal planning; not evidence of client acceptance or commercial approval

---

## Executive Summary

Prepare a countrywide, near-live South African election results dashboard integrated with an elections editorial hub for NovaNews. The project retrieves IEC-authorised election results via API (preferred) or spreadsheet fallback, displays results by ward, party, metro/district and vote percentage, refreshes every 5–10 minutes, and incorporates journalist stories, live-update articles and two advertising placements within an elections category.

**Immediate outcome:** Monetary quotation for delivery and ongoing support.  
**Scope boundary:** Results dashboard, editorial hub, and advertising—separate from existing homepage widget.  
**Key dependency:** Verified IEC API access, authentication, endpoint coverage and data freshness capability.  
**Timeline:** Client target November 2026 (not a confirmed delivery commitment); quotation validity one month.

---

## Background & Decision Trail

### Client Context
- **Organisation:** NovaNews / Novus Media
- **Website:** https://novanews.co.za/
- **Request initiation:** 15 July 2026 (Zendesk #13851)
- **Most recent update:** 12 October 2026

### Dated Zendesk Conversation (15 July – 12 October 2026)

| Date | Milestone | Decision / Status |
|------|-----------|-------------------|
| **15 Jul** | Initial request | Client requests near-live election-results dashboard. LightSpeed identifies IEC access as the key dependency. |
| **22 Jul** | Scope clarification | Client confirms countrywide coverage, desired measures (ward, party, metro/district, vote %), 5–10 min interval, editorial integration, two adverts. Delayed Excel results are insufficient. |
| **6 Aug** | Hub proposal | LightSpeed suggests considering a combined elections hub; feasibility conditional on automated data retrieval. (Proposal, not approval.) |
| **10–11 Sep** | Fallback discussion | Client requests alternatives pending IEC access. LightSpeed confirms homepage widget has category/tag filtering and suggests spreadsheet imports analogous to Matric Results plugin. (Activation and reuse unverified.) |
| **16–17 Sep** | API provisional answers | Client requests technical help with IEC application. LightSpeed supplies provisional technical answers while acknowledging uncertainty about API services, data, provincial assumptions and request-volume estimates. |
| **9 Oct** | IEC access confirmed | **Client confirms IEC API access approval and receipt of credentials.** ✅ Do not list API access as pending. (Endpoint coverage, publication rights and successful authentication remain unverified.) |
| **12 Oct** | Estimate commitment | Difficulty opening password-protected credentials document reported. LightSpeed commits to preparing estimate. No implementation authorisation evidenced. |

**Key observation:** IEC approval is granted (9 Oct). Technical validation, editorial/design sign-off and commercial approval are not evidenced as complete.

---

## Objectives & Scope

### Primary Objectives
1. **Deliver a near-live election results dashboard** accessible to NovaNews readers nationally.
2. **Integrate results into an elections editorial hub** alongside journalist stories, live-update articles and advertising.
3. **Refresh results every 5–10 minutes** where IEC API capability permits.
4. **Support ward-level geographic drill-down** and party/metro/district filtering.
5. **Fallback to spreadsheet import** if API fails or is unavailable, with client acknowledgement of publication delay.

### Non-Goals & Explicit Exclusions
- Modifying the existing NovaNews homepage article widget (distinct product; already capable of category/tag filtering).
- Designing or developing the IEC API (client responsibility; third-party service).
- Providing production IEC data hosting or storage infrastructure (to be confirmed with client).
- Ongoing IEC API monitoring or escalation support (scope clarification needed).
- Automatic corrections or recounts handling (requirements gathering needed).
- Real-time geotagged vote tracking by ward (data availability and privacy confirmation needed).

### Minimum Viable Product (MVP)
- Live results by province, municipality and ward (where API provides it).
- Vote count, percentage and party standing (reconcile with original request for percentage counted).
- Dashboard UI (map or table, per decision below).
- Fallback import workflow and editorial approval for Excel results.
- Editorial hub layout (elections category, journalist stories, live-update article, two adverts).
- Mobile-responsive design.
- WCAG 2.2 AA accessibility.

### Optional & Future Scope
- Advanced filtering (date range, party comparison, historical analysis).
- Real-time notifications or push alerts.
- Shareable/embeddable result widgets.
- Social media integration.
- Multilingual support.
- Cached/archived results archive.

---

## Functional Requirements

### 1. Data Source & Retrieval

**Requirement:** Retrieve election results from the IEC API (primary) or spreadsheet fallback.

**Sources:** IEC API access (client confirmed 9 Oct 2026), spreadsheet samples (GP.xls—2024 Gauteng Provincial Election; WP.xls—2019 Western Cape Provincial Election).

**Acceptance Criteria:**
- [ ] Verify IEC API endpoint documentation, authentication (token/API key), available result measures and geographic coverage.
- [ ] Confirm authorised publication rights, data attribution/licensing conditions and usage rate limits.
- [ ] Test live authentication refresh and error handling.
- [ ] Document fallback behaviour (Excel import workflow, client responsibilities, acceptable publication lag).

**Outstanding Clarifications:**
- **Spreadsheet structure:** GP.xls and WP.xls show historical provincial-level results with party, vote count and percentage. Confirm whether live IEC API provides ward-level detail, municipality aggregation and whether spreadsheet fallback is the same format.
- **Election/ballot types:** Client originally requested multiple elections or ballots (e.g., provincial, municipal, national). Confirm scope for this release.
- **Rate limits & pagination:** The 12 October estimate mentioned "12 requests/hour" (5-min interval) or "288/day" (10-min). Validate actual endpoint limits, pagination schema and concurrent request behaviour.
- **Authentication refresh:** Confirm token expiry, refresh strategy and fallback if credentials fail mid-election period.
- **Data freshness & lag:** Clarify IEC data update frequency; estimate end-to-end latency from IEC publish to reader-facing dashboard.

---

### 2. Results Display & Filtering

**Requirement:** Display election results by geographic hierarchy, party and measure; support drill-down and filtering.

**Geographic Hierarchy:**
- National (all results)
- Province
- Municipality / Metro
- Ward (per original request 22 Jul: ward-level coverage)

**Result Measures:**
- Vote count (per party, per geography)
- Percentage of votes (per party)
- Party standing / rank (first, second, etc.)
- Percentage counted (original request 15 Jul; later versions specify vote %, not percentage counted—reconcile)
- Registered population / voter turnout (from sample data)

**Acceptance Criteria:**
- [ ] All requested measures retrieve from IEC API or spreadsheet.
- [ ] Drill-down from national → province → municipality → ward (where data available) updates results correctly.
- [ ] Filtering by party or geography updates display in <2 seconds.
- [ ] Results are accurate to the source data (no calculation errors).
- [ ] Accessibility: keyboard navigation, screen reader support (WCAG 2.2 AA).

**Outstanding Decisions:**
- **Map vs. Table:** Map display (visual, geographic context; see News24 reference) vs. tabular results (sortable, precise). Recommend presenting both with client preference; confirm primary interaction pattern.
- **Drill-down interaction:** Click map region to filter results? Dropdown selectors? Multi-select filters? (Affects UX and implementation effort.)
- **Default state:** Should dashboard open with national results, current province or allow saved/bookmarked state?
- **Percentage denominator clarity:** Original request mentions "percentage counted" (votes cast ÷ eligible voters) vs. "vote percentage" (votes for party ÷ total votes cast). IEC data provides the latter. Clarify expected metric or note the data source limitation.

---

### 3. Refresh Interval & Data Freshness

**Requirement:** Update results every 5–10 minutes during election period.

**Acceptance Criteria:**
- [ ] Dashboard refreshes automatically without user refresh.
- [ ] Refresh interval configurable (5, 10, 30 min) without code change (via CMS setting or environment variable).
- [ ] Failed refresh is logged and gracefully handled (retry, stale-data warning, cached fallback).
- [ ] Refresh does not block UI or cause layout shift.

**Outstanding Clarifications:**
- **Polling vs. webhooks:** Current approach is polling (request every 5–10 min). Does IEC support webhooks or GraphQL subscriptions? (Affects real-time capability and server load.)
- **IEC data update frequency:** How often does IEC publish updated results? If updates are infrequent (e.g., hourly), polling every 5 minutes wastes requests. Recommend confirming IEC cadence and aligning polling interval.
- **Stale-data handling:** If refresh fails, how long should stale results be displayed before warning the user? Recommend <30 min with visible timestamp.
- **During election night:** What is the expected volume? Will continuous 5-min polling overwhelm the IEC API or NovaNews server? Recommend load testing with projected concurrent readers and refresh frequency.

---

### 4. Fallback Behaviour (Spreadsheet Import)

**Requirement:** If API is unavailable, support editorial import of Excel election results (IEC-supplied).

**Acceptance Criteria:**
- [ ] Editorial workflow: upload XLS/XLSX → validate structure → schedule publish → display alongside API results with clear "updated [timestamp]" label.
- [ ] Imported results merge with API results (no duplicate parties or geographies).
- [ ] Audit trail: log who uploaded, when, source file name.
- [ ] Rollback capability: revert to previous import if new one contains errors.

**Outstanding Clarifications:**
- **Client responsibility:** Who obtains IEC Excel results? Who uploads? What is the expected cadence? (Daily? Only when API fails?)
- **File format:** Confirm that client-supplied files match GP.xls/WP.xls structure. Document expected sheet names, columns and data types.
- **Acceptable lag:** Client stated (22 Jul) that delayed results are insufficient. Reconcile with fallback approach. Recommend setting explicit SLA: "Spreadsheet fallback only if API down >X minutes; maximum 1-hour lag acceptable."
- **Corrections & recounts:** If IEC publishes corrected results, does editorial re-upload the new file or does the system auto-detect and update? (Affects error handling and audit trail.)

---

### 5. Editorial Hub Integration

**Requirement:** Bring together elections category, journalist stories, live-update article, results dashboard and two advertising placements.

**Acceptance Criteria:**
- [ ] Elections category page displays results dashboard prominently.
- [ ] Journalist stories tagged with elections category appear on the hub alongside results.
- [ ] Live-updates article (confirmed Lise's existing feature) displays separately or embedded.
- [ ] Two advertising placements configured, sized and positioned per client specification.
- [ ] Editorial workflow allows scheduling of stories, ads and result refreshes independently.

**Outstanding Clarifications:**
- **Layout approval:** Client has not approved the hub layout. Propose: hero results dashboard (map or table) + featured story + live updates panel + sidebar ads. Confirm with client and designer.
- **Existing widget vs. new dashboard:** Confirm that the existing homepage article widget remains unchanged. The new dashboard is separate; confirm if homepage should link to elections hub or embed results.
- **Story/ad curation:** Who decides which stories are "featured"? Editorial workflow or automatic (e.g., most recent, highest engagement)?
- **Mobile layout:** Two ads + results + stories on mobile is cramped. Recommend: stacked layout, ads below results, collapsible live updates.
- **Accessibility:** Ads must not interfere with results accessibility. Confirm alt text, focus management and ARIA labels for advertising regions.

---

### 6. Design & Editorial Workflow

**Requirement:** Design system, handoff and editorial approval workflow for results and stories.

**Acceptance Criteria:**
- [ ] Figma design approved by client and internal design team before development.
- [ ] Design system components for results table/map, story cards, ad placements, mobile breakpoints.
- [ ] Editorial approval workflow: results ready → review → publish (with timestamp).
- [ ] Design/editorial handoff documented (who has access, change-request process).

**Outstanding Clarifications:**
- **Design review schedule:** Who reviews the design? When? (Before build, after build, iteratively?)
- **Advertising requirements:** Exact ad sizes (e.g., 300×250, 728×90), platform (Google Ad Manager, direct), category restrictions?
- **Editorial roles:** Who can publish results? Who can upload fallback spreadsheets? Who can schedule stories? Recommend RBAC: Editor, Admin, Publisher roles.
- **Mobile-first design:** Recommend designing mobile first given high mobile readership for news.

---

## Technical Options & Trade-Offs

### Option A: Real-Time API Polling (Recommended)

**Approach:** Client application polls IEC API every 5–10 minutes, caches results, displays latest.

**Advantages:**
- Simple implementation (standard HTTP requests, no webhooks/subscriptions).
- Transparent to client (no third-party infrastructure needed).
- Easy to test and debug.
- Graceful fallback if API temporarily down (display cached results with staleness warning).

**Disadvantages:**
- Fixed polling interval may not align with IEC data update frequency; wastes requests if IEC updates slowly.
- Polling during high-traffic election night may hit rate limits or slow down IEC API for other users.
- Maximum 5-min lag between IEC publish and reader visibility (acceptable per client; confirm).

**Validation Needed:**
- Confirm IEC API rate limits and per-client daily quota.
- Test load: concurrent polling from peak reader traffic + estimated refresh latency.
- Confirm IEC data update cadence (publish frequency).

**Recommendation:** Start with Option A; add webhook support (Option B) only if client provides it and polling proves insufficient.

---

### Option B: Webhook / Event-Driven Updates (Future)

**Approach:** IEC notifies application via webhook when results change; application fetches and updates.

**Advantages:**
- True near-real-time updates (seconds, not 5–10 minutes).
- Minimal polling overhead; respects rate limits.
- Best UX for election night.

**Disadvantages:**
- IEC API must support webhooks (currently unconfirmed; unlikely).
- Requires public endpoint on NovaNews infrastructure, firewall rules, webhook signature validation.
- Implementation complexity (webhook server, retry logic, idempotency).

**Recommendation:** Validate whether IEC supports webhooks. If not, Option A is the standard approach.

---

### Option C: Spreadsheet-Only (Not Recommended)

**Approach:** Rely entirely on editorial spreadsheet upload; no API polling.

**Disadvantages:**
- Does not meet client's "near-live" requirement (22 Jul: delayed results insufficient).
- Heavy manual editorial burden.
- No automatic refresh; results lag election data by hours/days.

**Recommendation:** Reject this option. Spreadsheet fallback only if API unavailable.

---

### Display: Map vs. Table

**Map (e.g., News24 reference)**

Advantages:
- Intuitive geographic context.
- Engaging, shareable visual.
- Good for identifying regional trends.

Disadvantages:
- Complex to implement (GIS integration, choropleth mapping, mobile responsiveness).
- Longer development time.
- Accessibility risk if not designed carefully (color-blind, screen reader support).
- Data annotation challenge (labels on small wards may overlap).

**Table (Sortable, Filterable)**

Advantages:
- Simple, accessible, fast to implement.
- Precise numerical values.
- Mobile-friendly (scroll).
- Familiar to readers.

Disadvantages:
- Less visually engaging.
- Geographic context less obvious.

**Recommendation:** Propose hybrid: map + table. Map shows geographic drill-down; clicking a region updates the table. If map is too complex/timeline-constrained, prioritise table for MVP and offer map as Phase 2.

**Decision Gate:** Confirm map vs. table with client and designer before estimating.

---

## Dependencies & Risks

### Critical Dependencies
1. **IEC API Access & Documentation**
   - Status: Client confirmed access (9 Oct 2026).
   - Validation: Endpoint URL, authentication (token/key), available result measures, geographic coverage, rate limits, response schema, sample requests.
   - Owner: Client + LightSpeed technical lead (Jose).
   - Blocker: Without validated API access, implementation cannot proceed.

2. **Fallback Spreadsheet Access & Structure**
   - Status: GP.xls and WP.xls provided (historical samples).
   - Validation: Confirm live IEC spreadsheets match the structure, frequency and column definitions.
   - Owner: Client (obtains from IEC), LightSpeed (validates and integrates).
   - Blocker: If client cannot obtain live IEC spreadsheets, fallback is unavailable.

3. **Editorial Workflow & Approvals**
   - Status: Not defined.
   - Validation: Confirm who publishes results, approval process, story scheduling.
   - Owner: NovaNews editorial team + LightSpeed.
   - Blocker: Without defined workflow, editorial hub cannot launch.

4. **Advertising Requirements**
   - Status: Pending Riaan's confirmation (mentioned in Linear issue).
   - Validation: Ad sizes, platform, category restrictions, scheduling.
   - Owner: Riaan (NovaNews advertising adviser).
   - Blocker: Without confirmed ad specs, layout cannot be finalised.

5. **Design Approval**
   - Status: Not started.
   - Validation: Client and internal design review before build.
   - Owner: LightSpeed designer (TBD) + client.
   - Blocker: Design changes during development increase scope and timeline.

### Major Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| **IEC API rate limits exceeded during election night** | Medium | High | Load test with peak concurrent users; implement caching, request batching, fallback to spreadsheet. |
| **IEC data structure differs from samples; API incompatibility** | Medium | High | Validate API docs and live sample responses before development. Document expected schema. |
| **Client requests map implementation; timeline overrun** | Medium | High | Confirm map vs. table decision early. Estimate map separately; deliver table as MVP if timeline tight. |
| **Spreadsheet fallback delays prevent publication** | Low | Medium | Set explicit SLA for fallback lag (e.g., max 1 hour). Document client's file-supply responsibility. |
| **Editorial workflow not defined; launch blocked** | Medium | Medium | Clarify workflow in quotation scope; propose default (Editor uploads, Admin approves, Publisher activates). |
| **Advertising placements not approved; layout changes late** | High | Medium | Confirm ad sizes and positions with client and Riaan early; treat as separate from results. |
| **Mobile accessibility not tested; launch blocked** | Low | Medium | Plan accessibility testing (WCAG 2.2 AA) early; allocate effort for screen reader, keyboard nav, color contrast. |
| **November timeline is aspirational, not realistic** | High | Medium | Clarify that November is a client target, not a confirmed delivery date. Estimate effort independently; set realistic milestone. |

---

## Open Questions & Approval Gates

### Investigation (Jose Can Proceed Independently)
- [ ] **API Documentation:** Request IEC API docs (endpoint URLs, authentication, response schema, rate limits, geographic coverage, available measures).
- [ ] **Live Sample:** Retrieve live sample response from IEC API for one province/municipality to confirm data structure.
- [ ] **Rate Limit Testing:** Estimate polling load: 5–10 min interval × peak concurrent readers × number of provinces.
- [ ] **Spreadsheet Structure:** Confirm live IEC Excel files match GP.xls/WP.xls format and column definitions.
- [ ] **Implementation Repository:** Identify NovaNews codebase (WordPress site? Headless CMS? Custom app?); review architecture and hosting constraints.
- [ ] **Existing Infrastructure:** Confirm NovaNews infrastructure (hosting, CDN, CMS, ad platform, analytics).

### Decision Required (Client + LightSpeed)
- [ ] **Map vs. Table:** Confirm primary results display mode. Hybrid?
- [ ] **Fallback SLA:** Maximum acceptable lag for spreadsheet import before warning user (recommend <1 hour).
- [ ] **Geographic Drill-Down:** Confirm expected interaction: national → province → municipality → ward. Default state on load?
- [ ] **Percentage Denominators:** "Vote percentage" (our assumption: votes for party ÷ total votes cast) vs. "percentage counted" (votes cast ÷ eligible voters). Which does IEC API provide? Which does client want?
- [ ] **Mobile Layout:** Approve mobile design (stacked layout recommended; ads below results).
- [ ] **Editorial Roles:** Confirm RBAC: who uploads spreadsheets, who approves results, who publishes?

### Commercial Approval (Ash or Barbara, Before Work Starts)
- [ ] **Budget & Pricing:** Confirm quotation amount, currency, billing terms.
- [ ] **Implementation Timeline:** Confirm realistic delivery date (separate from client's November target).
- [ ] **Ongoing Support:** Clarify post-launch support: ad hoc bug fixes, 24/7 monitoring during election period, or one-time delivery?
- [ ] **Advertising Revenue Sharing:** (If applicable) Confirm commercial terms for integrated ads.
- [ ] **Data Hosting & Retention:** Confirm whether LightSpeed hosts results data or client manages; data retention policy.

---

## Proposed Implementation Breakdown

**Note:** This is a scoping framework, not a committed timeline. Duration estimates and owner assignment require quotation approval and resource planning.

### Phase 1: Investigation & Validation (2–3 weeks)
- [ ] Validate IEC API documentation and live authentication.
- [ ] Test live sample API responses (at least one province).
- [ ] Assess rate limits and polling load.
- [ ] Confirm spreadsheet structure and fallback workflow.
- [ ] Inspect NovaNews codebase and hosting constraints.
- [ ] Outcome: Technical feasibility assessment, architecture proposal, risk register.

### Phase 2: Design & Approval (1–2 weeks, parallel with Phase 1)
- [ ] Create Figma designs: map view (or table), mobile layout, results drill-down, story integration, ad placements.
- [ ] Client review and approval cycle.
- [ ] Confirm advertising specs with Riaan.
- [ ] Outcome: Approved design system and layout.

### Phase 3: Core Dashboard Development (2–3 weeks)
- [ ] API integration (polling, error handling, caching).
- [ ] Results display (table or map, drill-down, filtering).
- [ ] Refresh interval and stale-data warnings.
- [ ] Fallback spreadsheet import workflow.
- [ ] Unit and integration testing.
- [ ] Outcome: Working dashboard on staging environment.

### Phase 4: Editorial Hub Integration (1–2 weeks)
- [ ] Elections category page layout and story integration.
- [ ] Live-update article embedding.
- [ ] Advertising placement configuration.
- [ ] Editorial approval workflow (editorial system integration).
- [ ] Outcome: Hub live on staging with stories and ads.

### Phase 5: Accessibility & Performance (1 week)
- [ ] WCAG 2.2 AA audit (keyboard nav, screen reader, color contrast, focus management).
- [ ] Mobile responsiveness testing (iOS Safari, Android Chrome, tablets).
- [ ] Performance testing (load times, asset sizes, Core Web Vitals).
- [ ] Outcome: Accessible, performant dashboard.

### Phase 6: Testing & Launch Prep (1 week)
- [ ] Staging QA (all features, browsers, devices).
- [ ] Documentation (API integration, fallback workflow, editorial guide).
- [ ] Launch checklist (DNS, SSL, monitoring, incident escalation).
- [ ] Training (editorial team, support team).
- [ ] Outcome: Ready for production deployment.

### Phase 7: Production Deployment & Monitoring (2–3 days)
- [ ] Deploy to production.
- [ ] Monitor polling, API errors, user engagement.
- [ ] Respond to issues.
- [ ] Outcome: Live, monitored dashboard.

### Post-Launch Support (Per Contract)
- [ ] Bug fixes and issue response.
- [ ] Election-night monitoring (if required).
- [ ] Fallback spreadsheet uploads if API unavailable.
- [ ] Advertising and story updates.

**Total estimate (rough):** 8–12 weeks from validation to production (excluding client review and approval delays).

---

## Handoff for Jose

### What You Can Investigate Independently
1. **IEC API Validation**
   - Request full API documentation from LightSpeed Linear issue or client.
   - Authenticate using credentials from the password-protected document (secure access confirmed).
   - Retrieve live sample responses for Gauteng, Western Cape and one metro (to validate ward-level coverage).
   - Document endpoint paths, available filters (province, municipality, ward, party), rate limits and response schema.

2. **Load & Performance Testing**
   - Calculate polling load: peak concurrent readers (estimate from NovaNews analytics) × refresh interval (5–10 min) × number of geographic drill-downs.
   - Test IEC API and NovaNews infrastructure under estimated load.
   - Identify bottlenecks (API rate limits, server capacity, CDN edge cache effectiveness).

3. **Spreadsheet Structure & Import Workflow**
   - Obtain live IEC Excel files (client responsibility; recommend CSV export if available for easier parsing).
   - Compare against GP.xls and WP.xls samples; document any differences in column definitions, data types, sheet names.
   - Design spreadsheet import workflow (upload → validate → merge with API cache → publish).

4. **Repository & Infrastructure Assessment**
   - Clone NovaNews codebase; identify tech stack (WordPress, headless, custom).
   - Review hosting environment (cloud provider, CDN, caching strategy, database).
   - Identify API integration patterns (existing data-fetch libraries, caching layer, error handling).
   - Assess database schema for storing/caching election results.

5. **Existing Widget & Story Integration**
   - Test existing homepage article widget (filtering by category/tag).
   - Confirm capability and activation status with editorial team.
   - Review how live-update article (Lise's feature) is currently published and embedded.

### What Requires a Client or Internal Decision
1. **Map vs. Table Display:** Confirm primary interaction mode. Recommend both with table as MVP.
2. **Fallback Acceptable Lag:** Client must confirm max delay before warning (recommend 1 hour).
3. **Percentage Denominator:** Clarify expected metric (vote % vs. percentage counted).
4. **Advertising Specifications:** Riaan must confirm ad sizes, platform, category restrictions.
5. **Editorial Workflow:** Confirm who approves results, who uploads spreadsheets, approval SLA.
6. **Mobile Layout Approval:** Design team and client must approve mobile-first layout.

### What Blocks Implementation
1. **IEC API Validation:** Cannot develop without confirmed endpoint coverage, data freshness and rate limits.
2. **Commercial Approval:** Cannot start build without approved quotation, budget and timeline.
3. **Design Handoff:** Cannot begin UI development without approved Figma designs and design system.
4. **Advertising Specs:** Cannot finalise layout without confirmed ad sizes and platform.
5. **Spreadsheet Access:** If client cannot obtain live IEC spreadsheets, fallback is unavailable; update scope.

---

## Quotation Scope & Deliverables

**This PRD is internal planning, not a quotation. Quotation must include:**

1. **Deliverables**
   - Near-live election results dashboard (table or map, depending on client decision).
   - Elections editorial hub (category page, story integration, live updates, two adverts).
   - Fallback spreadsheet import workflow.
   - Mobile-responsive design (WCAG 2.2 AA).

2. **Exclusions**
   - Modification of existing homepage article widget (existing service).
   - IEC API design, hosting or ongoing API support (IEC responsibility).
   - Production data hosting infrastructure (to be confirmed with client).
   - Advertising platform setup or Google Ad Manager configuration (client responsibility).
   - Election-night 24/7 monitoring (optional add-on to clarify separately).

3. **Assumptions**
   - IEC API is accessible with authentication and provides ward-level geographic coverage.
   - Client provides live IEC Excel fallback files if API unavailable.
   - Client confirms advertising requirements and editorial workflow before development.
   - NovaNews infrastructure supports polling every 5–10 minutes without performance degradation.
   - Design and editorial workflow are approved before development begins.

4. **Client Responsibilities**
   - Provide secure access to IEC API credentials (password-protected document).
   - Confirm IEC API documentation and test endpoints.
   - Obtain live IEC Excel results files and provide upload mechanism.
   - Confirm advertising specifications with Riaan (sizes, platform, category restrictions).
   - Approve design and editorial workflow before development.
   - Test and approve results on staging before production deployment.

5. **Deliverable Acceptance Criteria**
   - Dashboard displays correct results by geography, party and measure (verified against IEC data).
   - Filtering and drill-down work correctly; results update within 2 seconds.
   - Refresh interval (5 or 10 min) is configurable without code change.
   - Fallback spreadsheet import is tested and works offline if API unavailable.
   - Hub layout includes stories, live updates and two ads without layout shift or accessibility issues.
   - Mobile design is responsive and usable on iOS and Android.
   - WCAG 2.2 AA accessibility criteria are met (keyboard nav, screen reader, color contrast).
   - Documentation includes API integration guide, fallback workflow and editorial user guide.

---

## Key Dates & Validity

- **Source Dates:** Zendesk conversation 15 July–12 October 2026; Linear issue 12 October 2026.
- **Client Target:** November 2026 (request context; not a confirmed delivery commitment).
- **Quotation Validity:** One month from issue date.
- **Outstanding:** Quotation issue date, expiry date and commercial approval dates to be recorded separately.

---

## Sign-Off & Next Actions

### Immediate Next Steps (Jose)
1. Validate IEC API documentation and live authentication.
2. Request design and advertising specifications from client.
3. Clarify map vs. table decision and fallback acceptable lag.
4. Assess NovaNews infrastructure and repository.

### Before Development Starts
1. Commercial approval from Ash or Barbara.
2. Design approval from client and internal team.
3. Client confirmation of advertising specs and editorial workflow.
4. IEC API validation complete and tested.

### This PRD
- **Status:** Draft for internal review.
- **Prepared by:** Claude Code (PRD Agent).
- **Reviewed by:** [Pending Jose's input and clarifications].
- **Approved by:** [Ash, before implementation].
- **Not:** Evidence of client acceptance, commercial approval or permission to implement.

---

## References & Source Material

- **Linear Issue:** https://linear.app/lightspeedwp/issue/LS-4461/estimate-prepare-a-quotation-for-novanewss-elections-dashboard
- **Zendesk Ticket:** https://lightspeedwp.zendesk.com/agent/tickets/13851 (summarised in Linear).
- **Existing Google Document:** https://docs.google.com/document/d/1nM01qLekg6_81z75YHwg-_smec6Ihgp_DEQWErrjxF8/edit?tab=t.enivtnfkooyj
- **IEC Dashboard Reference:** https://results.elections.org.za/dashboards/byelection/
- **News24 Results Map Reference:** https://www.news24.com/elections/map/nnpe?year=2024&level=country
- **Spreadsheet Samples:**
  - GP.xls: 2024 Provincial Election (Gauteng)—registered population 6.5M; party names, vote counts, percentages.
  - WP.xls: 2019 Provincial Election (Western Cape)—registered population 3.1M; same structure.

---

*PRD prepared 13 October 2026 for internal planning. Not client-facing. Retains quotation DoR/DoD separately from proposed delivery scope. All assumptions and open decisions are explicit.*
