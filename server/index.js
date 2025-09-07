import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { listVoices, synthesize } from './tts.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/voices', async (_req, res) => {
  try {
    const voices = await listVoices()
    res.json({ voices })
  } catch (err) {
    console.error('Error listing voices', err)
    res.status(500).json({ error: 'Failed to list voices' })
  }
})

app.post('/api/synth', async (req, res) => {
  try {
    const { text, voiceName, speakingRate, pitch } = req.body || {}
    const result = await synthesize({ text, voiceName, speakingRate, pitch })
    res.json(result)
  } catch (err) {
    console.error('Error synthesizing speech', err)
    res.status(400).json({ error: err.message || 'Synthesis failed' })
  }
})

const PORT = process.env.PORT || 8787
app.listen(PORT, () => {
  console.log(`TTS server listening on http://localhost:${PORT}`)
})
