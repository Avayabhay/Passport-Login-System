if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  // console.log("it entered");
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const users = [];

const getUserByEmail = (email) => users.find((user) => user.email === email);

const initializePass = require("./passport.config");
initializePass(passport, getUserByEmail, (id) =>
  users.find((user) => user.id === id)
);

app.set("view-engin", "ejs");
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

app.get("/", (req, res) => {
  //   res.send("Passport Login System");
  res.render("index.ejs", { name: req.user.name });
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.pass, 10);
    console.log(hashedPass);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      pass: hashedPass,
    });
    console.log(users);
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
  // console.log(user);
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
app.listen(3000);
