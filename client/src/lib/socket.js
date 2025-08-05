import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SOCKET_URL = API_BASE_URL.replace("/api/v1", "");

export const socket = io(SOCKET_URL, {
  withCredentials: true,
});
