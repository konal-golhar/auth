//jshint esversion:6
require('dotenv').config()
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
var encrypt = require('mongoose-encryption');
const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/SecretsDB');
  }
const secretsSchema=new mongoose.Schema({
email:String,
password:String

})
console.log(process.env.API_KEY);
secretsSchema.plugin(encrypt,{secret:process.env.secret,encryptedFields:['password']});
const User=new mongoose.model("User",secretsSchema);

app.get("/",function(req,res){
res.render("home");

})
app.get("/login",function(req,res){
res.render("login");

})
app.get("/register",function(req,res){
res.render("register");

})
app.post("/register",function(req,res){
const user=new User({
email:req.body.username,
password:req.body.password
});
user.save(function(err){
if(err)
{
  console.log(err)
}
else
{
  res.render("secrets");
}

});


});


app.post("/login",function(req,res)
{console.log(req.body.username);
User.findOne({email:req.body.username},function(err,result)
{console.log(result)
if(!err){
if(result)
{
  if(result.password===req.body.password){
    console.log("successful login");
    res.render("secrets");

  }
else{

  res.redirect("/");
}
}
}
});
});

app.listen(3000,function(){
  console.log("server started successfully");
})
