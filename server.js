require("dotenv").config();
const express = require("express");
const server = express();
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cors = require("cors");
const helmet = require("helmet");
const Records = require("./utils/airtable");
const airDB = require("./models/airtable-model");
const airtableRouter = require("./api/airtableRouter.js");
const cron = require("node-cron");

cron.schedule("* 23 * * *", () => {
  airDB.del().then((res) => Records());
  console.log("minute");
});

server.use(helmet());
server.use(cors());
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );

  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);

  next();
});
server.use(logger);
server.use(morgan("dev"));
server.use(fileupload());
server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ hello: "World!" });
});
server.use("/api/airtable", airtableRouter);

// custom logging function
function logger(req, res, next) {
  const now = new Date().toISOString();
  console.log(`A ${req.method} request to '${req.url}'at ${now}`);
  next();
}

module.exports = server;
