require('dotenv').config();
const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_department', (deptId) => {
    socket.join(deptId);
    console.log(`User ${socket.id} joined department ${deptId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Attach io to request object
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
