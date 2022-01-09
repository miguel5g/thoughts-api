import express from 'express';
import cors from 'cors';
import logger from 'morgan';

import { routes } from './routes';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

app.use(logger(isProduction ? 'combined' : 'dev'));
app.use(cors());
app.use(express.json());
app.use('/api', routes);

export { app };
