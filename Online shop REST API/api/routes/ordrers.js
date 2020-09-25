const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/order.js');
const Product = require('../models/products.js');

async function FindProduct(id){
    var prod = await Product.findById(id).then(result =>{return result})
    console.log("fja"+ prod);
    return prod;
}

router.get('/',(req,res,next)=>{
 Order.find()
    .select('product quantity _id')
    .populate('product','name price')
    .then(result => {
    res.json({
        Product: result
    })
    })
    .catch(err => res.status(500).json({
        error:err
    }))
})

router.get('/:orderId',(req,res,next)=>{
    Order.findById(req.params.orderId)
    .then(result => {
        if(!result)
            res.status(500).json({
                message:"Order not found."
            })
        res.status(200).json({
            Product:result
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err 
        })
    })
})
   

router.post('/',(req,res,next)=>{
    Product.findById(req.body.productId)
    .then(product => {
        if(!product)
            return res.status(400).json({
                message:"Product not found."
            });
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        })
       return order.save()
    })
    .then(result =>
        res.status(200).json({
            message: "Your order is successful.",
            product: result
        })  
    )
    .catch(err => res.status(500).json({
        message:"Product didn't exist.",
        error : err
    }))
})

router.delete("/:orderId",(req,res,next)=>{
    Order.remove({_id: req.params.orderId})
    .then(result => {
        if(!result)
            res.status(400).json({message: "Order not found."})
        res.status(200).json({
            message:"Order deleted",
            order:result
        })
    })
    .catch(err => {
        res.status(400).json({
            error:err
        })
    })
})


module.exports = router;

