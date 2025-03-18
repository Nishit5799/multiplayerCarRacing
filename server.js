const next = require("next");
const http = require("http");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  let players = [];

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
      io.emit("restartGame"); // Broadcast to all players
    });

    socket.on("disconnect", () => {
      console.log("a user disconnected:", socket.id);
      players = players.filter((player) => player.id !== socket.id);
      io.emit("updatePlayers", players);
    });
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
