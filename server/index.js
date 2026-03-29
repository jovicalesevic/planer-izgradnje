require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { clerkMiddleware } = require('@clerk/express');
const institucijeRouter = require('./routes/institucije');
const projektiRouter = require('./routes/projekti');
const checklistRouter = require('./routes/checklist');
const aiRouter = require('./routes/ai');
const adminRouter = require('./routes/admin');
const uploadRouter = require('./routes/upload');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: ['https://planer-izgradnje.vercel.app', 'http://localhost:5173'],
}));
app.use(express.json());
app.use(clerkMiddleware());
app.use('/api/institucije', institucijeRouter);
app.use('/api/projekti', projektiRouter);
app.use('/api/checklist', checklistRouter);
app.use('/api/ai', aiRouter);
app.use('/api/admin', adminRouter);
app.use('/api/upload', uploadRouter);

// MongoDB konekcija
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB povezan'))
  .catch((err) => console.log(err?.message ?? err, err?.stack));

// Test ruta
app.get('/', (req, res) => {
  res.json({ message: 'Server radi!' });
});

app.use((err, req, res, next) => {
  console.error(err.message, err.stack);
  res.status(500).json({ error: err.message, stack: err.stack });
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT:', err.message, err.stack);
});

app.listen(PORT, () => {
  console.log(`Server sluša na portu ${PORT}`);
});
