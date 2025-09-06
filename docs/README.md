# Thai Learn

A website to teach **Thai** to English speakers. Future versions may include **Isan**.  
The platform provides guided lessons, practice tools, and a review system to help learners build a strong foundation in the Thai language.

---

## 🎯 Goal
Build a structured, engaging, and effective language-learning platform starting with the **alphabet and tones**, then expanding into **vocabulary** and **phrases**.

---

## 🛠️ Tech Stack
- **Frontend**: React.js  
- **Styling**: Tailwind CSS  
- **Database**: PostgreSQL  
- **Authentication**: Firebase Authentication  
- **Hosting/Version Control**: GitHub (Pages initially; may expand to Vercel/Netlify/Render)  
- **Backend (future option)**: Node.js + Express (to connect React frontend with PostgreSQL)  

---

## 📚 Features
### Current Scope
- Alphabet lessons (letters + sounds)  
- Tone identification & practice  
- Review system with topic organization  
- Listening practice (native audio playback; no voice recognition yet)  

### Planned
- Vocabulary (simple → extended)  
- Common phrases (greetings, family, friends, etc.)  
- Quizzes (MCQ, matching, fill-in-the-blank)  
- Progress tracking (completion, spaced repetition scheduling, streaks dashboard)  

---

## 📐 Architecture
- **Frontend**: React + Tailwind for UI components  
- **Authentication**: Firebase for login/signup  
- **Database**: PostgreSQL for lessons, users, and progress  
- **Deployment**: GitHub Pages for MVP  

---

## 🚀 Development
- Version control: GitHub  
- Workflow: Agile-inspired (issues backlog, small iterations, changelog)  
- Documentation:  
  - `README.md` → Public overview  
  - `PROJECT_SUMMARY.md` → Current status & internal notes  
  - `CHANGELOG.md` → Track key decisions & iterations  

## 🔊 Local Text-to-Speech API (Google Cloud)

A lightweight Express server (in `/server`) exposes Thai-only (th-TH) Google Cloud Text-to-Speech endpoints to the frontend via a development proxy (`/api/*`).

### Why a Local API?
Browser clients cannot securely hold Google Cloud credentials. A tiny Node layer:
- Protects credentials (service account key lives outside the committed tree)
- Normalizes voice selection (filters to `th-TH`)
- Provides a stable contract for the React app

### Endpoints
```
GET  /api/health         -> { status: 'ok' }
GET  /api/voices         -> { voices: Voice[] } (Thai voices only)
POST /api/synth          -> { audioContent: base64, voice: { ... } }
```

Request body for synthesis:
```json
{
  "text": "สวัสดีครับ",
  "voiceName": "th-TH-Standard-A",
  "speakingRate": 1.0,
  "pitch": 0
}
```

### Setup Steps
1. Enable the Google Cloud Text-to-Speech API in your GCP project.
2. Create a Service Account with role: (minimum) "Cloud Text-to-Speech User".
3. Generate & download a JSON key file (store outside tracked source, e.g. `secrets/`).
4. Copy `server/.env.sample` to `server/.env` and set:
   - `GOOGLE_APPLICATION_CREDENTIALS=../secrets/google-tts-service-account.json`
   - (Optional) `GOOGLE_PROJECT_ID=your-project-id`
5. Install dependencies:
   - Root: `npm install` (if needed)
   - Server: `cd server && npm install`
6. Run the server: `npm run dev` inside `server` (or integrate with a combined script later).
7. Use `/api/voices` or `/api/synth` from the frontend.

### Development Notes
- Voices cached in-memory after first retrieval.
- If `voiceName` omitted, a Standard Thai voice (or first available) is chosen.
- Returns base64 MP3; frontend can create an `Audio` element with a data URL or Blob.
- Currently restricted to `th-TH` voices (can be expanded later).

### Example Frontend Usage
```js
async function playThai(text) {
  const res = await fetch('/api/synth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  })
  const data = await res.json()
  if (data.audioContent) {
    const audio = new Audio('data:audio/mp3;base64,' + data.audioContent)
    audio.play()
  } else {
    console.error('TTS error', data)
  }
}
```

### Security Considerations
- Do not commit the service account JSON.
- Limit permissions on the service account.
- Add auth / rate limiting before exposing publicly.

---