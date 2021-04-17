const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const express = require("express");
const socket = require("socket.io");
const app = express();
const cors = require("cors");
const urls = require('./routes/router');

// initialize configuration
dotenv.config();
const port = process.env.SERVER_PORT;
const dbURI = process.env.DB_URI;

//Db connect
mongoose.set('useCreateIndex', true)
mongoose.connect(
  dbURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Database is connected");
  }
);
mongoose.Promise = global.Promise;

app.use(cors());
app.use(express.json());
app.use('/api',urls)

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

const server = app.listen(port, () => {
  console.log("Server Running on Port " + port);
});

//socket
io = socket(server);
io.on("connection", (socket) => {
  console.log(socket.id);
  const id = socket.handshake.query.id;
  socket.join(id);
  socket.on("send-message", ({ recipients, text }) => {
    recipients.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r !== recipient);
      newRecipients.push(id);
      socket.broadcast.to(recipient).emit("receive-message", {
        recipients: newRecipients,
        sender: id,
        text,
      });
    });
  });
  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
