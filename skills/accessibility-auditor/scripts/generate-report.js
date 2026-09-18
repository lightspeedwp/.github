#!/usr/bin/env node
/**
 * Accessibility Audit Report Generator
 * Usage: node generate-report.js <output-path> < audit-data.json
 *
 * Accepts structured JSON on stdin and writes a branded .docx report
 * to the specified output path.
 */

let docx;
try {
  docx = require('docx');
} catch {
  try {
    docx = require('/tmp/docx-tmp/node_modules/docx');
  } catch {
    console.error('ERROR: docx package not found. Run: npm install docx --prefix /tmp/docx-tmp');
    process.exit(1);
  }
}

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  PageBreak,
} = docx;

const fs = require('fs');
const path = require('path');

// ─── Colour constants ──────────────────────────────────────────────────────
const BRAND_DARK = '080808';
const BRAND_BLUE = '1E6AFF';
const SECTION_BG = 'F4F6FF';
const MUTED      = '505050';
const WHITE      = 'FFFFFF';

const STATUS_STYLE = {
  Pass: { fill: 'E8F5E9', text: '1B5E20' },
  Fail: { fill: 'FFEBEE', text: 'B71C1C' },
  Warn: { fill: 'FFF8E1', text: 'E65100' },
};
const PRI_STYLE = {
  Critical: { fill: 'FFEBEE', text: 'B71C1C' },
  Medium:   { fill: 'FFF8E1', text: 'E65100' },
  Low:      { fill: 'E8F5E9', text: '1B5E20' },
};

// ─── Column widths (DXA — all rows must sum to CONTENT_W) ─────────────────
const CONTENT_W   = 10080;
const COL_AUDIT   = [900, 3200, 1300, 1700, 2980];   // sum = 10080
const COL_RECS    = [1200, 2400, 6480];               // sum = 10080
const COL_CAT     = [4680, 1800, 1800, 1800];         // sum = 10080
const COL_SCORE   = [2520, 2520, 2520, 2520];         // sum = 10080

// ─── Helpers ──────────────────────────────────────────────────────────────

function cellMargins() {
  return { top: 80, bottom: 80, left: 120, right: 120 };
}

function noGapBorders() {
  const n = { style: BorderStyle.NONE, size: 0, color: 'auto' };
  return { top: n, bottom: n, left: n, right: n, insideH: n, insideV: n };
}

function thinBorders() {
  const t = { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD' };
  return { top: t, bottom: t, left: t, right: t, insideH: t, insideV: t };
}

function para(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text: String(text), ...opts })],
    spacing: opts.spacing || { after: 80 },
    alignment: opts.alignment || AlignmentType.LEFT,
  });
}

function bold(text, size = 24) {
  return new TextRun({ text: String(text), bold: true, size });
}

function cell(children, { fill, width, borders, margins, vAlign } = {}) {
  const shading = fill
    ? { type: ShadingType.CLEAR, fill, color: 'auto' }
    : undefined;
  return new TableCell({
    children: Array.isArray(children) ? children : [children],
    shading,
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    borders: borders || thinBorders(),
    margins: margins || cellMargins(),
    verticalAlign: vAlign,
  });
}

function headerCell(text, width, fill = BRAND_BLUE) {
  return cell(
    [new Paragraph({ children: [bold(text, 18)], spacing: { after: 0 } })],
    { fill, width, borders: noGapBorders() }
  );
}

function textCell(text, width, fill, textColor = '000000', size = 18) {
  return cell(
    [new Paragraph({ children: [new TextRun({ text: String(text), size, color: textColor })], spacing: { after: 0 } })],
    { fill, width }
  );
}

function scoreColor(score) {
  if (score >= 75) return '1B5E20';
  if (score >= 35) return 'E65100';
  return 'B71C1C';
}

function scoreFill(score) {
  if (score >= 75) return 'E8F5E9';
  if (score >= 35) return 'FFF8E1';
  return 'FFEBEE';
}

// ─── Schema validation ────────────────────────────────────────────────────

const REQUIRED = ['subject', 'artefactType', 'date', 'standard', 'score', 'summary', 'categories', 'criteria', 'recommendations'];

