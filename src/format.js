import { daysSince } from './api.js';

export function formatText(repos) {
  if (repos.length === 0) return 'No repos found.';

  const nameW = Math.max(6, ...repos.map(r => r.name.length));
  const descW = Math.max(11, ...repos.map(r => Math.min((r.description || '').length, 40)));
  const hdr = `${'Repository'.padEnd(nameW)}  Stars  Forks  Issues  Updated       Activity`;
  const sep = '─'.repeat(hdr.length + 10);
  const lines = [hdr, sep];

  for (const r of repos) {
    const icon = r.activity === 'active' ? '●' : r.activity === 'low' ? '◐' : '○';
    const label = r.activity === 'active' ? 'Active' : r.activity === 'low' ? 'Low' : 'Stale';
    const days = daysSince(r.updatedAt);
    const ago = days === 0 ? 'today' : days === 1 ? '1 day' : `${days} days`;
    lines.push(
      `${r.name.padEnd(nameW)}  ${String(r.stars).padStart(5)}  ${String(r.forks).padStart(5)}  ${String(r.issues).padStart(6)}  ${ago.padEnd(12)}  ${icon} ${label}`
    );
  }

  lines.push('');
  lines.push(`Total: ${repos.length} repos, ${repos.reduce((s, r) => s + r.stars, 0)} stars, ${repos.reduce((s, r) => s + r.forks, 0)} forks`);

  return lines.join('\n');
}

export function formatJSON(repos) {
  return JSON.stringify(repos.map(r => ({
    name: r.name,
    stars: r.stars,
    forks: r.forks,
    issues: r.issues,
    language: r.language,
    activity: r.activity,
    updatedAt: r.updatedAt,
    url: r.url
  })), null, 2);
}

export function formatMarkdown(repos) {
  const lines = [
    '| Repository | Stars | Forks | Issues | Updated | Activity |',
    '|---|---|---|---|---|---|'
  ];
  for (const r of repos) {
    const icon = r.activity === 'active' ? '●' : r.activity === 'low' ? '◐' : '○';
    const label = r.activity === 'active' ? 'Active' : r.activity === 'low' ? 'Low' : 'Stale';
    const days = daysSince(r.updatedAt);
    const ago = days === 0 ? 'today' : days === 1 ? '1 day' : `${days} days`;
    lines.push(`| [${r.name}](${r.url}) | ${r.stars} | ${r.forks} | ${r.issues} | ${ago} | ${icon} ${label} |`);
  }
  return lines.join('\n');
}
