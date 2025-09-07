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
- Tiles now pull **notes + audio** from Firebase storage if they don't existing in Firebase then the files in the repo are used 
- GitHub Copilot used for code edits; PR workflow tested.
- Google Text-to-speach is used to generate audio

---

## 🧭 Learning Journey
1. Alphabet (letters + sounds)  
2. Tones (tone identification + practice)  
3. Simple words  
4. Common phrases (organized by topics: greetings, family, etc.)  

---

## 📚 Core Features
- **Guided Lessons** → structured progression through alphabet, tones, words, phrases.
- **Exercises** → quizzes, listening practice, pronunciation practice (listen & repeat).  
- **Alphabet** → Letters spit into Constants, Mid, Low and High and Vowels.
- **Words** → Lists by category, overall structure still to be determined.
-  **Phrases** → Lists by category, overall structure still to be determined. 
- **Audio Integration** → native speaker AI generated recordings stored in Firebase.  

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
