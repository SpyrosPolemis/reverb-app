// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Listen for new connections
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Event for a user (teacher or student) to join a room
  socket.on('join_room', (roomCode) => {
    socket.join(roomCode);
    console.log(`User ${socket.id} joined room: ${roomCode}`);
  });

  // Event for the teacher sending a question
  socket.on('send_question', (data) => {
    const { roomCode, question } = data;
    // Broadcast the question to everyone else in the room (i.e., the students)
    socket.to(roomCode).emit('receive_question', question);
    console.log(`Question sent to room ${roomCode}: ${question}`);
  });

  // Event for a student sending an answer
  socket.on('send_answer', (data) => {
    const { roomCode, answer } = data;
    // Send the answer to everyone else in the room (i.e., the teacher)
    const answerData = {
      answer: answer,
      studentId: socket.id, // Identify which student sent the answer
    };
    socket.to(roomCode).emit('receive_answer', answerData);
    console.log(`Answer received from ${socket.id} in room ${roomCode}: ${answer}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Real-time server listening on *:${PORT}`);
});