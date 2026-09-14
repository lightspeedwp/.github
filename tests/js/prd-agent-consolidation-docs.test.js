import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(__dirname, "../..");

function readRepoFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function extractSection(markdown, headingPattern, nextHeadingPattern) {
  const start = markdown.search(headingPattern);
  if (start === -1) {
    throw new Error(`Missing section matching ${headingPattern}`);
  }

  const sectionStart = markdown.indexOf("\n", start) + 1;
  const remainder = markdown.slice(sectionStart);
  const end = remainder.search(nextHeadingPattern);
  return end === -1 ? remainder : remainder.slice(0, end);
}

const spec = readRepoFile(".github/specs/001-prd-agent-consolidation/spec.md");
const tasks = readRepoFile(
  ".github/specs/001-prd-agent-consolidation/tasks.md",
);
const adoptionMetrics = readRepoFile("agents/prd-agent/ADOPTION_METRICS.md");
const changelog = readRepoFile("agents/prd-agent/CHANGELOG.md");
const rootChangelog = readRepoFile("CHANGELOG.md");
const phase6Log = readRepoFile("agents/prd-agent/PHASE6_EXECUTION_LOG.md");
const phase7Criteria = readRepoFile(
  "agents/prd-agent/PHASE7_DECISION_CRITERIA.md",
);

