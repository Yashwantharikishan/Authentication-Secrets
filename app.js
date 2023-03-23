//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParsr = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');


console.log(process.env.API_KEW);
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/userDB');
console.log("Successfully connected to the DataBase");

const userSchems = new mongoose.Schema({
       email: String,
       password: String,
});



userSchems.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchems);

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParsr.urlencoded({extended: true}));

 app.get("/", function(req, res){
      res.render("home");
 });

 app.get("/login", function(req, res){
      res.render("login");
 });

 app.get("/register", function(req, res){
      res.render("register");
 });

app.get("/submit", function(req, res){
      res.render("submit");
 });


app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save().then(function(){
         res.render("secrets");
    }).catch(function(err){
        console.log(err);
    });
});


app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}).then(function(foundUser){
        if(foundUser.password === password){
            res.render("secrets");
        }
    })
})



app.listen(3000, function(){
    console.log("The server is running on port 3000");
});