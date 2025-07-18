// socketContext.ts
import { createContext } from "react";
import type { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

export const socketContext = createContext<SocketContextType | undefined>(undefined);