const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userSchema = mongoose.Schema({
    name: String,
    password: {
        type: String
    },
    role: {
        type: String,
        default: 'user'
    },
   
    enabled: {
        type: Boolean,
        default: false
    },
    wishlist: [{
        type: ObjectId, // Fix the typo here, 'tpye' -> 'type'
        ref: 'products' // Change 'products' to the correct model name (should match the model name you are referencing)
        
    }],
    name_surname:String,
    address:String,
    email:String,
    tel:String,

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); // Adjust the model name to start with an uppercase letter conventionally
