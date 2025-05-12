const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let latestState = 0;

// WebSocket
wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ pin: "v1", value: latestState }));
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Webhook do Blynk
app.post("/blynk-hook", (req, res) => {
  const { pin, value } = req.body;
  console.log(`Webhook: ${pin} = ${value}`);
  latestState = parseInt(value);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ pin, value }));
    }
  });

  res.sendStatus(200);
});

// Inicia servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Servidor no ar em http://localhost:" + PORT);
});
