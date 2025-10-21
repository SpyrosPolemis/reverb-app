import { io } from "socket.io-client";

const URL = "http://localhost:5001"; // Adjust if your server runs elsewhere
export const socket = io(URL);