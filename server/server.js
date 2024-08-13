const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('./Actions');

// Create HTTP server and bind Socket.io to it
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow requests from any origin (for testing purposes)
        methods: ["GET", "POST"]
    }
});

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'build')));

// Send 'index.html' for any other requests (React Router fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Map to store usernames associated with socket IDs
const userSocketMap = {};

// Helper function to get all connected clients in a room
function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

// Socket.io connection event
io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);

    // Join room event
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    // Code change event
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    // Sync code event
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    // Disconnecting event
    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
    });

    // Disconnection event
    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id);
    });
});

// Set the port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
