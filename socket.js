const { Server } = require("socket.io");

let io;

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // Allow all origins (update for production)
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔥 A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("⚡ A user disconnected:", socket.id);
    });
  });
};

const notifyNewPost = (post) => {
  if (io) {
    io.emit("newPost", post); // Send event to all clients
  }
};

module.exports = { initializeSocket, notifyNewPost };
