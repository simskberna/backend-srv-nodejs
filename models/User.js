const mongoose = require('mongoose') 
//User Schema

const User = mongoose.model('User', {
    userid: {
        type: String,
        required:true
    },
    cart: {
        type: Object,
        required:false,
        products: {
            type: Array,
            default:[]
        },
        total: {
            type: Number,
            default:0
        }
    }
})

module.exports = {User}