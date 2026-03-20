require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { clerkMiddleware } = require('@clerk/express');
const institucijeRouter = require('./routes/institucije');
const projektiRouter = require('./routes/projekti');
const checklistRouter = require('./routes/checklist');
const aiRouter = require('./routes/ai');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use('/api/institucije', institucijeRouter);
app.use('/api/projekti', projektiRouter);
app.use('/api/checklist', checklistRouter);
app.use('/api/ai', aiRouter);

// MongoDB konekcija
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB povezan'))
  .catch((err) => console.error('Greška pri povezivanju na MongoDB:', err));

// Test ruta
app.get('/', (req, res) => {
  res.json({ message: 'Server radi!' });
});

app.listen(PORT, () => {
  console.log(`Server sluša na portu ${PORT}`);
});
