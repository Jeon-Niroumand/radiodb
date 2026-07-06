import 'dotenv/config';

console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);
console.log(process.env.DATABASE_URL);

import express from 'express';
import cors from 'cors';

import radiosRouter from './routes/radios.js';
import sitesRouter from './routes/sites.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/radios', radiosRouter);
app.use('/sites', sitesRouter);

const PORT = process.env.SERVER_PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});