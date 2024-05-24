const http = require('http');
const next = require('next');
const { parse } = require('url');
const { setupWebSocket } = require('./src/app/utils/websocket'); // Assuming websocketUtil.js contains your WebSocket setup

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = http.createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    // Setup WebSocket using the utility function
    setupWebSocket(server);

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`> Ready on http://localhost:${PORT}`);
    });
});
