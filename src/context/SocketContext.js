// src/context/SocketContext.js
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Use the environment variable for the server URL
    const newSocket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL ||
        "https://multiplayer-car-racing.vercel.app/"
    );
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
