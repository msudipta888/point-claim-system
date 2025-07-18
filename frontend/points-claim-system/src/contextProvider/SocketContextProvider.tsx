// SocketContextProvider.tsx
import React, { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { socketContext } from "./socketContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log("🔌 Mounting SocketProvider");
    const newSocket = io("http://localhost:8000");
    
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
    });


    setSocket(newSocket);

    return () => {
      console.log("🔌 Unmounting SocketProvider");
      newSocket.disconnect();
    };
  }, []);

  const values: SocketContextType = {
    socket,
    isConnected
  };

  return (
    <socketContext.Provider value={values}>
      {children}
    </socketContext.Provider>
  );
};