function validate(data) {
  if (!data || typeof data !== 'object') {
    console.error('ERROR: Input data must be a JSON object');
    process.exit(1);
  }
  const missing = REQUIRED.filter(k => !(k in data));
  if (missing.length) {
    console.error(`ERROR: Missing required JSON fields: ${missing.join(', ')}`);
    process.exit(1);
  }
  if (!data.score || typeof data.score !== 'object') {
    console.error('ERROR: score field must be an object');
    process.exit(1);
  }
  const scoreFields = ['overall', 'failures', 'warnings', 'passes'];
  const missingScore = scoreFields.filter(k => !(k in data.score));
  if (missingScore.length) {
    console.error(`ERROR: Missing score fields: ${missingScore.join(', ')}`);
    process.exit(1);
  }
  if (!Array.isArray(data.criteria)) {
    console.error('ERROR: criteria field must be an array');
    process.exit(1);
  }
  for (const c of data.criteria) {
    if (!c || typeof c.id !== 'string') {
      console.error('ERROR: Each criterion must have a valid string id');
      process.exit(1);
    }
  }
}

// ─── Page 1: Cover + Executive Summary ───────────────────────────────────

function buildPage1(data) {
  const { subject, artefactType, date, standard, dsName, score, summary, categories } = data;
  const parts = [];

  // Title block
  parts.push(
    new Paragraph({
      children: [bold('Accessibility Audit Report', 96)],
      spacing: { before: 240, after: 120 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `${subject} · ${artefactType}`, size: 48, color: MUTED })],
      spacing: { after: 120 },
    })
  );

  // Metadata table
  const metaRows = [
    ['Audit standard', standard],
    ['Date', date],
    ['Design system', dsName || 'Generic WCAG-compliant patterns'],
  ];
  parts.push(
    new Table({
      columnWidths: [COL_SCORE[0], COL_SCORE[1] + COL_SCORE[2] + COL_SCORE[3]],
      width: { size: CONTENT_W, type: WidthType.DXA },
      borders: noGapBorders(),
      rows: metaRows.map(([label, value]) =>
        new TableRow({
          children: [
            textCell(label, COL_SCORE[0], undefined, MUTED),
            textCell(value, COL_SCORE[1] + COL_SCORE[2] + COL_SCORE[3]),
          ],
        })
      ),
    }),
    new Paragraph({ children: [], spacing: { after: 240 } })
  );

  // Score card
  parts.push(
    new Paragraph({ children: [bold('Executive Summary', 28)], spacing: { after: 120 } }),
    new Table({
      columnWidths: COL_SCORE,
      width: { size: CONTENT_W, type: WidthType.DXA },
      borders: thinBorders(),
      rows: [
        new TableRow({
          children: [
            headerCell('Overall Score', COL_SCORE[0]),
            headerCell('Failures', COL_SCORE[1]),
            headerCell('Warnings', COL_SCORE[2]),
            headerCell('Passes', COL_SCORE[3]),
          ],
        }),
        new TableRow({
          children: [
            textCell(`${score.overall}/100`, COL_SCORE[0], scoreFill(score.overall), scoreColor(score.overall), 32),
            textCell(String(score.failures), COL_SCORE[1], STATUS_STYLE.Fail.fill, STATUS_STYLE.Fail.text, 32),
            textCell(String(score.warnings), COL_SCORE[2], STATUS_STYLE.Warn.fill, STATUS_STYLE.Warn.text, 32),
            textCell(String(score.passes), COL_SCORE[3], STATUS_STYLE.Pass.fill, STATUS_STYLE.Pass.text, 32),
          ],
        }),
      ],
    }),
    new Paragraph({ children: [], spacing: { after: 160 } }),
    para(summary, { size: 20 }),
    new Paragraph({ children: [], spacing: { after: 240 } })
  );

  // Category breakdown
  parts.push(
    new Paragraph({ children: [bold('Category Breakdown', 24)], spacing: { after: 120 } }),
    new Table({
      columnWidths: COL_CAT,
      width: { size: CONTENT_W, type: WidthType.DXA },
      borders: thinBorders(),
      rows: [
        new TableRow({
          children: [
            headerCell('Category', COL_CAT[0]),
            headerCell('Score', COL_CAT[1]),
            headerCell('Failures', COL_CAT[2]),
            headerCell('Warnings', COL_CAT[3]),
          ],
        }),
        ...categories.map(cat =>
          new TableRow({
            children: [
              textCell(cat.name, COL_CAT[0]),
              textCell(cat.score, COL_CAT[1]),
              textCell(String(cat.failures), COL_CAT[2], cat.failures > 0 ? STATUS_STYLE.Fail.fill : STATUS_STYLE.Pass.fill, cat.failures > 0 ? STATUS_STYLE.Fail.text : STATUS_STYLE.Pass.text),
              textCell(String(cat.warnings), COL_CAT[3], cat.warnings > 0 ? STATUS_STYLE.Warn.fill : STATUS_STYLE.Pass.fill, cat.warnings > 0 ? STATUS_STYLE.Warn.text : STATUS_STYLE.Pass.text),
            ],
          })
        ),
      ],
    })
  );

  return parts;
}

