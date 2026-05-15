
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const WEBHOOK_URL =
'https://n8n-production-a9be2.up.railway.app/webhook/bde39fec-3dc5-48bd-95d3-9b7402ae703b';

app.post('/chat', async (req, res) => {

  try {

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: req.body.message
      })
    });

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        response: text
      };
    }

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      response: 'Server Error'
    });

  }

});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

