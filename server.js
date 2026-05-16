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

// Middleware to handle JSON data and serve static HTML files
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Route to receive live updates from input.html
app.post('/api/update-metric', (req, res) => {
    const { metric, value } = req.body;
    console.log(`Received update: ${metric} -> ${value}`);
    
    // Broadcast the update instantly to ams_dashboard.html
    io.emit('metric-updated', { metric, value });
    
    res.status(200).json({ success: true, message: 'Metric transmitted successfully' });
});

// Serve the dashboard UI
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'ams_dashboard.html'));
});

// Serve the input terminal UI
app.get('/input', (req, res) => {
    res.sendFile(path.join(__dirname, 'input.html'));
});

// Socket.io connection logging
io.on('connection', (socket) => {
    console.log('A device connected to the Airport System Network');
    socket.on('disconnect', () => {
        console.log('A device disconnected');
    });
});

// Listen on the port Render gives us, or default to 3000 locally
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Airport Server running globally on port ${PORT}`);
});