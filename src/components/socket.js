import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    autoConnect: false, // Prevent auto connection until explicitly called
});

export default socket;
