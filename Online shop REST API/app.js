const express = require('express');
const app = express();
const mongoose = require('mongoose');  
const bodyParser = require('body-parser');
const productsRoutes = require('./api/routes/products.js')
const ordersRoutes = require('./api/routes/ordrers')
const usersRoutes = require('./api/routes/user.js');
const postsRouter = require('./api/routes/post.js');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://mirza:******@cluster0-lubgo.mongodb.net/test?retryWrites=true&w=majority",
{useNewUrlParser: true}).then(()=>{console.log('>>>>DB connected.<<<<')})

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/products',productsRoutes);
app.use('/orders',ordersRoutes);
app.use('/users',usersRoutes); 
app.use('/post',postsRouter); 


app.use((req,res,next)=>{
    const err = new Error('This is error');
    err.status=404;
    next(err);    
})
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        message: error.message
    })
})

module.exports = app;