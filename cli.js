#!/usr/bin/env node
import { parseArgs } from './src/args.js';
import { fetchRepos, ghAvailable } from './src/api.js';
import { formatText, formatJSON, formatMarkdown } from './src/format.js';

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(`gh-stats — See your GitHub repos at a glance

Usage: gh-stats [options]

Options:
  --user <name>       Target GitHub user (default: authenticated user)
  --sort <field>      Sort by: stars, updated, forks, issues, name (default: stars)
  --top <n>           Show top N repos only
  --include-forks     Include forked repos
  --json              Output as JSON
  --markdown          Output as markdown table
  --help              Show this help
`);
    process.exit(0);
  }

  if (!(await ghAvailable())) {
    console.error('Error: gh CLI not found or not authenticated. Run "gh auth login" first.');
    process.exit(1);
  }

  try {
    const repos = await fetchRepos({ user: args.user, includeForks: args.includeForks });

    if (!repos || repos.length === 0) {
      console.log('No repos found.');
      process.exit(1);
    }

    const sorted = sortRepos(repos, args.sort);

    const limited = args.top ? sorted.slice(0, args.top) : sorted;

    if (args.json) {
      console.log(formatJSON(limited));
    } else if (args.markdown) {
      console.log(formatMarkdown(limited));
    } else {
      console.log(formatText(limited));
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

function sortRepos(repos, field) {
  const copy = [...repos];
  switch (field) {
    case 'stars': return copy.sort((a, b) => b.stars - a.stars);
    case 'forks': return copy.sort((a, b) => b.forks - a.forks);
    case 'issues': return copy.sort((a, b) => b.issues - a.issues);
    case 'updated': return copy.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    case 'name': return copy.sort((a, b) => a.name.localeCompare(b.name));
    default: return copy;
  }
}

main();
