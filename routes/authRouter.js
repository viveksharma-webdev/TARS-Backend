const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/signup', async(req,res)=>{
  try {
    const{username,email,password}= req.body;
    
    let user = await userModel.findOne({email: email});

    if(user){
        return res.status(200).send("User already exist");
    };

    const salt =await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await userModel.create({
        username,
        email,
        password: hashedPassword
    });

    let token = jwt.sign({email: email, id: user._id}, process.env.JWT_SECRET_KEY);

    res.cookie("token", token,{
        httpOnly: true,
        secure: false,
        sameSite: "None",
        maxAge: 1000*60*60*24*5
    });
    console.log(user);
    res.send({token, user});

  } catch (error) {

    console.log("error in signup");
    res.status(500).send("Server Error");
    
  }
});

router.post('/login', async(req,res)=>{
    try {
        const{email,password} = req.body;
        let user = await userModel.findOne({email});

        if(!user){
            return res.status(401).send("Please signin first");
        };
        
        let result = await bcrypt.compare(password, user.password);

        if(!result){
            return res.status(401).send("Wrong password");
        };
        
        const token = jwt.sign({email:email, id: user._id}, process.env.JWT_SECRET_KEY);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "None",
            maxAge: 1000*60*60*24*5
        })
         
        
        res.send({user, token});
        
    } catch (error) {

        console.log("error in login");
        res.status(500).send("Server Error");
     }
        
});

router.post('/logout', async(req,res)=>{
  
        res.clearCookie("token", { httpOnly: true, secure: true });
        res.send("Token cleared successfully");
    
})

module.exports = router;