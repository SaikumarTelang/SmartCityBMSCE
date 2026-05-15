const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { startWorker } = require('./services/aiService');
const { db, demoMode } = require('./config/firebase');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const reportRoutes = require('./routes/reports');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const detectionRoutes = require('./routes/detection');

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    firebase: !demoMode && !!db,
    demoMode,
    models: ['Garbage', 'Pothole', 'Broken Wire'],
    note: demoMode
      ? 'Reports use Firebase from React client'
      : 'Reports use Firebase Admin on server',
  });
});

app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/detection', detectionRoutes);

const PORT = process.env.PORT || 5000;

startWorker();

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Firebase Admin: ${demoMode ? 'off (client Firestore used)' : 'connected'}`);
  console.log('AI models loading in background...');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} is already in use.`);
    console.error('Run:  Get-NetTCPConnection -LocalPort 5000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }');
    console.error('Or close the other terminal running the backend.\n');
    process.exit(1);
  }
  throw err;
});
