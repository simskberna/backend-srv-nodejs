
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const MongoClient = require('mongodb').MongoClient
const cors = require('cors');  


const app = express();  
app.use(cors()); 
const DATABASENAME = process.env.DATABASE
const CONNECTION_STRING = process.env.CONNECTION_STRING

let database = null; 
const PORT = process.env.PORT || 5001

app.listen(PORT,async () => {  
 await  MongoClient.connect(CONNECTION_STRING, (error, client) => { 
        database = client.db(DATABASENAME)  
        if (error) {
            console.log(error)
        } else {
            console.log('Mongo DB Connection Successful')
        }
    })  
}) 


//to get all products
app.get('/GetProducts', (request, response) => {  
    database.collection('productscollection').find({}).toArray((error, result) => {
        response.send(result)
    })
}) 
//to get the specific product
app.get('/product/:id/', (request, response) => {   
    database.collection('productscollection').find({}).toArray((error, result) => {    
        if (!error) { 
            let specifiedPrd = result.find((product) => product.id.toString() === request.params.id.toString())  
            response.send(specifiedPrd)
            
        } else {
            console.log(error)
        }
    })

});
//to get all categories
app.get('/GetCategories', (request, response) => { 
    database.collection('categoriescollection').find({}).toArray((error,result) => {
        response.send(result)
    })
})
//to get the specific category
app.get('/category/:id', (request, response) => {  
    database.collection('categoriescollection').find({}).toArray((error, result) => {
        if (!error) { 
            let specifiedCategory = result.find((category) => category.id.toString() === request.params.id.toString())  
            response.send(specifiedCategory)
        } else {
            console.log(error)
        } 
        })  
})
//to get the specific categorie's products
app.get('/categoryProducts/:id', (request, response) => {  
    let categoryName = ''
    database.collection('categoriescollection').find({}).toArray((error, result) => {
        if (!error) { 
            let specifiedCategory = result.find((category) => category.id.toString() === request.params.id.toString()) 
            categoryName = specifiedCategory.name 
        } else {
            console.log(error)
        } 
        })
    database.collection('productscollection').find({}).toArray((error, result) => {    
        if (!error) {  
            let specifiedCategoryProducts = result.filter((product) =>{ return product.category.id.toString() === request.params.id.toString()})   
            response.status(200).json({
                status:200,
                success: true,
                data: {
                    categoryName,
                    products : specifiedCategoryProducts
                }
            })
        } else {
            console.log(error)
        }
    })
}) 
 


app.use('/user/register', require('./routes/register'));
app.use('/user/get/cart', require('./routes/getCart'));
app.use('/user/purchase', require('./routes/createPurchase'));
//adds an item to the cart
app.use('/user/add/cart', require('./routes/addCart'));
//deletes the specified product from cart
app.use('/user/remove/cart/product', require('./routes/removeCartItem'));
 

//deletes the whole cart
app.use('/user/remove/cart', require('./routes/removeCart'));
