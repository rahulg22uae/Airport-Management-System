const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.post('/api/update-metric', (req, res) => {
    const { metric, value } = req.body;
    io.emit('metric-updated', { metric, value });
    res.status(200).json({ success: true, message: 'Transmitted' });
});
app.get('/dashboard', (req, res) => { res.sendFile(path.join(__dirname, 'ams_dashboard.html')); });
app.get('/input', (req, res) => { res.sendFile(path.join(__dirname, 'input.html')); });
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => { console.log('Server running'); });
