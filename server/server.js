const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Store student questions per room
let roomQuestions = {}; // { roomCode: [ {id, text, upvotes, studentName} ] }

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_room', (roomCode) => {
    socket.join(roomCode);
    console.log(`User ${socket.id} joined ${roomCode}`);
  });

  // Teacher sends quiz question
  socket.on('send_question', ({ roomCode, question, questionId }) => {
    socket.to(roomCode).emit('receive_question', { question, questionId });
  });

  // Student sends quiz answer
  socket.on('send_answer', (data) => {
    socket.to(data.roomCode).emit('receive_answer', data);
  });

  // Student submits a question
  socket.on("student_submit_question", ({ roomCode, text, studentName }) => {
    if (!roomQuestions[roomCode]) roomQuestions[roomCode] = [];

    const newQ = {
      id: Date.now(),
      text,
      studentName,
      upvotes: 0
    };

    roomQuestions[roomCode].push(newQ);

    io.to(roomCode).emit("update_student_questions", roomQuestions[roomCode]);
  });

  // Student upvotes question
  socket.on("student_upvote_question", ({ roomCode, questionId }) => {
    const questions = roomQuestions[roomCode];
    if (!questions) return;

    const q = questions.find(q => q.id === questionId);
    if (q) q.upvotes++;

    // Sort by upvotes
    questions.sort((a, b) => b.upvotes - a.upvotes);

    io.to(roomCode).emit("update_student_questions", questions);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
