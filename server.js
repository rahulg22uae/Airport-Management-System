// Endpoint for Field Staff to submit data updates
app.post('/api/update-metric', (req, res) => {
    const { metric, value } = req.body;
    
    // Package the update to send via WebSockets
    const updatePayload = {};
    updatePayload[metric] = value;

    // Broadcast ONLY the updated field to all open dashboards instantly
    io.emit('airport_telemetry_update', updatePayload);
    
    res.sendStatus(200);
});

// Serve the Input Page link explicitly
app.get('/input', (req, res) => {
    res.sendFile(path.join(__dirname, 'input.html'));
});