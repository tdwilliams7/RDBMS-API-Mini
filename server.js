const express = require("express");
const bodyParser = require("body-parser");

const zooRouter = require("./zooRouter");
const bearRouter = require("./bearRouter");
const server = express();

server.use(bodyParser.json());

// endpoints here
server.use("/zoos", zooRouter);
server.use("/bears", bearRouter);
server.get("/", (req, res) => {
  res.status(200).json({ api: "Running....." });
});

const port = 3000;
server.listen(port, function() {
  console.log(`Server Listening on ${port}`);
});
