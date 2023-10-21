const mongoose = require('mongoose')

//Cart Schema

const Cart = mongoose.model('Cart', {
    products: {
        type: Array,
        required: true,
    },
    total: {
        type: Number,
        required:true
    }
})

module.exports = {Cart}