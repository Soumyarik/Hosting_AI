const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Webhook endpoint
app.post("/webhook", (req, res) => {
  console.log(req.body);

  res.json({
    reply: "Webhook working successfully 🚀"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});