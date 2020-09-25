const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user.js');
const Post = require('../models/post.js');


router.post('/add',(req,res,next)=>{
    User.find({_id: req.body.userId})
    .exec()
    .then(data=>{
    if(data.length===0){
        return res.status(400).json({message:"User doesn't exists."})
    }
    const post = new Post({
        _id: mongoose.Types.ObjectId(),
        user: req.body.userId,
        content: "This is my first post!"
    })
    console.log(post);
    post.save()
    .then(data => {res.status(200).json({message: data})})
    .catch(error=>{res.status(400).json({error:error})})
    })
})

module.exports = router;