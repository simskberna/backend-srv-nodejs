
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
//for testing purposes...
app.get('/endpoint-1', (req, res) => {
    database.collection('categoriescollection').find({}).toArray((error, result) => {
        if (!error) {
            res.status(200).json({
                status:200,
                success: true,
                data: {
                    categories : result
                }
            })
        } else {
            res.status(404).json({
                status:404,
                success: true,
                data: {
                    error
                }
            }) 
        }
        }) 
}) 
app.use('/user/register', require('./routes/register'));

