// src/context/SocketContext.js
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Use the NEXT_PUBLIC_SOCKET_SERVER_URL environment variable or fall back to localhost
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:3000";
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};