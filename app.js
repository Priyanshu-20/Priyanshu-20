//jshint esversion:6
require('dotenv').config(); // most important line and should be kept at the top
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
console.log(process.env.API_KEY);
mongoose.connect('mongodb://localhost/userdb', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err))

    ///// user schema and model
    const userschema = new  mongoose.Schema({
      email : String,
      password : String
    });


userschema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ["password"] });

  const User = mongoose.model("User", userschema);

app.use(express.static("public"));
app.set('view engine' , 'ejs');

app.use(bodyParser.urlencoded({
  extended:true
}))


app.get('/',function(req,res){
  res.render('home');
});

app.get('/login',function(req,res){
  res.render('login');
});

app.get('/register',function(req,res){
  res.render('register');
});

app.post('/register',function(req,res){
  // now to send the information that user has sent
  const newuser = new User({
    email : req.body.username,
    password : req.body.password,

  });
  newuser.save(function(err){
    if(!err){
      // as we dont want use to go to our secrete page without login so after the login is saved to the database we are going to redirect it to the secrete page
      res.render("secrets");
    }
  });

});


app.post('/login',function(req,res){
  const email = req.body.username;
  const password = req.body.password;

  User.findOne( {email : email , password : password}, function(err,result){
    if( result ){
      res.render('secrets');
    }
    else res.redirect("/register");
  }
)

})

app.listen(3000, function(){
  console.log("server started at port 3000");
})
