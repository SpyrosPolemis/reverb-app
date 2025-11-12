import { io } from 'socket.io-client';

// The URL of your backend server
const SOCKET_SERVER_URL = 'http://localhost:3001';

// Create and export the socket instance
// This ensures there is only one connection shared across your app
export const socket = io(SOCKET_SERVER_URL);