 
const  mongoose  = require('mongoose');
const connection = require('../connection') 
const User = require('../models/User')
const makeid = (length=5) => { 
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
} 
 

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
    let userObj = {}
    try {  
        await connection.callDB('users').then((collection) => {
            collection.find({}).toArray((error, res_) => { 
                userObj = res_.find(x => x.userid === id) 
                if (userObj !== '' && userObj.cart && userObj.cart) {
                    let matched = ''
                    let total = 0
                    if (userObj.cart.products && userObj.cart.products.length > 0) {
                        for (let item of userObj.cart.products) {
                            total += (item.price * item.quantity)
                        }
                        matched = userObj.cart.products.find(product => { return product.productId === productId })  
                    }  
                    total = Math.round(total * 100) / 100
                    if (matched !== '' && matched) {  
                        //if there is one more record with this productId then update quantity instead of push   
                        collection.updateOne(
                            {
                                "userid": id,  "cart.products.productId" : productId
                            },
                           
                            {
                                $set: {
                                    "cart.products.$.quantity": matched.quantity + quantity,
                                    "cart.total" : (total+price)
                                },  
                            },   
                           
                        )
                        res.status(200).json({ 'message:': 'Product added to cart successfully...' })
                        return
                        
                    } else {
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
                                    },
                                    
                                },
                                $set: {
                                    "cart.total": (total+price)
                                }
                            }
                        )
                        res.status(200).json({ 'message:':'Product added to cart successfully...'})
                        return
                    }
                }
            }) 
            
        }).catch((err) => res.status(500).json({ 'message': 'Something went wrong! ' + err }) )
        
       
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
                           "cart.products":[]
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
const handlePurchase = async (req, res) => {
    const { products } = req.body;  
    const id = req.params.id; 
    try {
        const orderNo = makeid()
        await connection.callDB('users').then((collection) => {
            if (collection.cart || id) {
                //updates the orders
                collection.updateOne(
                    {
                        "userid": id, 
                    },
                    {
                        $push:{ 
                            "orders": {
                                "order": {
                                    "products": products,
                                    "orderId":orderNo
                               }
                           }
                        }
                    }
                )
                //deletes the cart
                collection.updateOne(
                    {
                        "userid": id, 
                    },
                    {
                        $unset:{ 
                            "cart.products": [],
                            "cart.total" : 0
                        }
                    }
                )
                res.status(200).json({ 'message': 'Purchased successfully','orderId': orderNo})
                return
            }
            res.status(500).json({ 'message': 'Missing information!' })
           
        })
    } catch (err) {
        res.status(500).json({'message':err.message})
    }
}

module.exports = { handleNewUser,handleCartAdd,handleDisplayingCart,handleCartDelete ,handleCartItemDelete,handlePurchase}