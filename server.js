const http = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Use the PORT environment variable provided by Render
const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins (update this in production)
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected:", socket.id);

    socket.on("carMove", (data) => {
      socket.broadcast.emit("carMove", data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected:", socket.id);
    });
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
