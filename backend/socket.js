const configureSocket = (io) => {
  // Initialize an object to store information about code block sessions
  const codeBlockSessions = {};

  // Listen for connection events
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle joining a code block session
    socket.on("join_code_block", (codeBlockId) => {
      if (!codeBlockSessions[codeBlockId]) {
        // If the code block session doesn't exist, create a new session
        codeBlockSessions[codeBlockId] = {
          mentor: socket.id, // Set the mentor's socket ID
          students: new Set(), // Initialize an empty set for students
          code: "", // Initialize the code with an empty string
          connectedClients: new Set([socket.id]), // Initialize set with the current socket ID
        };
        // Emit role assigned as mentor and send initial code to the mentor
        socket.emit("role_assigned", "mentor");
        socket.emit("initial_code", codeBlockSessions[codeBlockId].code);
      } else {
        // If the code block session exists, add the client as a student
        const session = codeBlockSessions[codeBlockId];
        if (!session.connectedClients.has(socket.id)) {
          // Check if the client has already joined
          session.students.add(socket.id);
          session.connectedClients.add(socket.id);

          // Emit role assigned as student and send initial code to the student
          socket.emit("role_assigned", "student");
          socket.emit("initial_code", session.code);
        }
      }
      // Join the socket to the code block room
      socket.join(codeBlockId);
    });

    // Handle code update events
    socket.on("code_update", (data) => {
      const { codeBlockId, newCode } = data;
      const session = codeBlockSessions[codeBlockId];
      if (session) {
        // Update the code for the corresponding code block session
        session.code = newCode;
        // Broadcast the new code to all clients in the session
        io.to(codeBlockId).emit("code_update", newCode);
      }
    });

    // Handle disconnect events
    socket.on("disconnect", () => {
      console.log("A user disconnected");
      // Clean up the codeBlockSessions when users disconnect
      Object.keys(codeBlockSessions).forEach((codeBlockId) => {
        const session = codeBlockSessions[codeBlockId];
        if (session.mentor === socket.id) {
          // If the disconnected user is the mentor, delete the entire sessio
          delete codeBlockSessions[codeBlockId];
        } else {
          // If the disconnected user is a student, remove them from the session
          session.students.delete(socket.id);
          session.connectedClients.delete(socket.id);
        }
      });
    });
  });
};

export { configureSocket };
