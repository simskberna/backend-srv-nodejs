 
const  mongoose  = require('mongoose');
const connection = require('../connection') 
const User = require('../models/User')
 
 

const handleDisplayingCart = async(req, res) => {
    const id = req.params.id;
    try {  
        
        await connection
            .callDB('users')
            .then((collection) => { 
                collection.find({}).toArray((error, res_) => {  
                    const user = res_.find((user) => user.userid.toString() === id.toString())    
                    if (user && user.cart && user.cart.products && user.cart.products.length > 0) { 
                        res.status(200).json({ 'data': user.cart }) 
                        return
                    }
                    
                    res.status(200).json({ 'data': {} })
                })
            })
     
    } catch (err) {
        res.status(500).json({ 'message' : err.message })
    }
}

const handleCartAdd = async(req, res) => {
    const { productId, price, quantity } = req.body;  
    const id = req.params.id;
    try {  
        await connection.callDB('users').then((collection) => {
            if (!collection.cart || !id || !cart) {
                collection.updateOne(
                    {
                        "userid": id, 
                    },
                    {
                        $push:{ 
                            "cart.products": {
                                productId: productId,
                                price: price,
                                quantity: quantity
                            }
                        }
                    }
                )
                res.status(200).json({ 'message:':'Product added to cart successfully...'})
                return
            }
            res.status(500).json({ 'message': 'Missing information!' })
           
        })
        
       
    } catch (err) {
        res.status(500).json({ 'message' : err.message })
    }
}
const handleCartDelete = async (req, res) => { 
    const userid = req.params.id; 
    try {  
          
        await connection.callDB('users').then((collection) => {
            if (!collection.cart || !userid || !cart) {
                collection.updateOne(
                    {
                        "userid": userid, 
                    },
                    {
                        $unset:{ 
                           "cart":{}
                        }
                    }
                )
                res.status(200).json({ 'message': 'Deleted successfully' })
                return
            }
            res.status(500).json({ 'message': 'Missing information!' })
           
        })
        
       
    } catch (err) {
        res.status(500).json({ 'message' : err.message })
    }
}
const handleCartItemDelete = async (req, res) => {
    const productId = parseInt(req.params.productId)
    const userid = req.params.id 
    try {   
        await connection.callDB('users').then((collection) => {
            
            if (collection.cart || userid || productId) {  
                collection.updateOne(
                    {
                        "userid": userid, 
                    },
                    {
                        $pull:{ 
                           "cart.products":{productId:productId}
                        }
                    }
                )
                res.status(200).json({ 'message': 'Product removed from the cart successfully' })
                return
            }
            res.status(500).json({ 'message': 'Missing information!' })
        })
        
       
    } catch (err) {
        res.status(500).json({ 'message' : err.message })
    }
} 
const handleNewUser = async (req, res) => {
    const { userid, cart } = req.body;   
    const id = userid; 
    const newCart = typeof cart === 'undefined' ? {} : cart 
    try {  
        mongoose.connect(process.env.CONNECTION_STRING_V2, {
            useNewUrlParser:true
        }).then((conn) => {
            console.log('Connection successfull v3')
        }).catch((error) => {
            console.log('Some error occured')
        })

        const newUser = new User({
            userid: id,
            cart: newCart
        }); 
        
        newUser.save()
        .then((doc) => { 
            res.status(200).json({ 'New user created': doc }); 
            
        })
        .catch(err => {
            res.status(201).json({ 'Error occured: ': err.message });
        })
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
 
}

module.exports = { handleNewUser,handleCartAdd,handleDisplayingCart,handleCartDelete ,handleCartItemDelete}