import express from 'express';
import { configDB } from './config/db';

const app = express();

app.use(express.json());
configDB();

export default app;
