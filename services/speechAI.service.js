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
                    'Content-Type': 'audio/wav', // Make sure the audio format is correct
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