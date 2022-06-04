const express = require("express");
const bcrypt = require("bcrypt");

const app = express();

const user = [];

app.set("view-engin", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  //   res.send("Passport Login System");
  res.render("index.ejs", { name: "abhay" });
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
    user.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      pass: hashedPass,
    });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
  // console.log(user);
});

app.post("/login", (req, res) => {});
app.listen(3000);
