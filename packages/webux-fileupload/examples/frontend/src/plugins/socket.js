import SocketIO from "socket.io-client";

let socketIO = null;
let socketIOUpload = null;

function InitSocketIO() {
  console.debug("Initialize the socketIO connection");
  socketIO = SocketIO("http://localhost:1340", {
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000
  });

  socketIOUpload = SocketIO("http://localhost:1340/upload", {
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000
  });

  return { socketIO, socketIOUpload };
}

export default InitSocketIO;
export { socketIO, socketIOUpload, InitSocketIO };
