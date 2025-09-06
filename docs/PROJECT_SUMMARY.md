# Project Summary — Thai Learn

This document provides an internal overview of the project’s **current state, goals, and next steps**.  
It complements the `PROJECT_GUIDELINES.md` file, which defines coding and design standards.

---

## ✅ Current Status
- GitHub repo created.  
- Alphabet pages built:  
  - `AlphabetLow.jsx`  
  - `AlphabetMid.jsx`  
  - `AlphabetHigh.jsx`  
- Tiles now pull **notes + audio** from Firebase storage.  
- GitHub Copilot used for code edits; PR workflow tested.  

---

## 🧭 Learning Journey
1. Alphabet (letters + sounds)  
2. Tones (tone identification + practice)  
3. Simple words  
4. Common phrases (organized by topics: greetings, family, etc.)  

---

## 📚 Core Features
- **Guided Lessons** → structured progression through alphabet, tones, words, phrases.  
- **Review Area** → topic-based, with spaced repetition scheduling.  
- **Exercises** → quizzes, listening practice, pronunciation practice (listen & repeat).  
- **Audio Integration** → native speaker recordings stored in Firebase.  

---

## 🔧 Technical Decisions
- **Frontend**: React.js + Tailwind CSS  
- **Database**: PostgreSQL  
- **Authentication**: Firebase Authentication  
- **Hosting**: GitHub Pages (MVP), future options include Vercel/Netlify/Render.  
- **Backend**: Node.js/Express *possible later* to connect frontend and database.  

---

## 🎨 Design Principles
- Clean, minimal UI with consistent fonts and colors.  
- Lessons broken into **small, achievable steps**.  
- Review section accessible at any time.  

---

## 🤖 Development Workflow
- Use **GitHub Copilot** for in-repo code edits.  
- Use **ChatGPT** for:  
  - Planning next steps  
  - Designing prompts for Copilot  
  - Documenting decisions  
- Incremental development (update one component/feature at a time).  

---

## 🔜 Next Steps
- Expand lesson content beyond alphabet → tones.  
- Refine review system with spaced repetition logic.  
- Build UI for topic-based review.  
- Define and document design system (colors, fonts, UI guidelines).  

---
