import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = (token: string | null) => {
  // Disconnect existing socket instance, if any
  if (socket) {
    socket.disconnect();
  }

  // Create a new socket instance
  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: {
      token: token,
    },
  });

  // Optional: Add listeners for debugging
  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
};

export const getSocket = (): Socket | null => {
  if (!socket) {
    console.warn(
      "Socket has not been initialized. Call initializeSocket() first."
    );
  }
  return socket;
};
