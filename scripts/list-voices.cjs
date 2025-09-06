const textToSpeech = require("@google-cloud/text-to-speech");

async function listVoices() {
  const client = new textToSpeech.TextToSpeechClient();
  const [result] = await client.listVoices({});
  const voices = result.voices.filter(v => v.languageCodes.includes("th-TH"));
  console.log("Available Thai voices:");
  voices.forEach(v => {
    console.log(`- ${v.name} (${v.ssmlGender})`);
  });
}

listVoices();
