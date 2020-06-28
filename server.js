const express=require('express');
const app = express();
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const User = require("./models/user");
const DATABASE_URI = "mongodb://localhost/users";
mongoose.connect(DATABASE_URI,{ useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.once("open", ()=>console.log("database connected"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
 
app.get("/", (req, res)=>{
    res.render("index")
})
app.get("/register", (req,res)=>{
    res.render("register");
})
app.get("/login", (req,res)=>{
    res.render("login");
})
app.post("/register",(req,res)=>{
    bcrypt.hash(req.body.password, 8 , function(err, hash){
        const newUser = new User({
            email: req.body.email,
            password: hash,
    
        });
        newUser.save();
        console.log(req.body.email);
        console.log("register succesfully");
        res.render("login");
    })
});
app.post("/login", (req, res)=>{
    User.findOne({ email: req.body.email }, function(err, result){
        if(err){
            alert('Invalid credentials');
        }
        if(result){
             bcrypt.compare(req.body.password, result.password, function(err, result){
                if(result===true){
                    console.log(result.password);
                    res.render("secret");
                }
                else {
                    console.log("invalid credentials")
                }
            });

        }
    });
});

    


const PORT = process.env.PORT || 3000;
app.listen( PORT, ()=>console.log("app running @" + PORT));