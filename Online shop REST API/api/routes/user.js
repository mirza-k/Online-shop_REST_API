const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require("dotenv");

env.config();

router.get('/',(req,res,next)=>{
    User.find().exec()
    .then(data => res.status(200).json({Users: data}))
    .catch(error => res.status(400).json({error: error}))
})

router.post('/signup',(req,res,next)=>{
    User.find({email: req.body.email})
    .exec().
    then(user =>{
        if(user.length > 0){
            return res.status(409).json({message: "User with same email already exists."})
        }
        else{
            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                if(err){
                    res.status(500).json({error: err})
                }else{
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
                    user.save()
                    .then(user =>{
                       console.log("kreirani user ->>  "+ user)
                       res.status(201).json({message: "User created!"})
                   })
                    .catch(err => res.status(400).json({error: err}))
                }
            })
        }
    })
});

router.delete('/:id',(req,res,next)=>{
    User.remove({_id: req.params.id}).exec()
    .then((result)=>{
        res.status(200).json({
            message:"User deleted."
        })
    })
    .catch(err=> res.status(500).json({error:err}))
})

router.post('/login',(req,res,next)=>{
    User.find({email: req.body.email}).exec()
    .then(user=>{
        if(user.length < 1)
            return res.status(401).json({message: "Auth failed"})
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if(err){
                return res.status(401).json({message: "Auth failed"})
            }
            if(result){
                const token = jwt.sign({_id: user[0]._id, password: user[0].password}, process.env.JWT_KEY,{expiresIn:"1h"})
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                })
            }
            return res.status(401).json({message: "Auth failed"})
        })
    })
    .catch(err => {res.status(500).json({error: err})})
    })

module.exports = router;