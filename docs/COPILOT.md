# COPILOT.md — AI Operating Rules

## Authority Levels
- Level 0: Read-only. May propose diffs and PR text; no file writes.
- Level 1: May edit files within /src, /docs, and config files. Must open a PR.
- Level 2: May create branches, commit, run formatter/tests, open PRs, and update PR based on feedback.

**Default:** Level 2.

## General Rules
- Work on a feature branch, you will either be told the name of the existing branch or the name of the new branch. Do not create a new branch with explicitly being told too.
- Make small, incremental commits using Conventional Commits.
- Run: formatter, linter, unit tests before pushing. If tests fail, stop and post the log in the PR.
- If acceptance criteria aren’t met, continue iterating in the same branch; do not ask for permission again.
- If something is ambiguous, select the safest reasonable default and explain it in the PR description.

## Deliverables
- Changeset (commits + diffs)
- PR with: problem, approach, key changes, risks, test evidence (logs/screens), and next steps.
- Update relevant docs if behavior or interfaces change.

## Don’t
- Don’t create new services or secrets.
- Don’t touch infra/CI outside documented files.
- Don’t reformat the whole repo.

- ## DoD (AI)
A task is “done” when:
1) Acceptance criteria met.
2) Code builds; format, lint, unit tests pass.
3) PR opened using template with evidence.
4) Docs updated.
5) No repo-wide reformatting; changes are scoped.

