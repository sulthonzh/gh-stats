import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs } from '../src/args.js';
import { daysSince } from '../src/api.js';
import { formatText, formatJSON, formatMarkdown } from '../src/format.js';

const NOW = new Date('2026-06-09T10:00:00Z').getTime();

const sampleRepos = [
  { name: 'my-app', stars: 42, forks: 7, issues: 3, fork: false, updatedAt: '2026-06-07T10:00:00Z', language: 'JavaScript', description: 'A cool app', url: 'https://github.com/test/my-app', activity: 'active' },
  { name: 'old-lib', stars: 5, forks: 1, issues: 0, fork: false, updatedAt: '2026-04-01T10:00:00Z', language: 'TypeScript', description: 'An old library', url: 'https://github.com/test/old-lib', activity: 'stale' },
  { name: 'mid-project', stars: 12, forks: 3, issues: 8, fork: false, updatedAt: '2026-05-20T10:00:00Z', language: 'Go', description: 'Mid activity', url: 'https://github.com/test/mid-project', activity: 'low' },
];

// --- daysSince ---
describe('daysSince', () => {
  it('returns 0 for today', () => {
    assert.equal(daysSince('2026-06-09T10:00:00Z', NOW), 0);
  });

  it('returns correct days for past date', () => {
    assert.equal(daysSince('2026-06-07T10:00:00Z', NOW), 2);
  });

  it('returns correct days for months ago', () => {
    assert.equal(daysSince('2026-04-09T10:00:00Z', NOW), 61);
  });
});

// --- parseArgs ---
describe('parseArgs', () => {
  it('returns defaults for empty args', () => {
    const a = parseArgs([]);
    assert.equal(a.sort, 'stars');
    assert.equal(a.user, null);
    assert.equal(a.top, null);
    assert.equal(a.includeForks, false);
    assert.equal(a.json, false);
    assert.equal(a.markdown, false);
    assert.equal(a.help, false);
  });

  it('parses --user', () => {
    assert.equal(parseArgs(['--user', 'torvalds']).user, 'torvalds');
  });

  it('parses --sort with all fields', () => {
    for (const field of ['stars', 'updated', 'forks', 'issues', 'name']) {
      assert.equal(parseArgs(['--sort', field]).sort, field);
    }
  });

  it('parses --top as integer', () => {
    assert.equal(parseArgs(['--top', '5']).top, 5);
  });

  it('parses --include-forks', () => {
    assert.equal(parseArgs(['--include-forks']).includeForks, true);
  });

  it('parses --json and --markdown', () => {
    assert.equal(parseArgs(['--json']).json, true);
    assert.equal(parseArgs(['--markdown']).markdown, true);
  });

  it('parses --help and -h', () => {
    assert.equal(parseArgs(['--help']).help, true);
    assert.equal(parseArgs(['-h']).help, true);
  });

  it('parses combined args', () => {
    const a = parseArgs(['--user', 'bob', '--sort', 'forks', '--top', '3', '--json']);
    assert.equal(a.user, 'bob');
    assert.equal(a.sort, 'forks');
    assert.equal(a.top, 3);
    assert.equal(a.json, true);
  });
});

// --- formatText ---
describe('formatText', () => {
  it('shows "No repos" for empty array', () => {
    assert.equal(formatText([]), 'No repos found.');
  });

  it('includes repo names in output', () => {
    const out = formatText(sampleRepos);
    assert.ok(out.includes('my-app'));
    assert.ok(out.includes('old-lib'));
    assert.ok(out.includes('mid-project'));
  });

  it('includes totals line', () => {
    const out = formatText(sampleRepos);
    assert.ok(out.includes('Total: 3 repos'));
    assert.ok(out.includes('59 stars')); // 42+5+12
    assert.ok(out.includes('11 forks')); // 7+1+3
  });

  it('shows activity icons', () => {
    const out = formatText(sampleRepos);
    assert.ok(out.includes('● Active'));
    assert.ok(out.includes('○ Stale'));
    assert.ok(out.includes('◐ Low'));
  });
});

// --- formatJSON ---
describe('formatJSON', () => {
  it('produces valid JSON with expected fields', () => {
    const parsed = JSON.parse(formatJSON(sampleRepos));
    assert.equal(parsed.length, 3);
    assert.equal(parsed[0].name, 'my-app');
    assert.equal(parsed[0].stars, 42);
    assert.ok(parsed[0].url);
  });

  it('excludes internal fields like fork and description', () => {
    const parsed = JSON.parse(formatJSON(sampleRepos));
    assert.equal(parsed[0].fork, undefined);
    assert.equal(parsed[0].description, undefined);
  });
});

// --- formatMarkdown ---
describe('formatMarkdown', () => {
  it('has table header', () => {
    const out = formatMarkdown(sampleRepos);
    assert.ok(out.startsWith('| Repository'));
    assert.ok(out.includes('|---|'));
  });

  it('includes repo links', () => {
    const out = formatMarkdown(sampleRepos);
    assert.ok(out.includes('[my-app](https://github.com/test/my-app)'));
  });

  it('has one row per repo', () => {
    const out = formatMarkdown(sampleRepos);
    const rows = out.split('\n').filter(l => l.startsWith('| ['));
    assert.equal(rows.length, 3);
  });
});
