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
