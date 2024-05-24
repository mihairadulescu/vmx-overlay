// Using CommonJS syntax
const WebSocket = require('ws');

exports.setupWebSocket = (server) => {
    const wss = new WebSocket.Server({ noServer: true });
    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, socket => {
            wss.emit('connection', socket, request);
            console.log("WebSocket connected");
        });
    });

    wss.on('connection', (ws) => {
        console.log("WebSocket connected");
        ws.on('message', (message) => {
            // Logic for handling incoming messages
            // For example, broadcasting to all clients
            console.log("WebSocket connected");
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });
    });
};
