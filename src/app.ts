import express from 'express';
import { configDB } from './config/db';
import { router } from './routes/routes';

const app = express();

app.use(express.json());
configDB();
app.use('/api', router);

export default app;
