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

// --- Routes Declaration ---
app.use("/api/v1/users", userRouter);
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/agora", agoraRouter);
app.use("/api/v1/chat", chatRoutes);

io.on("connection", (socket) => {
  console.log(`Socket.IO client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Socket.IO client disconnected: ${socket.id}`);
  });
});

export { httpServer };
