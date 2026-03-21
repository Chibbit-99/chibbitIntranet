const http = require("http");
const WebSocket = require("ws");

const server = http.createServer();

const wss = new WebSocket.Server({ server });

function sendMessage(message, ws){
  ws.send(message);
  console.log("Sent:", message);
}

wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    const text = msg.toString();
    console.log("Received:", text);

    if (text === "ping") {
      sendMessage("pong",ws);
    } else {
      sendMessage("unknown",ws);
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
