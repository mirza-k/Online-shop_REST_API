const Product = require('../models/products.js');

exports.GetAllProducts = (req,res,next)=>{
    Product.find()
    .select("_id name price productImage")
    .exec()
    .then(result => {
        if(result){
        const response = {
            count: result.length,
            products: result.map(result =>{
                return{
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
                    request: {
                        type: "GET",
                        URL: "http://localhost:1333/products"+req.url+result._id
                    }
                }
            })
        }   
        res.status(200).json(response)
        }
        else
            res.status(400).json({message: "There is no products!"})
    })
    .catch(err => res.status(500).send(err))
}