// ─── Comparison page (re-audit only) ─────────────────────────────────────

const COMP_COL = [2200, 2200, 5680]; // ID · Prev → Now · Finding  (sum = 10080)

function buildComparisonPage(data) {
  const { comparison, subject } = data;
  const { previousScore, newScore, delta, improved, regressed, stillFailing, skillVersionsMismatched } = comparison;

  const deltaSign  = delta >= 0 ? '+' : '';
  const deltaColor = delta >= 0 ? '1B5E20' : 'B71C1C';
  const deltaFill  = delta >= 0 ? 'E8F5E9' : 'FFEBEE';

  const parts = [
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({ children: [bold('Score Comparison', 28)], spacing: { after: 80 } }),
    para(`Re-audit of ${subject} — changes since previous evaluation`, { size: 18, color: MUTED }),
    new Paragraph({ children: [], spacing: { after: 160 } }),
  ];

  // Score delta banner
  parts.push(
    new Table({
      columnWidths: [COL_SCORE[0], COL_SCORE[1], COL_SCORE[2], COL_SCORE[3]],
      width: { size: CONTENT_W, type: WidthType.DXA },
      borders: thinBorders(),
      rows: [
        new TableRow({
          children: [
            headerCell('Previous Score', COL_SCORE[0]),
            headerCell('New Score', COL_SCORE[1]),
            headerCell('Delta', COL_SCORE[2]),
            headerCell('', COL_SCORE[3]),
          ],
        }),
        new TableRow({
          children: [
            textCell(`${previousScore}/100`, COL_SCORE[0], scoreFill(previousScore), scoreColor(previousScore), 32),
            textCell(`${newScore}/100`, COL_SCORE[1], scoreFill(newScore), scoreColor(newScore), 32),
            textCell(`${deltaSign}${delta}`, COL_SCORE[2], deltaFill, deltaColor, 32),
            textCell(delta >= 0 ? 'Improved' : 'Regressed', COL_SCORE[3], deltaFill, deltaColor, 20),
          ],
        }),
      ],
    }),
    new Paragraph({ children: [], spacing: { after: 240 } })
  );

  if (skillVersionsMismatched) {
    parts.push(
      para('Note: skill versions differ from the prior audit. Criteria coverage may have changed — treat this comparison as approximate.', { size: 16, color: 'E65100' }),
      new Paragraph({ children: [], spacing: { after: 160 } })
    );
  }

  function compTable(title, rows, headerFill) {
    if (!rows || !rows.length) return;
    parts.push(
      new Paragraph({ children: [bold(title, 22)], spacing: { after: 80 } }),
      new Table({
        columnWidths: COMP_COL,
        width: { size: CONTENT_W, type: WidthType.DXA },
        borders: thinBorders(),
        rows: [
          new TableRow({
            children: [
              headerCell('Criterion ID', COMP_COL[0], headerFill),
              headerCell('Change', COMP_COL[1], headerFill),
              headerCell('Finding', COMP_COL[2], headerFill),
            ],
          }),
          ...rows.map(r => new TableRow({
            children: [
              textCell(r.id, COMP_COL[0], undefined, MUTED, 16),
              textCell(r.prev ? `${r.prev} → ${r.now || r.status}` : r.status, COMP_COL[1]),
              textCell(r.finding || '', COMP_COL[2], undefined, MUTED, 16),
            ],
          })),
        ],
      }),
      new Paragraph({ children: [], spacing: { after: 200 } })
    );
  }

  compTable('Improved (Fixed)', improved, '2E7D32');
  compTable('Regressions', regressed, 'B71C1C');
  compTable('Still Failing', stillFailing, 'E65100');

  return parts;
}

// ─── Page 2: Full Audit Results ───────────────────────────────────────────

