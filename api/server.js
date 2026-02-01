const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./models/User");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.post("/api/register", async (req,res)=>{
    const {email, password} = req.body;

    const existingUser = await User.findOne({email});
    if(existingUser) return res.status(400).json({message:"User already exists"});

    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = new User({email, password:hashedPassword});
    await newUser.save();

    res.json({message:"Registration successful"});
});

app.post("/api/login", async (req,res)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(!user) return res.status(400).json({message:"User not found"});

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) return res.status(400).json({message:"Invalid credentials"});

    const token = jwt.sign({id:user._id}, "secretKey");

    res.json({message:"Login successful", token, email:user.email});
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;


