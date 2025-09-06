# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]
### Added
- Initial project setup planned.
- Documentation drafts prepared (`README.md`, `PROJECT_GUIDELINES.md`, `CHANGELOG.md`).

### Changed
- `AdminGate.jsx`: Removed non-production test scaffolding (Test DB + Test Storage buttons, `withTimeout` helper, unused Firebase imports) while retaining admin auth flow. (PR #2)
- `firebase.js`: Removed debug `console.log` statements related to storage bucket initialization. (PR #2)

### Removed
- Legacy test component `frontend/src/components/LetterEditorModal_old.jsx` (obsolete Firebase test editor). (PR #2)

### Fixed
- N/A

---

## [0.1.0] - 2025-08-31
### Added
- Project created: *Thai Learn*.
- Agreed on tech stack:
  - React.js (Frontend)
  - Tailwind CSS (Styling)
  - PostgreSQL (Database)
  - Firebase Authentication (Auth)
  - GitHub (Version control & hosting)
  - Node.js + Express (optional backend layer)
- Defined core features:
  - Guided lessons (alphabet → tones → vocab → phrases).
  - Review system (topic-based + spaced repetition).
  - Exercises (quizzes, listening, pronunciation w/ native audio).
  - Progress tracking (lessons, reviews, streaks).
- Defined UI/UX design system (colors, fonts, layout).
- Established workflow:
  - Agile-inspired with backlog in GitHub Issues.
  - Semantic versioning.
  - Document decisions in `CHANGELOG.md`.

---

## [0.0.1] - 2025-08-31
### Added
- Repository initialized with basic project planning.
