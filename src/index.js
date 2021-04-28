const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const router = require("./route/index");
const methodOverride = require("method-override");
const db = require("./models");
const { apiError } = require("./helpers/response.helper");
var fileupload = require("express-fileupload");

dotenv.config();

const port = 3005//process.env.SERVER_PORT;
global.__basedir = __dirname;
const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileupload());
app.use("/public", express.static(path.join(__dirname, "../public")));

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.use("/api", router);

app.use(function (req, res, next) {
  apiError(res, "Unable to find the requested resource!", false, 404);
  // res.status(404).send("Unable to find the requested resource!");
});
// app.use(upload.array());

if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    apiError(res, err.message, false, 500);
  });
}

async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await db.sequelize.authenticate();
    console.log("Database connection OK!");
  } catch (error) {
    console.log("Unable to connect to the database:");
    console.log(error.message);
    process.exit(1);
  }
}

async function init() {
  await assertDatabaseConnectionOk();

  // create table based on model
   //db.sequelize.sync();

  console.log(`Starting  on port ${port}...`);

  app.listen(port, () => {
    console.log(`server started on port ${port}.`);
  });
}

init();
