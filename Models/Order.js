const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
      },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
            },
            count: Number,
            price: Number,
            file: String,   
            data: mongoose.Schema.Types.Mixed,
        }
    ],
    cartTotal: Number,
    orderStatus: {
        type:String,
        default:"paymenyRequire"

    },
    orderedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
  
}, { timestamps: true });

module.exports = mongoose.model('order', orderSchema);