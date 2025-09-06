import textToSpeech from '@google-cloud/text-to-speech'

const client = new textToSpeech.TextToSpeechClient()

// Cache voices so we only hit the API once per process (can add expiry later if needed)
let cachedVoices = null

export async function listVoices () {
  if (cachedVoices) return cachedVoices
  const [result] = await client.listVoices({ languageCode: 'th-TH' })
  cachedVoices = (result.voices || [])
    .filter(v => (v.languageCodes || []).includes('th-TH'))
    .map(v => ({
      name: v.name,
      languageCodes: v.languageCodes,
      ssmlGender: v.ssmlGender,
      naturalSampleRateHertz: v.naturalSampleRateHertz
    }))
  return cachedVoices
}

export async function synthesize ({
  text,
  voiceName,
  speakingRate = 1.0,
  pitch = 0,
  audioEncoding = 'MP3'
}) {
  if (!text || !text.trim()) {
    throw new Error('Text is required for synthesis')
  }

  const voices = await listVoices()
  let selectedVoice = voices.find(v => v.name === voiceName)

  if (!selectedVoice) {
    // Prefer a Standard voice if provided, else first available
    selectedVoice = voices.find(v => /Standard/i.test(v.name)) || voices[0]
  }

  if (!selectedVoice) {
    throw new Error('No Thai voices (th-TH) available from Google TTS')
  }

  const request = {
    input: { text },
    voice: {
      languageCode: 'th-TH',
      name: selectedVoice.name
    },
    audioConfig: {
      audioEncoding,
      speakingRate,
      pitch
    }
  }

  const [response] = await client.synthesizeSpeech(request)
  return {
    audioContent: response.audioContent?.toString('base64'),
    voice: selectedVoice
  }
}