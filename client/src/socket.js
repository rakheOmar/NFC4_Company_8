import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_BASE_URL || "http://localhost:8000", {
  transports: ["websocket"], // ensure WebSocket transport
  withCredentials: true,
});

export default socket;
