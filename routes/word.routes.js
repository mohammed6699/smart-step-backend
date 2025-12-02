import express from 'express';
import { addNewWord, deleteWord, getAllWords, getWordById, getWordsByName, updateWord } from '../controllers/words.controller.js';
import { upload } from './../configs/multer.js';

const wordRouter = express.Router();

wordRouter.post('/new-word', upload.single('imagePath'),addNewWord);
wordRouter.get('/all-words', getAllWords);
wordRouter.get('/all-words/:id', getWordById);
wordRouter.get('/all-words/name/:name', getWordsByName);
wordRouter.patch('/update-word/:id', updateWord);
wordRouter.delete('/delete-word/:id', deleteWord);

export default wordRouter;