// server/index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http'); // Import Node's built-in 'http' module
const { Server } = require('socket.io'); // Import the 'Server' class from socket.io

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Create an HTTP server from your Express app
const server = http.createServer(app);

// Create a new Socket.IO server and attach it to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow your React client to connect
    methods: ["GET", "POST"]
  }
});

// --- REST API for Rooms ---
// This is your normal HTTP endpoint to create a room
app.post('/api/create-room', (req, res) => {
  // Logic to generate a 4-letter code
  // TODO: Use a library or function to generate a unique code (e.g., 'ABCD')
  const roomCode = "ABCD"; // Placeholder
  // TODO: Save this room to your MongoDB database
  res.json({ roomCode: roomCode });
});

// HTTP endpoint to check if a room exists before joining
app.get('/api/check-room/:code', (req, res) => {
  const { code } = req.params;
  // TODO: Look in your MongoDB to see if a room with this code exists
  const roomExists = true; // Placeholder

  if (roomExists) {
    res.json({ success: true, roomCode: code });
  } else {
    res.status(404).json({ success: false, message: "Room not found" });
  }
});


// --- Socket.IO Real-time Logic ---
// This runs every time a new client connects
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Event for a user to join a specific room
  socket.on('join_room', (roomCode) => {
    socket.join(roomCode);
    console.log(`User ${socket.id} joined room ${roomCode}`);
  });

  // Event for when a user posts a question
  socket.on('post_question', (data) => {
    const { roomCode, questionText } = data;
    // TODO: Save the new question to your MongoDB database

    // Create the question object
    const newQuestion = {
      id: new Date().getTime(), // Use MongoDB's _id in a real app
      text: questionText,
      votes: 0
    };

    // Send this new question to EVERYONE in that specific room
    io.to(roomCode).emit('new_question_received', newQuestion);
  });

  // Event for when a user votes on a question
  socket.on('vote_question', (data) => {
    const { roomCode, questionId } = data;
    // TODO: Find the question in MongoDB and increment its vote count

    // Broadcast the update to EVERYONE in that room
    io.to(roomCode).emit('question_voted', { id: questionId /*, newVoteCount */ });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// IMPORTANT: Use server.listen, not app.listen
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});