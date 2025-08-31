#!/bin/bash
# Setup script for Thai Learn repo structure + starter docs

echo "🚀 Setting up Thai Learn repo structure..."

# === FOLDER STRUCTURE ===
# Frontend
mkdir -p frontend/public
mkdir -p frontend/src/assets
mkdir -p frontend/src/components
mkdir -p frontend/src/pages
mkdir -p frontend/src/hooks
mkdir -p frontend/src/utils

# Backend
mkdir -p backend/src/routes
mkdir -p backend/src/models
mkdir -p backend/src/controllers
mkdir -p backend/src/middleware

# Database
mkdir -p database

# Docs
mkdir -p docs

# Add .gitkeep files so Git tracks empty folders
for dir in frontend/public frontend/src/assets frontend/src/components frontend/src/pages frontend/src/hooks frontend/src/utils backend/src/routes backend/src/models backend/src/controllers backend/src/middleware database docs
do
  touch $dir/.gitkeep
done

# === DOCUMENTATION FILES ===
echo "📄 Creating README.md..."
cat > docs/README.md << 'EOF'
# Thai Learn

A website to teach **Thai and Isan** to English speakers.  
The platform provides guided lessons, practice tools, and review systems to help learners build a strong foundation in the Thai and Isan languages.

---

## 🎯 Goal
Build a structured, engaging, and effective language-learning platform starting with the **alphabet and tones**, then expanding into **vocabulary** and **phrases**.

---

## 🛠️ Tech Stack
- **Frontend**: React.js  
- **Styling**: Tailwind CSS  
- **Database**: PostgreSQL  
- **Authentication**: Firebase Authentication  
- **Hosting/Version Control**: GitHub (Pages initially; possible Vercel/Netlify/Render later)  
- **Potential Backend**: Node.js + Express (to connect React frontend with PostgreSQL if required)  

---

## 📚 Features
- **Guided Lessons**  
  - Alphabet (letters + sounds)  
  - Tones (tone identification & practice)  
  - Vocabulary (simple → extended)  
  - Common phrases (greetings, family/friends, etc.)  

- **Review System**  
  - Topic-based review (manual access)  
  - Spaced repetition (automated scheduling)  

- **Exercises**  
  - Quizzes (MCQ, matching, fill-in-the-blank)  
  - Listening practice (slow/normal speed, minimal pairs, dialogues)  
  - Pronunciation practice (listen + repeat; no voice recognition)  

- **Progress Tracking**  
  - Lesson completion  
  - Spaced repetition schedule  
  - Dashboard (progress % + streaks)  

---

## 📐 Architecture
- **Frontend**: React + Tailwind for UI components  
- **Authentication**: Firebase for login/signup  
- **Database**: PostgreSQL for lessons, users, progress, quizzes  
- **Backend (optional)**: Node.js/Express as API layer  
- **Deployment**: GitHub Pages for static MVP  

---

## 🚀 Development
- Version control: GitHub  
- Workflow: Agile-inspired (issues backlog, sprints, changelog)  
- Documentation:  
  - `README.md` (public overview)  
  - `PROJECT_GUIDELINES.md` (design system, coding standards, AI usage)  
  - `CHANGELOG.md` (track decisions & iterations)  
EOF

echo "📄 Creating PROJECT_GUIDELINES.md..."
cat > docs/PROJECT_GUIDELINES.md << 'EOF'
# Project Guidelines: Thai Learn

This document defines the **standards, rules, and processes** for building and maintaining the Thai Learn website.  
It ensures consistency when using AI tools, coding, or contributing to the project.  

---

## 1. Tech Stack (Fixed)
- **Frontend**: React.js  
- **Styling**: Tailwind CSS  
- **Database**: PostgreSQL  
- **Authentication**: Firebase Authentication  
- **Hosting/Version Control**: GitHub  
- **Backend (optional)**: Node.js + Express  

---

## 2. Design System
### Layout
- Grid-based, clean, accessible.  
- Navigation: `Lessons | Review | Progress`.  
- Content displayed in **cards** for lessons, quizzes, reviews.  

### Colors
- Primary: Deep Royal Blue `#1E40AF`  
- Secondary: Bright Red `#DC2626`  
- Accent: Golden Yellow `#FACC15`  
- Neutrals: White `#FFFFFF`, Slate Gray `#334155`  

### Typography
- Headings: Inter / Poppins  
- Body: Roboto / Noto Sans (must support Thai characters)  

### Components
- Rounded corners (`rounded-2xl` default)  
- Buttons:  
  - Primary: Blue  
  - Secondary: Gray  
  - Accent: Yellow (highlight actions)  
- Icons: Lucide or Heroicons  

---

## 3. Coding Standards
- **Language**: JavaScript (React)  
- **Styling**: Tailwind classes only (avoid inline CSS unless necessary)  
- **Naming**:  
  - Components: PascalCase (e.g., `LessonCard.js`)  
  - Files: kebab-case (e.g., `lesson-card.js`)  
  - Variables: camelCase  
- **Comments**: Use inline comments for logic; JSDoc for complex functions.  

---

## 4. AI Usage Guidelines
- Always **refer to this document** when generating new code.  
- Prompts should specify:  
  - Use **React + Tailwind**.  
  - Follow **design system** (colors, fonts, layout).  
  - Maintain **coding standards** (naming conventions, structure).  
- AI-generated code must be **reviewed and tested** before committing.  
- Commit messages should be descriptive, e.g.:
  - `Add LessonCard component (React + Tailwind, per design system)`  

---

## 5. Workflow
- **Agile-inspired** development:  
  - Backlog managed via GitHub Issues.  
  - User stories define features (e.g., “As a learner, I want to practice tones to distinguish word meanings”).  
  - Iterations in small sprints.  

- **Versioning**: Semantic Versioning (MAJOR.MINOR.PATCH).  
- **Changelog**: All changes logged in `CHANGELOG.md` with rationale.  
- **Branches**:  
  - `main` → stable production branch.  
  - `feature/*` → new features.  
  - `fix/*` → bug fixes.  

---

## 6. Decision Logging
- All major decisions documented in `CHANGELOG.md`.  
- Include **what decision was made** and **why** (e.g., “Firebase chosen over Auth0 for simplicity”).  
EOF

echo "📄 Creating CHANGELOG.md..."
cat > docs/CHANGELOG.md << 'EOF'
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
- N/A

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
EOF

echo "✅ Repo structure + docs created successfully!"
