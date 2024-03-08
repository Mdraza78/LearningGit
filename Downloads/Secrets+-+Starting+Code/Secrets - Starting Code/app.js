//jshint esversion:6
require('dotenv').config()
const express=require("express");
const port=80;
const app=express();
const mongoose=require('mongoose');
const encrypt = require('mongoose-encryption');
const bodyParser=require('body-parser');
mongoose.connect("mongodb://127.0.0.1:27017/userLogAuth");

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})

userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ['password']  });

const user=new mongoose.model("user",userSchema);

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'))
app.get("/",(req,res)=>{
    res.render("home.ejs");
});

app.get("/login",(req,res)=>{
    res.render("login.ejs")
});

app.get("/register",(req,res)=>{
    res.render("register.ejs")
});

app.post("/login",(req,res)=>{
    const emailid=req.body.username;
    const password=req.body.password;

    user.findOne({email:emailid}).then((founduser)=>{
        if(founduser){
            if(founduser.password===password){
                res.render("secrets.ejs")
            }
        }
})
.catch((err)=>{
    console.log(err)
})    
})


app.post("/register",(req,res)=>{
const person=new user({
    email:req.body.username,
    password:req.body.password
})
person.save().then(()=>{
    res.render("secrets.ejs")
})
.catch((err)=>{
    console.log(err);
})
})


app.listen(port,()=>{
    console.log(`Server started at port ${port}`);
})
