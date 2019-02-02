const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

//Map global promise to get rid of the DeprecationWarning
mongoose.Promise = global.Promise;

//Connect to Mongoose
mongoose
  .connect("mongodb://localhost/vidjot-dev")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//Load Idea Model
require("./models/Idea");
const Idea = mongoose.model("ideas");

// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method override middleware
app.use(methodOverride("_method"));

//Express-session middleware
app.use(
  session({
    secret: "swag",
    resave: true,
    saveUninitialized: true
  })
);

//Flash middleware
app.use(flash());

//Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Index Route
app.get("/", (req, res) => {
  const title = "Vidjot";
  res.render("index", {
    title: title
  });
});

//About Route
app.get("/about", (req, res) => {
  res.render("about");
});

//User Login Route
app.get("/users/login", (req, res) => {
  res.send("login");
});

//User Register Route
app.get("/users/register", (req, res) => {
  res.send("register");
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
