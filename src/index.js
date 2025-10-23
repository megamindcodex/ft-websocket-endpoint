require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const router = express.Router()
const httpServer = createServer(app);
const bodyParser = require("body-parser");
const cors = require("cors");

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());

const io = new Server(httpServer, {
  cors: {
    origin: [
      // origin for development ---for star-link router
      "http://192.168.2.121:4000", //ft-endpoint 
      "http://192.168.2.121:5173", //ft-client


      // origin for development  ---for lucky phone router
      "http://192.168.127.103:4000", //ft-endpoint
      "http://192.168.127.103:5173", //ft-client

      // origin for production
      "https://ft-endpoint.onrender.com", //ft-endpoint
      "https://test-fintech.netlify.app" //ft-client

    ],

    methods: ["Get", "POST", "PUT", "DELETE"],
    allowedHeaders: ["content-type", "Authorization"],
  },
});

const PORT = process.env.PORT || 4500;

const registerChatNamespace = require("./namespace/chat.js");
// const registerNewsNamespace = require("./namespace/news.js");
const notificationNameSpace = require("./namespace/notification.js");



const connectNamespaces = () => {
  // Initialize namespace
  const chatNamespace = registerChatNamespace(io, app);
  // const newsNamespace = registerNewsNamespace(io, app);
  notificationNameSpace(io, app)
};


connectNamespaces();



const startServer = async () => {
  try {
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`server listening on port ${PORT} http://0.0.0.0:${PORT}`);
    });
    // console.log(httpServer)

  } catch (err) {
    console.error("Error starting server", err);
  }
};

startServer();
