import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { configureSocket } from "./socket.js"
dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  // cors: {
  //   origin: CLIENT_ORIGIN,
  //   methods: ["GET", "POST"],
  // },
});

configureSocket(io);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});