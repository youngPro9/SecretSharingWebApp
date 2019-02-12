//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = new mongoose.model("User", userSchema);


app.get("/home", function(req, res) {
  res.render("home");
});

app.route("/login")
.get(function(req, res) {
  res.render("login", {loginFail: false});
})
.post(function(req, res) {
  User.findOne({email: req.body.username}, function(err, foundUser) {
    if(foundUser){
      if(foundUser.password == md5(req.body.password)){
        res.render("secrets");
      }
      else{
        res.render("login", {loginFail: true});
      }
    }
    else{
      res.render("login", {loginFail: true});
    }
  });
});

app.route("/register")
.get(function(req, res) {
  res.render("register");
})
.post(function(req, res) {

  const user = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });

  user.save(function(err) {
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });

});







app.listen(3000, function() {
  console.log("Server is Running on Port 3000");
});
