import { analyzeSpeechAI } from "../services/speechAI.service.js";
import StatusCodes from "../configs/statusCodes.js";

const transcribeSpeech = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).send({ message: "No audio file uploaded." });
        }
        const audioBuffer = req.file.buffer;
        const transcription = await analyzeSpeechAI(audioBuffer);
        res.status(StatusCodes.OK).send(transcription);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "Error transcribing speech.", error });
    }
}

export { transcribeSpeech };