// SocketContext.js
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client"; // Import the socket.io client library

export const SocketContext = createContext();

const BaseURL = process.env.REACT_APP_SOCKET_URL;
export const newSocket = io(BaseURL); // Change this to your socket server URL
export const SocketProvider = ({ children }) => {
  //const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");


  useEffect(() => {
    // Initialize the socket connection when the component mounts
    setSocket(newSocket);
    // Clean up the socket connection when the component unmounts
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const matchOddDetails = async (marketId) => {
    setLoading(true);
    console.log('socket call')
    console.log(marketId)
    // Use the socket connection to emit a "resetPassword" event
    socket.emit("requestMarketId", marketId, (result) => {
      if (result.success) {
        //setIsAuthenticated(true);
        setLoginError("");
      } else {
        setLoginError(result.message);
      }
      setLoading(false);
    });
  };

  return (
    <SocketContext.Provider value={{ matchOddDetails, socket }}>
      {children}
    </SocketContext.Provider>
  );
};
