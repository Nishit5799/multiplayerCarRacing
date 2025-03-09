// api/socket.js
import { Server } from "socket.io";
import http from "http";

let players = [];

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Starting socket.io server...");
    const httpServer = http.createServer((req, res) => {
      res.end("Socket.io server is running.");
    });

    const io = new Server(httpServer, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("a user connected:", socket.id);

      socket.on("joinRoom", (playerName) => {
        console.log("Received joinRoom event from:", playerName);
        players.push({ id: socket.id, name: playerName, isReady: false });
        io.emit("updatePlayers", players);
      });

      socket.on("playerReady", (playerName) => {
        console.log("Received playerReady event from:", playerName);
        const player = players.find((p) => p.name === playerName);
        if (player) {
          player.isReady = true;
          io.emit("updatePlayers", players);

          if (players.every((p) => p.isReady)) {
            io.emit("startGame");
          }
        }
      });

      socket.on("carMove", (data) => {
        socket.broadcast.emit("carMove", data);
      });

      socket.on("restartGame", () => {
        players = [];
        io.emit("resetGame");
      });

      socket.on("disconnect", () => {
        console.log("a user disconnected:", socket.id);
        players = players.filter((player) => player.id !== socket.id);
        io.emit("updatePlayers", players);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
