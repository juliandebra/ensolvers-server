require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 5000;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "/public")));

const notesRouter = require("./routes/notes");
const filtersRouter = require("./routes/filters");
app.use("/notes", notesRouter);
app.use("/filters", filtersRouter);

process.on("SIGINT", async () => {
  await client.end();
  process.exit();
});

app.all("/*", (req, res, next) => {
  res.send("That route does not exist!");
});

app.listen(port);
