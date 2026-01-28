const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            count: Number,
            price: Number,
            file:String,
        }
    ],
    cartTotal: Number,
    orderedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, { timestamps: true });

module.exports = mongoose.model('cart', cartSchema);