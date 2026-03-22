const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

// Minimal HTTP response (prevents 502 on Render)
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Use WebSocket to request files from /resources");
});

const wss = new WebSocket.Server({ server });

// Absolute path to resources folder
const resourcesDir = path.join(__dirname, "resources");

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    const text = msg.toString();
    console.log("Request:", text);

    if (text.startsWith("GET ")) {
      const fileName = text.slice(4).trim();

      // Normalize to prevent weird paths
      const safePath = path.normalize(fileName).replace(/^(\.\.(\/|\\|$))+/, "");

      // Force everything inside /resources
      const filePath = path.join(resourcesDir, safePath);

      // Extra safety check (never allow escape)
      if (!filePath.startsWith(resourcesDir)) {
        ws.send(JSON.stringify({
          type: "error",
          message: "Access denied"
        }));
        return;
      }

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

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
