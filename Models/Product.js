const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: String,
    detail: {
        type: String,
        text: true,
    },
    price: {
        type: Number,
    },
    file: {
        type: String,
        default: 'noimage.jpg',
    },
    quantity: Number,
    sold: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });



module.exports = mongoose.model('products', productSchema);
