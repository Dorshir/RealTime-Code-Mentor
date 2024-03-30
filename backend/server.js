import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { configureSocket } from "./socket.js";

dotenv.config();

// Create an Express app
const app = express();

// Enable CORS middleware
app.use(cors());

// Get the port number from environment variables
const PORT = process.env.PORT;

// Create an HTTP server using Express app
const httpServer = createServer(app);

// Create a new instance of Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow connections from any origin
    methods: ["GET", "POST"], // Allow GET and POST methods
  },
});

// Configure Socket.IO server
configureSocket(io);

// Start the HTTP server and listen on the specified port
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
