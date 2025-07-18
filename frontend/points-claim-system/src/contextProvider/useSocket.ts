// useSocket.ts
import { useContext } from "react";
import { socketContext } from "./socketContext";

export const useSocket = () => {
  const socket = useContext(socketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket.socket;
};