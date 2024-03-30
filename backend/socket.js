// socket.js
const configureSocket = (io) => {
  const codeBlockSessions = {};

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("join_code_block", (codeBlockId) => {
      if (!codeBlockSessions[codeBlockId]) {
        codeBlockSessions[codeBlockId] = {
          mentor: socket.id,
          students: new Set(),
          code: "", // Initialize the code with an empty string
          connectedClients: new Set([socket.id]), // Store connected clients
        };
        socket.emit("role_assigned", "mentor");
        socket.emit("initial_code", codeBlockSessions[codeBlockId].code);
      } else {
        const session = codeBlockSessions[codeBlockId];
        if (!session.connectedClients.has(socket.id)) {
          // Check if the client has already joined
          session.students.add(socket.id);
          session.connectedClients.add(socket.id);
          socket.emit("role_assigned", "student");
          socket.emit("initial_code", session.code);
        }
      }

      socket.join(codeBlockId);
    });

    socket.on("code_update", (data) => {
      const { codeBlockId, newCode } = data;
      const session = codeBlockSessions[codeBlockId];
      if (session) {
        session.code = newCode;
        io.to(codeBlockId).emit("code_update", newCode);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
      // Clean up the codeBlockSessions when users disconnect
      Object.keys(codeBlockSessions).forEach((codeBlockId) => {
        const session = codeBlockSessions[codeBlockId];
        if (session.mentor === socket.id) {
          delete codeBlockSessions[codeBlockId];
        } else {
          session.students.delete(socket.id);
          session.connectedClients.delete(socket.id);
        }
      });
    });
  });
};

export { configureSocket };
