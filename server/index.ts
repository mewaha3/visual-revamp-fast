// server/index.ts
import express from 'express';
import cors from 'cors';
import { addRowToSheet1 } from '../sheets.mjs';  // ← note .mjs

const app = express();
app.use(cors());
app.use(express.json());

app.post('/sheets', async (req, res) => {
  try {
    const rowArray = req.body;
    const updates = await addRowToSheet1(rowArray);
    return res.status(201).json({ ok: true, updates });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(4000, () => console.log('Sheet-backend on http://localhost:4000'));
