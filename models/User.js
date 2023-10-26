const mongoose = require('mongoose')  

const userSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
        unique:true
    },
    cart: {
        type: Object,
        required: false,
        default:{},
       
    }
},{ minimize: false })
const User = mongoose.model('User',userSchema)
module.exports = User