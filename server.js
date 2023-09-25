if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  // console.log("it entered");
}

const mongoURI = "mongodb://0.0.0.0:27017/mySession";
//const { MongoDBStore } = require("connect-mongodb-session");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const UserModel = require("./model/User");

const bcrypt = require("bcryptjs");
// const passport = require("passport");
// const flash = require("express-flash");
const session = require("express-session");

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("db connected");
  })
  .catch((err) => console.log(err));

const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore(
  {
    uri: mongoURI,
    //collection: "mySessions",
  },
  function (error) {
    // Should have gotten an error
    console.log(error);
  }
);

store.on("error", function (error) {
  console.log(error);
});
// const users = [];

// const getUserByEmail = (email) => users.find((user) => user.email === email);

// const initializePass = require("./passport.config");
// initializePass(passport, getUserByEmail, (id) =>
//   users.find((user) => user.id === id)
// );

// app.set("view-engin", "ejs");
app.use(express.urlencoded({ extended: false }));
// app.use(flash());
app.use(
  session({
    secret: "process",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24 * 1000,
    },
    store: store,
  })
);

//Middleware for accessing dashboard based on authorization
const Authorize = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.send("Access is restricted!!");
  }
};

app.get("/", (req, res) => {
  console.log(req.session);
  res.send("Passport Login System  !");
  // res.render("index.ejs", { name: req.user.name });
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, pass } = req.body;
    // console.log(email, pass);

    var user = await UserModel.findOne({ email });
    console.log(user);
    if (user) {
      res.redirect("/register");
    }
    console.log("after red 1");
    const hashedPass = await bcrypt.hash(pass, 10);
    console.log("after hashedPass");

    user = new UserModel({
      name,
      email,
      pass: hashedPass,
    });
    console.log(user);
    await user.save();
    //console.log("Saved");
    await res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.redirect("/register");
  }
  // console.log(user);
});

app.post(
  "/login",
  async (req, res) => {
    const { email, pass } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.send("User doesnot exists!");
    }

    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) {
      return res.send("incorrect password");
    }

    req.session.isAuth = true;
    res.send("Login successfully!!");
  }
  // passport.authenticate("local", {
  //   successRedirect: "/",
  //   failureRedirect: "/login",
  //   failureFlash: true,
  // })
);

//Dashboard
app.get("/dashboard", Authorize, (req, res) => {
  res.send(
    "<h1> Hi, this page is can only be accessed only to authorized users</h1>"
  );
});
app.listen(3000);
