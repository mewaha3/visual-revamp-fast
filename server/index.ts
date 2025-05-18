
// server/index.ts
import express from 'express';
import cors from 'cors';
import { addRowToSheet1 } from '../sheets.mjs';  // ← note .mjs
import usersRouter from './api/users.js'; // นำเข้า router สำหรับผู้ใช้

const app = express();
app.use(cors({
  origin: '*', // อนุญาตการเข้าถึงจากทุกโดเมน
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// แสดงข้อความเมื่อเริ่มใช้งาน API
app.get('/', (req, res) => {
  res.send('FastLabor API is running');
});

// เพิ่ม endpoint สำหรับดึงข้อมูลผู้ใช้
app.use('/api/users', usersRouter);

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Sheet-backend running on http://localhost:${PORT}`));

