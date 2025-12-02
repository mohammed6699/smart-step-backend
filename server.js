import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import databaseConnection from './configs/db.js';
import categoryRouter from './routes/category.routes.js';
import wordRouter from './routes/word.routes.js';
import speechRouter from './routes/speech.routes.js';
const app = express();
const port = 4000;
app.use(cors());
app.get('/', (req, res) => {
    res.send('Server is running');
})
app.use(express.json());
app.use('/api/v1', userRouter);
app.use('/api/v1', categoryRouter);
app.use('/api/v1', wordRouter);
app.use('/api/v1/speech', speechRouter);
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})
databaseConnection();
export default app