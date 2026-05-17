const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(__dirname));

const WEBHOOK_URL = 'https://n8n-production-a9be2.up.railway.app/webhook/bde39fec-3dc5-48bd-95d3-9b7402ae703b';

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

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

    const contentType = response.headers.get('content-type');

    if (contentType && contentType.startsWith('image/')) {
      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');

      return res.json({
        reply: 'Here is your generated image 😊',
        image: `data:${contentType};base64,${base64}`
      });
    }

    const data = await response.json();

    res.json({
      reply: data.output || data.response || data.message || 'Done!'
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      reply: 'Server error occurred.'
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
