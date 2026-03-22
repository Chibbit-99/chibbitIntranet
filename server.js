const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

// Minimal HTTP response (so Render doesn't 502)
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Use WebSocket to request files");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    const text = msg.toString();
    console.log("Request:", text);

    // Expect: GET filename
    if (text.startsWith("GET ")) {
      const fileName = text.slice(4).trim();

      const filePath = path.join(__dirname, "public", fileName);

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          ws.send(JSON.stringify({
            type: "error",
            message: "File not found"
          }));
        } else {
          ws.send(JSON.stringify({
            type: "file",
            name: fileName,
            content: data
          }));
        }
      });

    } else {
      ws.send(JSON.stringify({
        type: "error",
        message: "Invalid request"
      }));
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
