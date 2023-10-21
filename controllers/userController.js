// const User = require('../models/User')
const connection = require('../connection')
const handleNewUser = async (req, res) => { 
    const { userid } = req.body;
    
    try { 
        let duplicated = false;
        let newDocument = req.body;   
        result = await connection
            .callDB('userscollection')
            .then((collection) => {
                collection.find({}).toArray((error, res_) => { 
                    let found = res_.find((x) => x.userid === newDocument.userid)
                      
                    if (found && found.userid && found.userid === newDocument.userid) {  
                        duplicated = true; 
                        res.status(500).json({ 'message' : 'The user already exists','status' : 500 })
                        return;
                    } else {
                        collection.insertOne(newDocument)
                        res.status(200).json({ 'success' : `New user ${userid} created.`}).send(result); 
                        return;
                    } 
                    
                })   
           
              
            });   
       
    } catch (err) {
        res.status(500).json({ 'message' : err.message })
    }
}

module.exports = { handleNewUser }