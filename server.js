const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// All routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Must listen on 0.0.0.0 for Railway
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Soumyajit's AI running on port ${PORT}`);
});
