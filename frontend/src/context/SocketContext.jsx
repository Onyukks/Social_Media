import { createContext, useContext, useEffect, useState } from "react";
import { io } from 'socket.io-client';
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('https://social-media-sk8x.onrender.com');
    setSocket(newSocket);
  }, []);

  useEffect(() => {
      currentUser && socket?.emit('addUser', currentUser._id);
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
