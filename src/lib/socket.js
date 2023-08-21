import { io } from "socket.io-client";

const socketUrl = process.env.REACT_APP_SOCKET_URL;
const userUrl = `${socketUrl}/user`;
const marketUrl = `${socketUrl}/market`;

export const userSocket = io(userUrl, {
  autoConnect: false,
});

export const marketSocket = io(marketUrl, {
  autoConnect: false,
});