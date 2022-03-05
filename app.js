require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const feedRouter = require("./routes/feed");
const reutersMapRouter = require("./routes/reutersMap");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/feed", feedRouter);
app.use("/map", reutersMapRouter);

// catch 404 and forward to error handler
app.get("*", function (req, res) {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

//Start server and console log the used port
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log(
    `Server listening on  http://localhost:${listener.address().port}`
  );
});
