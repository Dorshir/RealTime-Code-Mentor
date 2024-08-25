import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import { configureSocket } from './socket.js'

dotenv.config()

// Create an Express app
const app = express()

// Define the allowed origin
const allowedOrigin = 'https://realtime-code-mentor-1.onrender.com'

// const allowedOrigin = "http://localhost:5173";

// Enable CORS middleware for Express with specific origin
app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST'], // You can add more methods if needed
    credentials: true // If credentials are needed
  })
)

// Get the port number from environment variables
const PORT = process.env.PORT

// Create an HTTP server using Express app
const httpServer = createServer(app)

// Create a new instance of Socket.IO server with specific CORS settings
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigin, // Match the allowed origin
    methods: ['GET', 'POST'], // Match the methods
    credentials: true // Necessary if cookies or authentication are used
  }
})

// Configure Socket.IO server
configureSocket(io)

// Start the HTTP server and listen on the specified port
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