function buildPage2(data) {
  const { criteria } = data;
  const parts = [
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({ children: [bold('Full Audit Results', 28)], spacing: { after: 120 } }),
  ];

  // Group criteria by category prefix
  const groups = {};
  for (const c of criteria) {
    const prefix = c.id.replace(/-\d+$/, '');
    if (!groups[prefix]) groups[prefix] = [];
    groups[prefix].push(c);
  }

  const categoryNames = {
    C: 'Color contrast', L: 'Links & interactive elements', H: 'Heading structure & semantics',
    I: 'Images & media', FM: 'Forms & inputs', D: 'Dynamic components',
    DV: 'Data visualisation', M: 'Motion & animation', MB: 'Mobile accessibility',
    CO: 'Cognitive accessibility', AR: 'ARIA & landmark structure',
    E: 'Email-specific', P: 'PDF-specific',
  };

  const headerRow = new TableRow({
    children: [
      headerCell('ID', COL_AUDIT[0]),
      headerCell('Criterion', COL_AUDIT[1]),
      headerCell('Status', COL_AUDIT[2]),
      headerCell('WCAG', COL_AUDIT[3]),
      headerCell('Finding / Notes', COL_AUDIT[4]),
    ],
  });

  const rows = [headerRow];

  for (const [prefix, items] of Object.entries(groups)) {
    const catName = categoryNames[prefix] || prefix;
    // Category header row
    rows.push(
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 5,
            children: [new Paragraph({ children: [bold(catName, 20)], spacing: { after: 0 } })],
            shading: { type: ShadingType.CLEAR, fill: SECTION_BG, color: 'auto' },
            borders: thinBorders(),
            margins: cellMargins(),
          }),
        ],
      })
    );
    for (const c of items) {
      const st = STATUS_STYLE[c.status] || STATUS_STYLE.Warn;
      rows.push(
        new TableRow({
          children: [
            textCell(c.id, COL_AUDIT[0], undefined, MUTED, 16),
            textCell(c.criterion, COL_AUDIT[1], undefined, '000000', 18),
            textCell(c.status, COL_AUDIT[2], st.fill, st.text, 18),
            textCell(c.wcag, COL_AUDIT[3], undefined, MUTED, 16),
            textCell(c.finding || '', COL_AUDIT[4], undefined, MUTED, 16),
          ],
        })
      );
    }
  }

  parts.push(
    new Table({
      columnWidths: COL_AUDIT,
      width: { size: CONTENT_W, type: WidthType.DXA },
      borders: thinBorders(),
      rows,
    })
  );

  return parts;
}

// ─── Page 3: Recommendations ─────────────────────────────────────────────

function buildPage3(data) {
  const { recommendations, subject, artefactType, date } = data;
  const parts = [
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({ children: [bold('Recommendations', 28)], spacing: { after: 120 } }),
    new Table({
      columnWidths: COL_RECS,
      width: { size: CONTENT_W, type: WidthType.DXA },
      borders: thinBorders(),
      rows: [
        new TableRow({
          children: [
            headerCell('Priority', COL_RECS[0]),
            headerCell('Check IDs', COL_RECS[1]),
            headerCell('Recommended fix', COL_RECS[2]),
          ],
        }),
        ...recommendations.map(r => {
          const st = PRI_STYLE[r.priority] || PRI_STYLE.Low;
          return new TableRow({
            children: [
              textCell(r.priority, COL_RECS[0], st.fill, st.text),
              textCell(r.checkIds, COL_RECS[1], undefined, MUTED, 16),
              textCell(r.fix, COL_RECS[2]),
            ],
          });
        }),
      ],
    }),
    new Paragraph({ children: [], spacing: { after: 320 } }),
    para(`Prepared by LightSpeed Accessibility Auditor · ${artefactType} audit of ${subject} · ${date}`, { size: 16, color: MUTED }),
    para('This is a visual and description-based audit. Code-level attributes (ARIA states, alt text) require live code inspection for full confirmation. A dedicated automated scan (Axe, WAVE, Lighthouse) is recommended for complete coverage.', { size: 14, color: MUTED }),
  ];

  return parts;
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main() {
  const outputPath = process.argv[2];
  if (!outputPath) {
    console.error('ERROR: Output path required. Usage: node generate-report.js <output-path> < audit-data.json');
    process.exit(1);
  }

  let raw = '';
  for await (const chunk of process.stdin) raw += chunk;

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('ERROR: Invalid JSON on stdin:', e.message);
    process.exit(1);
  }

  validate(data);

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 },
        },
      },
      children: [
        ...buildPage1(data),
        ...(data.comparison ? buildComparisonPage(data) : []),
        ...buildPage2(data),
        ...buildPage3(data),
      ],
    }],
  });

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Report written to: ${outputPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

main().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