describe("PRD agent consolidation convergence documentation", () => {
  describe("task plan", () => {
    test("assigns the renumbered Phase 3 tasks a contiguous ID range", () => {
      const phase3 = extractSection(tasks, /^## Phase 3:/m, /^## Phase 4:/m);
      const taskIds = [...phase3.matchAll(/^- \[[ xX]\] (T\d{3})\b/gm)].map(
        (match) => match[1],
      );
      const expectedIds = Array.from(
        { length: 40 },
        (_, index) => `T${String(index + 9).padStart(3, "0")}`,
      );

      expect(taskIds).toEqual(expectedIds);
      expect(new Set(taskIds).size).toBe(taskIds.length);
    });

    test.each([
      ["T081", "CHANGELOG.md", "FR-415"],
      ["T082", "PHASE6_EXECUTION_LOG.md", "T071/T073"],
      ["T083", "ADOPTION_METRICS.md", "SC-602"],
      ["T084", "PHASE7_DECISION_CRITERIA.md", "FR-702"],
      ["T085", "CHANGELOG.md", "T075"],
    ])(
      "marks convergence task %s complete with its contract",
      (id, file, ref) => {
        const taskLine = tasks
          .split("\n")
          .find((line) => new RegExp(`^- \\[x\\] ${id}\\b`).test(line));

        expect(taskLine).toBeDefined();
        expect(taskLine).toContain(file);
        expect(taskLine).toContain(ref);
        expect(taskLine).toMatch(/✅ 2026-09-13:/);
      },
    );

    test("keeps Phase 7 work blocked behind the Phase 6 completion gate", () => {
      expect(tasks).toMatch(/T076 .*\(Blocked on T075\)/);
      expect(tasks).toMatch(/T077 .*\(Blocked on T076\)/);
      expect(tasks).toMatch(/T078 .*\(Blocked on T077\)/);
      expect(tasks).toMatch(/T079 .*\(Blocked on T077\)/);
      expect(tasks).toMatch(/T080 .*\(Blocked on T078 OR T079 OR T080-Defer\)/);
      expect(tasks).toMatch(/T080-Defer .*\(Blocked on T077\)/);
    });

    test("gives every Phase 7 branch and closure task a distinct identifier", () => {
      const phase7 = extractSection(
        tasks,
        /^### Phase 7: Optional Spec-Based Agent Sync\/Archive/m,
        /^## Convergence Tasks/m,
      );
      const taskIds = [
        ...phase7.matchAll(/^- \[[ xX]\] (T\d{3}(?:-[A-Za-z]+)?)\b/gm),
      ].map((match) => match[1]);

      expect(taskIds).toEqual([
        "T076",
        "T077",
        "T078",
        "T079",
        "T080",
        "T080-Defer",
      ]);
      expect(new Set(taskIds).size).toBe(taskIds.length);
    });
  });

  describe("SC-602 adoption contract", () => {
    test("uses the same sustained weekly threshold in the spec and KPI definition", () => {
      const rollingWindow = "≥1 PRD generation per rolling 7-day window";
      const sustainedWindow = "sustained for ≥4 of 6 weeks";

      expect(spec).toContain(rollingWindow);
      expect(spec).toContain(sustainedWindow);
      expect(adoptionMetrics).toMatch(
        /≥1 PRD generation(?: event)? per rolling 7-day window/,
      );
      expect(adoptionMetrics).toMatch(/≥4 of the 6 weeks/);
    });

    test("does not reintroduce the superseded 30-day-average definition", () => {
      expect(spec).not.toMatch(/rolling 30-day average|30-day average/i);
      expect(adoptionMetrics).not.toMatch(
        /rolling 30-day average|30-day average/i,
      );
    });

    test("defines observable signals and a cross-check for active usage", () => {
      expect(adoptionMetrics).toMatch(
        /\*\*Metric Type\*\*: Agent invocation count/,
      );
      expect(adoptionMetrics).toContain("Skill routing events");
      expect(adoptionMetrics).toContain("Workflow trigger events");
      expect(adoptionMetrics).toMatch(
        /Cross-reference team lead survey responses with logged invocations/,
      );
    });

    test("requires sustained use while preserving the documented short-week grace", () => {
      expect(adoptionMetrics).toMatch(
        /meets ALL of the following:[\s\S]*integrated agent into workflow/,
      );
      expect(adoptionMetrics).toMatch(
        /sustains this threshold[\s\S]*≥4 of the 6 weeks/,
      );
      expect(adoptionMetrics).toMatch(
        /Short weeks with <1 PRD may count[\s\S]*following week shows ≥1 PRD/,
      );
    });

    test("keeps Phase 4 registry work separate from the Phase 7 fate decision", () => {
      const phase4 = extractSection(spec, /^## Phase 4:/m, /^## Phase 5:/m);

      expect(phase4).toMatch(
        /FR-413.*Update `agents\/mode-prd\.agent\.md` memory registry entry/,
      );
      expect(phase4).toMatch(
        /FR-701.*Execute Phase 7 decision on archival\/deprecation/,
      );
    });
  });

  describe("Phase 6 execution log", () => {
    const weekHeadings = [
      ...phase6Log.matchAll(
        /^## Week (\d) Check-In \((\d{4}-\d{2}-\d{2}) through (\d{4}-\d{2}-\d{2})\)$/gm,
      ),
    ];

    test("covers six contiguous seven-day check-in windows", () => {
      expect(weekHeadings).toHaveLength(6);

      weekHeadings.forEach((heading, index) => {
        const [, week, start, end] = heading;
        const startDate = new Date(`${start}T00:00:00Z`);
        const endDate = new Date(`${end}T00:00:00Z`);

        expect(Number(week)).toBe(index + 1);
        expect((endDate - startDate) / 86_400_000).toBe(6);

        if (index > 0) {
          const previousEnd = new Date(
            `${weekHeadings[index - 1][3]}T00:00:00Z`,
          );
          expect((startDate - previousEnd) / 86_400_000).toBe(1);
        }
      });
    });

    test("provides T073 usage and adoption fields in every weekly check-in", () => {
      weekHeadings.forEach((heading, index) => {
        const start = heading.index;
        const end = weekHeadings[index + 1]?.index ?? phase6Log.length;
        const week = phase6Log.slice(start, end);

        expect(week).toMatch(/Usage Monitoring \(T073\)/);
        expect(week).toMatch(/Weekly KPI Check|Final KPI Status/);
        expect(week).toMatch(/Agent invocation/i);
        expect(week).toMatch(/Active teams/i);
      });
    });

    test("allocates all five team briefings across weeks two and three", () => {
      const briefingTeams = [
        ...phase6Log.matchAll(
          /Team ([A-E]) briefing completed \(date: ____\)/g,
        ),
      ].map((match) => match[1]);

      expect(briefingTeams).toEqual(["A", "B", "C", "D", "E"]);
    });

    test("hands all success metrics to the Phase 7 decision gate", () => {
      for (const criterion of ["SC-601", "SC-602", "SC-603", "SC-604"]) {
        expect(phase6Log).toContain(criterion);
      }
      expect(phase6Log).toContain("PHASE7_DECISION_CRITERIA.md");
      expect(phase6Log).toMatch(
        /Active teams: ____ \(vs\. SC-602 target: ≥5\)/,
      );
      expect(phase6Log).toMatch(
        /Satisfaction score: ____ \/ 5\.0 \(vs\. SC-603 target: ≥4\.0\)/,
      );
      expect(phase6Log).toMatch(
        /Critical issues: ____ \(vs\. SC-604 target: 0\)/,
      );
    });

    test("keeps critical-blocker precedence consistent in the hand-off matrix", () => {
      expect(phase6Log).toMatch(
        /Archive: \(<5 teams OR <4\.0 satisfaction\) AND 0 critical blockers/,
      );
      expect(phase6Log).toMatch(
        /Sync: ≥5 teams AND ≥4\.0 satisfaction AND 0 critical blockers/,
      );
      expect(phase6Log).toMatch(
        /Defer: Inconclusive data OR unresolved critical blockers/,
      );
    });
  });

  describe("Phase 7 decision matrix", () => {
    test("documents every decision path and its execution requirement", () => {
      expect(phase7Criteria).toContain(
        "**Condition**: `[(Active Teams < 5) OR (Satisfaction Score < 4.0)] AND (Critical Blockers == 0)`",
      );
      expect(phase7Criteria).toContain(
        "**Condition**: `(Active Teams >= 5) AND (Satisfaction Score >= 4.0) AND (Critical Blockers == 0)`",
      );
      expect(phase7Criteria).toContain(
        "**Condition**: `(Active Teams >= 5 AND Satisfaction Score < 4.0) OR (Active Teams < 5 AND Satisfaction Score >= 4.0) OR (Critical Blockers > 0) OR [(Active Teams < 5 OR Satisfaction Score < 4.0) AND (Critical Blockers > 0)]`",
      );
      expect(phase7Criteria).toMatch(
        /### Path 1: ARCHIVE[\s\S]*\*\*Actions \(FR-703\)\*\*/,
      );
      expect(phase7Criteria).toMatch(
        /### Path 2: SYNC[\s\S]*\*\*Actions \(FR-704\)\*\*/,
      );
      expect(phase7Criteria).toMatch(
        /### Path 3: DEFER[\s\S]*Re-assessment criteria defined/,
      );
      expect(phase7Criteria).toMatch(
        /\*\*Decision Path Selected\*\*: \[ \] ARCHIVE \[ \] SYNC \[ \] DEFER/,
      );
    });

    test("guards both terminal paths against unresolved critical blockers", () => {
      const archive = extractSection(
        phase7Criteria,
        /^### Path 1: ARCHIVE/m,
        /^---$/m,
      );
      const sync = extractSection(
        phase7Criteria,
        /^### Path 2: SYNC/m,
        /^---$/m,
      );
      const defer = extractSection(
        phase7Criteria,
        /^### Path 3: DEFER/m,
        /^---$/m,
      );

      expect(archive).toMatch(/Critical Blockers == 0/);
      expect(sync).toMatch(/Critical Blockers == 0/);
      expect(defer).toMatch(/Critical Blockers > 0/);
      expect(defer).toMatch(/Unresolved critical blockers take precedence/i);
    });

    test("defines actionable outputs for the negative DEFER path", () => {
      const defer = extractSection(
        phase7Criteria,
        /^### Path 3: DEFER/m,
        /^---$/m,
      );

      expect(defer).toContain("Re-assessment criteria defined");
      expect(defer).toMatch(/follow-up issue created with due date/i);
      expect(defer).toContain("agents/prd-agent/PHASE7_DECISION.md");
      expect(tasks).toContain("`[PHASE-7-DEFER]`");
    });
  });

  describe("release history", () => {
    test("orders versions newest first", () => {
      const versions = [...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\]/gm)].map(
        (match) => match[1],
      );
      const descending = [...versions].sort((left, right) => {
        const leftParts = left.split(".").map(Number);
        const rightParts = right.split(".").map(Number);
        return (
          rightParts[0] - leftParts[0] ||
          rightParts[1] - leftParts[1] ||
          rightParts[2] - leftParts[2]
        );
      });

      expect(versions).toEqual(descending);
    });

    test("records complete Phase 5 provider results and requirements in v2.3.0", () => {
      const phase5Release = extractSection(
        changelog,
        /^## \[2\.3\.0\]/m,
        /^## \[/m,
      );

      for (const section of ["Changed", "Added", "Fixed"]) {
        expect(phase5Release).toContain(`### ${section}`);
      }
      for (const provider of [
        "Claude 14/14",
        "Copilot 14/14",
        "OpenAI 14/14",
      ]) {
        expect(phase5Release).toContain(provider);
      }
      for (const requirement of [
        "FR-501",
        "FR-502",
        "FR-503",
        "FR-504",
        "FR-505",
      ]) {
        expect(phase5Release).toContain(requirement);
      }
    });

    test("keeps v2.4.0 explicitly pending with complete Phase 6 placeholders", () => {
      const phase6Release = extractSection(
        changelog,
        /^## \[2\.4\.0\]/m,
        /^## \[/m,
      );

      expect(changelog).toMatch(/^## \[2\.4\.0\] - \[WIP\]/m);
      expect(phase6Release).toContain("**Release Date**: TBD");
      for (const section of ["Changed", "Added", "Fixed"]) {
        expect(phase6Release).toContain(`### ${section}`);
      }
      for (const requirement of [
        "FR-601",
        "FR-602",
        "FR-603",
        "FR-604",
        "FR-605",
      ]) {
        expect(phase6Release).toContain(requirement);
      }
      for (const criterion of ["SC-601", "SC-602", "SC-603", "SC-604"]) {
        expect(phase6Release).toContain(criterion);
        expect(phase6Release).toMatch(
          new RegExp(`^- \\[ \\] ${criterion}:`, "m"),
        );
      }
    });

    test("records the blocker-precedence regression fix in the root changelog", () => {
      const unreleased = extractSection(
        rootChangelog,
        /^## \[Unreleased\]/m,
        /^## \[/m,
      );

      expect(unreleased).toContain(
        "PRD Agent Consolidation — Phase 7 Decision Logic Consistency",
      );
      expect(unreleased).toContain("Critical Blockers == 0");
      expect(unreleased).toContain("T080-Defer");
    });

    test("references only Phase 6 artefacts that exist in the repository", () => {
      for (const file of [
        "ROLLOUT_PLAN.md",
        "ADOPTION_METRICS.md",
        "FAQ.md",
        "PHASE6_EXECUTION_LOG.md",
        "PHASE7_DECISION_CRITERIA.md",
      ]) {
        expect(changelog).toContain(`**${file}**`);
        expect(
          fs.existsSync(path.join(repoRoot, "agents/prd-agent", file)),
        ).toBe(true);
      }
    });
  });
});
