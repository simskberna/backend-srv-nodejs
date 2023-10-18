const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const MongoClient = require('mongodb').MongoClient
const cors = require('cors')
const app = express(); 
app.use(cors()); 
const DATABASENAME = process.env.DATABASE
const CONNECTION_STRING = process.env.CONNECTION_STRING

let database = null; 
const PORT = process.env.PORT || 5001

app.listen(PORT, () => {  
    MongoClient.connect(CONNECTION_STRING, (error, client) => { 
        database = client.db(DATABASENAME)  
        if (error) {
            console.log(error)
        } else { 
            console.log('Mongo DB Connection Successful')  
            app.get('/api/v1/GetProducts', (request, response) => {  
                
                database.collection('productscollection').find({}).toArray((error, result) => { 
                    response.send(result)
                })
            })
            app.get('/api/v1/GetCategories', (request, response) => { 
                database.collection('categoriescollection').find({}).toArray((error,result) => {
                    response.send(result)
                })
            })
        }
      
    }) 

}) 
app.get('/endpoint-1', (req, res, next) => {
    res.status(200).json({
        success: true,
        data: {
            message: 'Endpoint  1 is working...'
        }
    })
})

app.get('/endpoint-2', (req, res, next) => {
    res.status(200).json({
        success: true,
        data: {
            message: 'Endpoint  2 is working...'
        }
    })
}) 
