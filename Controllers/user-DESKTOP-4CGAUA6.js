const User = require('../Models/Users')
const Product = require('../Models/Product')
const Cart = require("../Models/Cart")
const Order = require("../Models/Order")
const OrderCounter = require("../Models/OrderCounter")
const QRcode= require('qrcode')
const generatePayload = require('promptpay-qr')
const _ = require('lodash')

exports.userCart = async(req,res)=>{
    try{
        const {cart} =req.body;
       
        let user = await User.findOne({name:req.user.name}).exec()
        
        let products =[]
        //Check ตะกร้าสินค้าเก่า

        let cartOld = await Cart.findOne({orderedBy:user._id}).exec()
        if(cartOld){
            await Cart.deleteOne({ _id: cartOld._id }).exec();
            console.log("Old cart has been removed");

        }

        //ตกแต่งสินค้า
        for(let i=0;i<cart.length;i++){
            let object={}
            object.product = cart[i]._id
            object.count = cart[i].count
            object.price = cart[i].price
            object.file = cart[i].file
            products.push(object)
        }

        //หาผลรวมของตะกร้า
        let cartTotal = 0;
        for(let i =0;i<products.length;i++){
            cartTotal = cartTotal + products[i].price * products[i].count
        }

        let newCart = await new Cart({
            products,
            cartTotal,
            orderedBy:user._id
        }).save();
        console.log(newCart);
      
        res.send('userCartOK')

    }catch(err){
        console.log(err);
        res.status(500).send("userCart ERROR");
    }
}

exports.getUserCart = async(req,res)=>{
    try{
        const user = await User.findOne({name:req.user.name}).exec()
     
        let cart = await Cart.findOne({orderedBy:user._id})
        .populate('products.product',"_id name price" )
        .exec()
       
        const {products,cartTotal,orderedBy} = cart
   
        res.json({products,cartTotal,orderedBy})
    }catch(err){
        res.status(500).send("Error 500")
    }
}

exports.saveOrder = async (req, res) => {
    try {
            const data = req.body;
            const newdata=[]
            let user = await User.findOne({ name: req.user.name }).exec();
            let userCart = await Cart.findOne({ orderedBy: user._id }).exec();

            let updatedProducts = [...userCart.products];
            for(i=0;i<data.orderData.length;i++){
            newdata[i]={
                    
                    product:updatedProducts[i].product,
                    count:updatedProducts[i].count,
                    price:updatedProducts[i].price,
                    file:updatedProducts[i].file,
                    _id:updatedProducts[i]._id,
                    data:data.orderData[i],

            }
        }

        let orderCounter = await OrderCounter.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true, upsert: true });
 
const orderNumber = `RYTC-${orderCounter.count.toString().padStart(3, '0')}`;

        let order= await new Order({
               orderNumber,
               products:newdata,
               orderedBy:user._id,
               cartTotal:userCart.cartTotal,
          }).save()
      
         let bulkOption = newdata.map((item)=>{
            return {
                updateOne:{
                    filter:{_id:item.product._id},
                    update:{$inc:{quantity:-item.count,sold:+item.count}}
                }
            }
         })
        
         
         
        
         let updated = await Product.bulkWrite(bulkOption,{})
         console.log(updated);
         res.send(updated)
    }catch(err){
       
        console.log(err)
        res.status(500).send("Error 500")
    }
}


exports.emptyCart = async(req,res)=>{
    try{
        const user = await User.findOne({name:req.user.name}).exec()
     
        const empty = await Cart.findOneAndRemove({orderBy:user._id}).exec()

        res.send(empty)
    }catch(err){
        res.status(500).send("Remove Cart Error 500")
    }
}

exports.addToWishList = async(req,res)=>{
    try{
        const {productId} = req.body

        let user = await User.findOneAndUpdate(
            {name:req.user.name},
            {$addToSet:{wishlist:productId}}
            ).exec()
        res.send(user)
        console.log(user);
    }catch(err){
        res.status(500).send("Add Wishlist error")
    }
}
exports.getWishList = async(req,res)=>{
    try{
        let list = await User.findOne({name:req.user.name})
        .select('wishlist').populate('wishlist').exec()

        res.json(list)
    }catch(err){
        res.status(500).send("Get Wishlist error")
    }
}
exports.removeWishList = async(req,res)=>{
    try{
      const {productId}= req.params
      
        let user = await User.findOneAndUpdate(
            {name:req.user.name},
            {$pull:{wishlist:productId}}
        ).exec()
            res.send(user)
    }catch(err){
        res.status(500).send("Get Wishlist error")
    }
}

exports.readUser = async(req,res)=>{
    try{    
        const id=req.params.id;    
        const user = await User.findOne({ _id: id }).exec();
        
        res.send(user)
        
    }catch(err){
        res.status(500).send("Read User Account Error")
    }

}

exports.updateUser = async(req,res)=>{
    try{
        const id=req.params.id;
        
        const { email, tel } = req.body.data;
        console.log(email);
        
        const updatedUser = await User.findOneAndUpdate(
            { _id: id },
            { $set: { email, tel } },
            { new: true }
          ).exec();
       
          res.send(updatedUser)
        

    }catch(err){
        res.status(500).send("Edit User ERROR")
        console.log(err);
    }

}
exports.getOrder = async(req,res)=>{
    try{
        const user = await User.findOne({name:req.user.name}).exec()
     
        let order = await Order.find({orderedBy:user._id})
        .populate('products.product')
        .exec()
       

   
        res.send(order)
    }catch(err){
        res.status(500).send("get Order 500")
    }
}
exports.generateQRcode = async(req,res)=>{
    try{

        const amount = req.body;
        
        const mobileNumber = '0659621668';
        const payload =generatePayload(mobileNumber,amount);
        const option={
            color:{
                dark:"#000",
                light:"#fff"
            }


        }
        QRcode.toDataURL(payload,option,(err,url)=>{
            if (err) {
                console.log('QR code generation failed:', err);
                return res.status(500).send(err); // Sending error status and message
            } else {
                console.log('QR code generated successfully');
                return res.status(200).send(url); // Sending the URL of the generated QR code
            }
        })


    }catch (err) {
        console.error('Error generating QR code:', err);
        res.status(500).send("Error generating QR code: " + err); // Sending error status and message
    }
}

