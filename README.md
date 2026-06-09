# gh-stats

See your GitHub repos at a glance — stars, forks, issues, last activity.

Uses `gh` CLI under the hood, so no API tokens needed. Zero dependencies.

## Why

GitHub's repo list is fine for finding things, but terrible for getting a picture of your portfolio. `gh-stats` shows you which repos are active, which are gathering dust, and which ones people actually use — all in one view.

## Quick start

```bash
# Install gh CLI first, then:
npx gh-stats

# Or install globally
npm i -g gh-stats
gh-stats
```

## What you get

```
Repository              Stars  Forks  Issues  Updated    Activity
─────────────────────────────────────────────────────────────────
Telyx                     12      3       2   2 days     ● Active
git-recap                  8      1       0   1 week     ● Active
codechurn                  5      0       1   3 weeks    ◐ Low
envguard                   3      2       0   2 months   ○ Stale
old-project                1      0       5   8 months   ○ Stale
```

## Usage

```bash
gh-stats                    # your public repos
gh-stats --user torvalds    # someone else's repos
gh-stats --json             # machine-readable output
gh-stats --markdown         # markdown table
gh-stats --sort stars       # sort by stars (default)
gh-stats --sort updated     # sort by last updated
gh-stats --sort forks       # sort by forks
gh-stats --sort issues      # sort by open issues
gh-stats --top 10           # show top 10 only
gh-stats --include-forks    # include forked repos
```

## Activity levels

- **● Active** — pushed in the last 7 days
- **◐ Low** — pushed in the last 30 days
- **○ Stale** — no activity in 30+ days

## Exit codes

- `0` — success
- `1` — no repos found or error

## Programmatic API

```js
import { fetchRepos, formatText, formatJSON, formatMarkdown } from 'gh-stats';

const repos = await fetchRepos({ user: 'sulthonzh' });
console.log(formatText(repos));
```

## License

MIT
