const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const Product = require('../models/products.js');
const checkAuth = require('../middleware/check-auth.js');
const ProductControllers = require('../controllers/products.js');

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb){
        cb(null, file.originalname);
    }
})
const upload = multer({storage: storage,limits:{
      fileSize: 1024*1024*5},
      fileFilter: fileFilter
});



router.get('/',checkAuth, ProductControllers.GetAllProducts)

router.post('/', upload.single('productImage'), checkAuth,  (req,res,next)=>{
    var product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product
    .save()
    .then((result)=>{
        res.status(200).json({
            message: "Product object successfully created.",
            createdProduct:{
                _id: result._id,
                name: result.name,
                price: result.price,
                request:{
                    type: "POST",
                    url: "http://localhost:1333/products/"+result._id
            }}
        })
    })
    .catch(err =>{
        res.status(500).json({message:err});    
    }) 
})
router.get('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(200).json(doc)})
    .catch(
        err => {console.log(err)
                res.status(500).json({err})})
})

router.patch('/:nekiId',(req,res,next)=>{
    const id = req.params.nekiId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id},{$set: updateOps})
    .exec()
    .then(result => res.status(200).json({
        message: "Patched ", result 
    }))
    .catch(err => res.status(500).json(err));
})

router.delete('/:id',(req,res,next)=>{
    const id = req.params.id;
    Product.remove({_id:id})
    .exec()
    .then(result => res.send(200).json({
        message: "Deleting successful.",
        result : result
    }))
    .catch(err => res.status(500).json(err));
})


module.exports = router;