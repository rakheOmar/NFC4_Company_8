import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { ExpressPeerServer } from "peer";

const app = express();
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});
app.set("io", io);

const peerServer = ExpressPeerServer(httpServer, {
  debug: true,
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/peerjs", peerServer);

// --- Routes Import ---
import userRouter from "./routes/user.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import agoraRouter from "./routes/agora.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import siteRoutes from "./routes/site.routes.js";
import equipmentRoutes from "./routes/equipment.routes.js";
import sensorRoutes from "./routes/sensor.routes.js";
import loggingRouter from "./routes/logging.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import workerRoutes from "./routes/worker.routes.js";
// Import the incident router (you will need to create this file)
import incidentRoutes from "./routes/incident.routes.js";


// --- Routes Declaration ---
app.use("/api/v1/users", userRouter);
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/agora", agoraRouter);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/sites", siteRoutes);
app.use("/api/v1/equipment", equipmentRoutes);
app.use("/api/v1/sensors", sensorRoutes);
app.use("/api/v1/logs", loggingRouter);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/workers", workerRoutes);
// Correctly register the incident router
app.use("/api/v1/incidents", incidentRoutes);

io.on("connection", (socket) => {
  console.log(`Socket.IO client connected: ${socket.id}`);
  socket.on("workerCheckIn", (data) => {
    console.log("Worker checked in:", data);
    // Broadcast to all connected clients
    io.emit("workerCheckInUpdate", data);
  });
  socket.on("disconnect", () => {
    console.log(`Socket.IO client disconnected: ${socket.id}`);
  });
});

export { httpServer };
