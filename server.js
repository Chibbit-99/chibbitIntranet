const http = require("http");
const WebSocket = require("ws");

const server = http.createServer((req, res) => {
  // Return a simple HTML page with instructions
  res.writeHead(200, { "Content-Type": "text/html" });

  res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>WebSocket Server</title>
  <style>
    body {
      font-family: monospace;
      background: #0f172a;
      color: #e2e8f0;
      padding: 40px;
    }
    pre {
      background: #020617;
      padding: 15px;
      border-radius: 10px;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <h1>✅ WebSocket Server is Running</h1>
  <p>Open your browser console (F12) and run:</p>

  <pre>
const ws = new WebSocket("wss://${req.headers.host}");

ws.onopen = () => {
  console.log("Connected!");
  ws.send("ping");
};

ws.onmessage = (e) => {
  console.log("Server:", e.data);
};
  </pre>

  <p>Expected output:</p>
  <pre>
Connected!
Server: pong
  </pre>
</body>
</html>
  `);
});

const wss = new WebSocket.Server({ server });

function sendMessage(message, ws) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(message);
    console.log("Sent:", message);
  }
}

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    const text = msg.toString();
    console.log("Received:", text);

    if (text === "ping") {
      sendMessage("pong", ws);
    } else {
      sendMessage("unknown", ws);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
