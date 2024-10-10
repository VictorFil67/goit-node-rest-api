import { WebSocketServer } from "ws";

const wsServer = new WebSocketServer({ port: 5000 });

const socetList = [];

// wsServer.on("connection", () => {
//   console.log("New frontend connected");
// });
wsServer.on("connection", (socet) => {
  setTimeout(() => socet.send("Welcome to websocet server"), 3000);
  socetList.forEach((item) =>
    item.send(
      `New member is connected. Now we have ${socetList.length + 1} members`
    )
  );
  socetList.push(socet);
});
