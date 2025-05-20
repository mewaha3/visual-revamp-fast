
import express from 'express';
import { addRowToSheet1 } from '../sheets.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userData } = req.body;
    
    if (!userData || !Array.isArray(userData)) {
      return res.status(400).json({ error: 'Invalid user data' });
    }

    // Add the row to the sheet
    const result = await addRowToSheet1(userData);
    
    return res.status(201).json({ success: true, updates: result });
  } catch (error) {
    console.error('API ERROR: Error adding user to sheet:', error);
    return res.status(500).json({ error: 'Failed to add user to sheet', message: error.message });
  }
});

export default router;
