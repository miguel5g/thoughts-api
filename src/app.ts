import express from 'express';
import cors from 'cors';
import logger from 'morgan';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

app.use(logger(isProduction ? 'combined' : 'dev'));
app.use(cors());
app.use(express.json());

export { app };
