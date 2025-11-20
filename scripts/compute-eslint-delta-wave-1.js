#!/usr/bin/env node
/**
 * compute-eslint-delta-wave-1.js
 * Compares baseline (reports/eslint-baseline.json) with post Wave 1 baseline
 * (reports/eslint-baseline-post-wave-1.json) focusing on auto-fixable rules targeted
 * in Wave 1 plan. Outputs JSON delta report at reports/wave-1-delta.json.
 *
 * Converted to ESM to align with package.json { "type": "module" }.
 */
import fs from 'fs';
import path from 'path';

const BASELINE = path.resolve('reports/eslint-baseline.json');
const POST = path.resolve('reports/eslint-baseline-post-wave-1.json');
const OUT = path.resolve('reports/wave-1-delta.json');

// Wave 1 targeted auto-fixable rules (extend as needed based on taxonomy)
const WAVE1_RULES = new Set([
    // Formatting (Prettier & stylistic) – bulk auto-fixes
    'prettier/prettier',
    'semi',
    'quotes',
    'indent',
    'comma-dangle',
    'no-trailing-spaces',
    'eol-last',
    'space-before-function-paren',
    'object-curly-spacing',
    'array-bracket-spacing',
    'keyword-spacing',
    'space-in-parens',
    'space-infix-ops',
    'jsx-quotes',
    // Wave 1 targeted minor correctness / readability
    'no-unused-vars',
    'no-useless-escape',
    'no-prototype-builtins',
]);

function load(file) {
    if (!fs.existsSync(file)) throw new Error(`Missing file: ${file}`);
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function aggregate(results) {
    const counts = {};
    for (const file of results) {
        if (!file.messages) continue;
        for (const m of file.messages) {
            if (!m.ruleId) continue;
            counts[m.ruleId] = (counts[m.ruleId] || 0) + 1;
        }
    }
    return counts;
}

function filterWave1(counts) {
    const filtered = {};
    for (const rule of Object.keys(counts)) {
        if (WAVE1_RULES.has(rule)) filtered[rule] = counts[rule];
    }
    return filtered;
}

function buildDelta(before, after) {
    const allRules = new Set([...Object.keys(before), ...Object.keys(after)]);
    const rows = [];
    let beforeTotal = 0;
    let afterTotal = 0;
    for (const rule of allRules) {
        const b = before[rule] || 0;
        const a = after[rule] || 0;
        beforeTotal += b;
        afterTotal += a;
        rows.push({
            rule,
            before: b,
            after: a,
            delta: a - b,
            reduction: b === 0 ? 0 : ((b - a) / b) * 100,
        });
    }
    const overallReduction =
        beforeTotal === 0
            ? 0
            : ((beforeTotal - afterTotal) / beforeTotal) * 100;
    return {
        summary: { beforeTotal, afterTotal, overallReduction },
        rules: rows.sort((x, y) => y.before - x.before),
    };
}

function main() {
    const baseline = load(BASELINE);
    const post = load(POST);
    const beforeCountsAll = aggregate(baseline);
    const afterCountsAll = aggregate(post);
    const beforeCounts = filterWave1(beforeCountsAll);
    const afterCounts = filterWave1(afterCountsAll);
    const delta = buildDelta(beforeCounts, afterCounts);
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(delta, null, 2));
    console.log(`Wave 1 delta written to ${OUT}`);
    console.log(
        `Reduction: ${delta.summary.overallReduction.toFixed(2)}% (before ${delta.summary.beforeTotal} → after ${delta.summary.afterTotal})`
    );
}

// Execute when run directly (not when imported)
const directInvocation =
    process.argv[1] &&
    process.argv[1].endsWith('compute-eslint-delta-wave-1.js');
if (directInvocation) {
    try {
        main();
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}

export { main };
