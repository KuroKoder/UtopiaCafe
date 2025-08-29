const WebSocket = require("ws");

let wss;
let initialized = false;
let isEsp32Connected = false;

module.exports = {
  init: (server) => {
    return new Promise((resolve) => {
      wss = new WebSocket.Server({ server });
      wss.on("connection", (ws) => {
        console.log("ESP32 connected");
        isEsp32Connected = true;

        sendRequestToESP32(ws);

        ws.on("message", (message) => {
          console.log(`Received message from ESP32: ${message}`);
          if (message === "connected") {
            isEsp32Connected = true;
          } else if (message === "pong") {
            console.log("Pong received from ESP32");
            ws.pongReceived = true; // Simpan status "pong" diterima
          } else {
            // Siarkan pesan yang diterima dari ESP32 ke semua client yang terhubung
            broadcast(message, ws);
          }
        });

        ws.on("close", () => {
          console.log("ESP32 disconnected");
          isEsp32Connected = false;
        });
      });

      wss.on("listening", () => {
        initialized = true;
        resolve();
      });
    });
  },
  getWss: () => {
    return wss;
  },
  isEsp32Connected: () => {
    return isEsp32Connected;
  },
  checkEsp32Connection: (timeoutDelay = 5000) => {
    return new Promise((resolve) => {
      const ws = Array.from(wss.clients).find(
        (client) => client.readyState === WebSocket.OPEN
      );
      if (!ws) {
        console.log("Tidak ada client WebSocket yang terbuka.");
        return resolve(false);
      }

      // Send ping message to ESP32
      ws.send("ping", (err) => {
        if (err) {
          console.error("Error sending ping:", err);
          return resolve(false);
        }
      });

      // Wait for pong response
      const timeout = setTimeout(() => {
        console.log("Timeout: No pong received from ESP32");
        resolve(false);
      }, timeoutDelay);

      const handleMessage = (message) => {
        console.log("Received message in handleMessage:", message);
        if (message.toString() === "pong") {
          console.log("Pong received and resolving true");
          clearTimeout(timeout);
          ws.removeListener("message", handleMessage); // Remove listener to prevent duplicates
          resolve(true);
        }
      };

      ws.on("message", handleMessage);
    });
  },
};

function broadcast(message, senderWs) {
  wss.clients.forEach((client) => {
    if (client !== senderWs && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function sendRequestToESP32(ws) {
  const message = "Komunikasi Terhubung!";
  ws.send(message);
  console.log("Sent message to ESP32:", message);
}
