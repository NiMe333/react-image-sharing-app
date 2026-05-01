var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// vključimo mongoose in ga povežemo z MongoDB
require("dotenv").config();

var mongoose = require("mongoose");

var mongoDB = process.env.MONGO_URI;

mongoose
  .connect(mongoDB)
  .then(function () {
    console.log("MongoDB Atlas connected");
  })
  .catch(function (err) {
    console.log("MongoDB connection error:", err);
  });

// vključimo routerje
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/userRoutes");
var photosRouter = require("./routes/photoRoutes");

var app = express();

var cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/**
 * Vključimo session in connect-mongo.
 * Connect-mongo skrbi, da se session hrani v bazi.
 * Posledično ostanemo prijavljeni, tudi ko spremenimo kodo (restartamo strežnik)
 */
var session = require("express-session");
var MongoStore = require("connect-mongo");
app.use(
  session({
    secret: "work hard",
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoDB }),
  }),
);

//Shranimo sejne spremenljivke v locals
//Tako lahko do njih dostopamo v vseh view-ih (glej layout.hbs)
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/photos", photosRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.json(err);
});

module.exports = app;
