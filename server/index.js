
import express from 'express';
import cors from 'cors';
import usersRoute from './api/users.js';
import usersAddRoute from './api/users-add.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware with expanded CORS options for debugging
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/users', usersRoute);
app.use('/api/users/add', usersAddRoute);

// API home route for testing
app.get('/api', (req, res) => {
  res.json({ message: 'FastLabor API is running' });
});

// Static files
app.use(express.static(path.join(__dirname, '../dist')));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
