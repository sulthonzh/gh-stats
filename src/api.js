import { execFile } from 'child_process';
import { promisify } from 'util';

const run = promisify(execFile);

export async function ghAvailable() {
  try {
    await run('gh', ['auth', 'status']);
    return true;
  } catch {
    return false;
  }
}

export async function fetchRepos({ user, includeForks = false } = {}) {
  const endpoint = user ? `users/${user}/repos` : 'user/repos';
  const args = ['api', endpoint, '--paginate', '-q',
    '.[] | {name: .name, stars: .stargazers_count, forks: .forks_count, issues: .open_issues_count, fork: .fork, updatedAt: .updated_at, language: .language, description: .description, url: .html_url}'
  ];

  const { stdout } = await run('gh', args);
  const repos = JSON.parse(`[${stdout.trim().replace(/\n/g, ',')}]`);

  // Add activity level
  const now = Date.now();
  return repos
    .filter(r => includeForks || !r.fork)
    .map(r => ({ ...r, activity: getActivity(r.updatedAt, now) }));
}

function getActivity(dateStr, now = Date.now()) {
  const updated = new Date(dateStr).getTime();
  const daysSince = (now - updated) / (1000 * 60 * 60 * 24);
  if (daysSince <= 7) return 'active';
  if (daysSince <= 30) return 'low';
  return 'stale';
}

export function daysSince(dateStr, now = Date.now()) {
  return Math.floor((now - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}
