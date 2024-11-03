if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

app.use(express.static("views"));

initializePassport(
  passport,
  (name) => users.find((user) => user.name === name),
  (id) => users.find((user) => user.id === id)
);

const users = [];

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.post("/register", checkNotAuthenticated, async (req, res) => {
  var s = req.body.name;
  var pass = req.body.password;
  if (containsOnlyLetters(s) && passCheck(pass)) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      console.log(users);
      res.redirect("/login");
    } catch (e) {
      console.log(e);
      res.redirect("/register");
    }
  } else {
    console.log("ONLY LETTERS IN USERNAME");
  }
});

function usernameError() {
  alert("PLEASE ONLY USE LETTERS IN USERNAME");
}
function emailError() {
  alert("Invalid Email");
}

function containsOnlyLetters(str) {
  return /^[a-zA-Z]+$/.test(str);
}

function passCheck(str) {
  if (str.length > 8 || str.length < 3) return false;
  return true;
}

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("Login-Signup-main/index.ejs");
});

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("Login-Signup-main/index.ejs");
});

app.delete("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(3000);
