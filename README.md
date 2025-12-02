# Smart Step Backend - Speech Recognition API Setup

This document outlines the steps to set up speech recognition using either Google Cloud Speech-to-Text or Wit.ai, and provides the corresponding code snippets for the `analyzeSpeechAI` function.

---

## 1. Environment Variable Setup (`.env`)

Regardless of which service you choose, you need to set your API key in a `.env` file at the root of your project:

```
AI_API_KEY=YOUR_API_KEY_HERE
```

---

## 2. Google Cloud Speech-to-Text API (Paid Service)

### A. How to Get Your Google Cloud API Key

1.  **Create a Google Cloud Project:**
    *   Go to the [Google Cloud Console](https://console.cloud.google.com/).
    *   Create a new project if you don't have one.

2.  **Enable the Cloud Speech-to-Text API:**
    *   Ensure your project is selected.
    *   Navigate to **APIs & Services** > **Library**.
    *   Search for "Cloud Speech-to-Text API" and click **Enable**. (You may need to enable billing).

3.  **Create an API Key:**
    *   Navigate to **APIs & Services** > **Credentials**.
    *   Click **+ CREATE CREDENTIALS** and select **API key**.
    *   Copy the generated API key.

### B. `analyzeSpeechAI` Function for Google Cloud

This is the `services/speechAI.service.js` implementation for Google Cloud:

```javascript
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const analyzeSpeechAI = async (audioBuffer) => {
    try {
        const base64Audio = audioBuffer.toString("base64");
        const response = await axios.post(
            `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.AI_API_KEY}`,
            {
                config: {
                    encoding: "LINEAR16", // Ensure your audio is LINEAR16 encoded
                    sampleRateHertz: 16000, // Ensure your audio matches this sample rate
                    languageCode: "en-US",
                },
                audio: {
                    content: base64Audio,
                },
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Speech Analysis Error:", error.response?.data || error.message);
        throw error;
    }
}

export { analyzeSpeechAI };
```

---

## 3. Wit.ai API (Free Tier Available)

### A. How to Get Your Wit.ai Server Access Token

1.  **Log in to Wit.ai:**
    *   Go to the [Wit.ai website](https://wit.ai/) and log in with your Facebook account.

2.  **Create a New App:**
    *   Click "New App," give it a name, and select the language.

3.  **Copy Server Access Token:**
    *   Once the app is created, go to **Settings** (gear icon).
    *   Locate and copy your **Server Access Token**.

### B. `analyzeSpeechAI` Function for Wit.ai

This is the `services/speechAI.service.js` implementation for Wit.ai:

```javascript
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const analyzeSpeechAI = async (audioBuffer) => {
    try {
        const response = await axios.post(
            'https://api.wit.ai/speech',
            audioBuffer,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.AI_API_KEY}`,
                    'Content-Type': 'audio/wav', // IMPORTANT: Ensure your audio is WAV format
                },
            }
        );

        // Wit.ai can return multiple JSON objects. The final transcription is in the last one.
        const responseData = response.data;
        const lines = responseData.split('\n');
        const lastLine = lines[lines.length - 2]; // Get the second to last line, as the last one is empty
        const parsedJson = JSON.parse(lastLine);
        
        return {
            results: [{
                alternatives: [{
                    transcript: parsedJson.text
                }]
            }]
        };

    } catch (error) {
        console.error("Speech Analysis Error:", error.response?.data || error.message);
        throw error;
    }
}

export { analyzeSpeechAI };
```