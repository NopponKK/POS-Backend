const User = require('../Models/Users')
const Product = require('../Models/Product')
const Cart = require("../Models/Cart")
const Order = require("../Models/Order")

exports.list = async (req,res) =>{
    try{
      
        const user= await User.find({})
        .select("-password")
        .exec()

        res.send(user)
    }catch(err){
        console.log(err);
        res.status(500).send('Server Error')
    }
}

exports.changeRole = async (req,res) =>{
    try{
        const {id,role} = req.body.data
        // console.log(id,role);
        //  console.log('currentUser',req.user);
         const user= await User.findOneAndUpdate({_id:id},{role:role},{new:true})
         .select("-password")
         .exec()

         res.send(user)
    }catch(err){
        console.log(err);
        res.status(500).send('Server Error')
    }
    
}   


exports.changeOrderStatus = async (req, res) => {
    try {
        // code
        const {orderId,orderStatus}= req.body;
    
        let orderUpdated = await Order.findByIdAndUpdate(
            orderId,{orderStatus},{new:true}
        );
       
        res.send(orderUpdated);
    } catch (err) {
        // error
        console.log(err)
        res.status(500).send('Server Error')
    }
}


exports.getAllOrder = async (req, res) => {
    try {
        let orders = await Order.find({})
            .populate('products.product')
            .sort({ createdAt: -1 }) // Sort by creation date in descending order
            .exec();

        res.send(orders);
    } catch (err) {
        res.status(500).send("Error fetching orders");
    }
}

exports.getSelectedOrder = async(req,res)=>{
    try{
        const id = req.params.id
    
        let order = await Order.find({_id:id})
        .populate('products.product') .exec()      
     
        res.send(order)
        
     
    }catch(err){
        res.status(500).send("get Order 500")
    }


}


exports.getUserByOrder = async(req,res)=>{
    try{
        const id = req.params.id
    
        let orderFind = await Order.findOne({_id:id}).populate('products.product').exec();
        
        let user = await User.findById(orderFind.orderedBy).exec();
       
        res.send(user)
        console.log("thi"+user);
     
    }catch(err){
        res.status(500).send("get Order 500")
    }

    
}