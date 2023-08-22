import { io } from "socket.io-client";

const socketUrl = process.env.REACT_APP_SOCKET_URL;
const userUrl = `${socketUrl}/user`;

export const userSocket = io(userUrl, {
  autoConnect: false,
});
