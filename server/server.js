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
    const { roomCode, question, questionId } = data;

    io.to(roomCode).emit('receive_question', {
      question,
      questionId,
    });

    console.log(`Question sent to room ${roomCode}:`, question, questionId);
  });

  // Event for a student sending an answer
  socket.on('send_answer', (data) => {
    const { roomCode, answer, studentName, questionId } = data;

    io.to(roomCode).emit('receive_answer', {
      answer,
      studentName,
      questionId
    });

    console.log(`Answer from ${studentName} (QID ${questionId}) in room ${roomCode}:`, answer);
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
