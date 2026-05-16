const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/update-metric', (req, res) => {
    const { metric, value } = req.body;
    console.log('Received:', metric, value);
    io.emit('metric-updated', { metric, value });
    res.status(200).json({ success: true });
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'ams_dashboard.html'));
});

app.get('/input', (req, res) => {
    res.sendFile(path.join(__dirname, 'input.html'));
});

io.on('connection', (socket) => {
    console.log('A client connected to dashboard websocket');
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log('Airport Server running with stable connections');
});