import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import path from 'path';
dotenv.config();
export const generate3dImageFromText = async (prompt) => {
    try {
        const response = await axios.post(
            "https://api.meshy.ai/v1/text-to-3d",
            {
                "prompt": prompt,
                "mode": "preview",
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.MESHY_API_KEY}`,
                }
            }
        );
        return response.data.result;
    } catch (error) {
        console.error("3D Generation Error:", error.message);
        throw error;
    }
}
export const get3dModel = async (taskId) => {
    try {
        const response = await axios.get(
            `https://api.meshy.ai/v1/text-to-3d/${taskId}`,
            {
                headers: {
                    "Authorization": `Bearer ${process.env.MESHY_API_KEY}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("3D Generation Error:", error.message);
        throw error;
    }
}