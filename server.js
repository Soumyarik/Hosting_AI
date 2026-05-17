const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

// Serve index.html from root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Soumyajit AI Server is running' });
});

// Webhook proxy endpoint
app.post('/api/webhook', async (req, res) => {
  try {
    const { message, image, timestamp, platform } = req.body;

    console.log(`[${new Date().toISOString()}] Received request from ${platform}`);
    console.log('Message:', message);

    // Forward to n8n webhook
    const n8nWebhookUrl = 'https://n8n-production-a9be2.up.railway.app/webhook/bde39fec-3dc5-48bd-95d3-9b7402ae703b';

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        image: image || null,
        timestamp: timestamp || new Date().toISOString(),
        platform,
        source: 'soumyajit-ai-app'
      })
    });

    const data = await response.json();
    console.log('N8N Response:', JSON.stringify(data, null, 2));

    // Extract response from n8n - handle multiple formats
    let responseText = '';
    
    if (typeof data === 'string') {
      responseText = data;
    } else if (data.response) {
      responseText = data.response;
    } else if (data.message) {
      responseText = data.message;
    } else if (data.output) {
      responseText = data.output;
    } else if (data.result) {
      responseText = data.result;
    } else if (data.text) {
      responseText = data.text;
    } else if (data.body && data.body.response) {
      responseText = data.body.response;
    } else if (Array.isArray(data) && data.length > 0) {
      responseText = JSON.stringify(data[0]);
    } else {
      responseText = JSON.stringify(data);
    }

    res.json({
      success: true,
      response: responseText || 'Request processed',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process request',
      message: error.message
    });
  }
});

// Voice webhook endpoint
app.post('/api/voice', express.raw({ type: 'audio/*' }), async (req, res) => {
  try {
    const audioBuffer = req.body;
    console.log(`[${new Date().toISOString()}] Voice message received, size: ${audioBuffer.length} bytes`);

    // Forward to n8n webhook
    const n8nWebhookUrl = 'https://n8n-production-a9be2.up.railway.app/webhook/bde39fec-3dc5-48bd-95d3-9b7402ae703b';

    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('audio', audioBuffer, 'voice.wav');
    formData.append('type', 'voice');
    formData.append('timestamp', new Date().toISOString());

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log('N8N Voice Response:', JSON.stringify(data, null, 2));

    // Extract response from n8n - handle multiple formats
    let responseText = '';
    
    if (typeof data === 'string') {
      responseText = data;
    } else if (data.response) {
      responseText = data.response;
    } else if (data.message) {
      responseText = data.message;
    } else if (data.output) {
      responseText = data.output;
    } else if (data.result) {
      responseText = data.result;
    } else if (data.text) {
      responseText = data.text;
    } else if (data.body && data.body.response) {
      responseText = data.body.response;
    } else if (Array.isArray(data) && data.length > 0) {
      responseText = JSON.stringify(data[0]);
    } else {
      responseText = JSON.stringify(data);
    }

    res.json({
      success: true,
      response: responseText || 'Voice message processed',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Voice Processing Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process voice message',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Soumyajit's AI Server running on port ${PORT}`);
  console.log(`📍 Access at http://localhost:${PORT}`);
  console.log(`🔌 Webhook: n8n connected`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
