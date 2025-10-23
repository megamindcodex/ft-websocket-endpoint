module.exports = (io, app) => {
  const notificationNamespace = io.of("/notification");

  const clients = {}; // To store userName -> socket.id mapping
  const socketToClientMap = {}; // To store socket.id -> userName mapping

  notificationNamespace.on("connection", async (socket) => {

    socket.on("join", (userName, callback) => {
      clients[userName] = socket.id;
      socketToClientMap[socket.id] = userName;
      console.log(`${userName} joined the notification namespace`)
      console.log(clients)
      // console.log(socketToClientMap)
      callback({
        status: 'ok',
        message: `${userName} joined notification namespace ${socket.id}`
      });

      // console.log("notification users: ",JSON.stringify(clients))
    })

    // socket.to(clients["emmanvictor"]).emit("testing", clients["emmanvictor"])

    socket.on("disconnect", () => {
      const userName = socketToClientMap[socket.id]; // Retrieve userName using socket.id
      if (userName) {
        delete clients[userName]; // Remove user from clients
        delete socketToClientMap[socket.id]; // Clean up socketToUserMap
        console.log(`${userName} disconnected from notification namespace.`);
      }
    });

  })

  app.post("/api/notify", async (req, res) => {
    try {
      const { type, sender, receiver, amount } = req.body;

      console.log(`webhook request received from: ${sender} to ${receiver}`)

      const clientSocketId = clients[receiver]
      // console.log(clientSocketId)

      if (type === "credit-alert") {

        notificationNamespace.to(clientSocketId).emit("credit-alert", { message: `${sender} just credit you a sum of $${amount}` })
        return res.status(200).json({ message: `credit-alert push notification pushed successfully to ${receiver}` })
      }

    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })
};
