import express from "express";
import { upload } from "../configs/multer.js";
import { transcribeSpeech } from "../controllers/speech.controller.js";

const router = express.Router();

router.post("/transcribe", upload.single('audio'), transcribeSpeech);

export default router;