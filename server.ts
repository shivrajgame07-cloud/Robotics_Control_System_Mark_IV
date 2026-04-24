import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const PORT = 3000;

  // Mock Robot State
  let robotState = {
    connected: false,
    demoMode: true,
    position: { x: 0, y: 0, z: 0 },
    rotation: 0,
    battery: 85,
    speed: 0,
    temp: 32,
    humidity: 45,
    signal: 92,
    lastCommand: "None",
    path: [] as { x: number, z: number }[],
  };

  // Robot Simulator Loop
  setInterval(() => {
    if (robotState.demoMode) {
      // Add subtle jitter to telemetry
      robotState.battery = Math.max(0, robotState.battery - 0.001);
      robotState.temp = 32 + Math.random() * 2;
      robotState.humidity = 45 + Math.random() * 5;
      robotState.signal = 90 + Math.random() * 10;
      
      io.emit("telemetry", robotState);
    }
  }, 1000);

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    
    socket.emit("status", { connected: robotState.connected, demoMode: robotState.demoMode });

    socket.on("command", (cmd) => {
      console.log("Received command:", cmd);
      robotState.lastCommand = cmd.type;
      
      // Simple simulation of movement if in demo mode
      if (robotState.demoMode) {
        if (cmd.type === "MOVE") {
          const { x, z } = cmd.payload;
          // Interpolate movement (very basic)
          robotState.position.x += x * 0.1;
          robotState.position.z += z * 0.1;
          robotState.speed = Math.sqrt(x*x + z*z) * 10;
        } else if (cmd.type === "STOP") {
          robotState.speed = 0;
        }
      }
      
      io.emit("robot_update", robotState);
    });

    socket.on("set_demo_mode", (enabled) => {
      robotState.demoMode = enabled;
      io.emit("status", { connected: robotState.connected, demoMode: robotState.demoMode });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`ROBO-X Server running on http://localhost:${PORT}`);
  });
}

startServer();
