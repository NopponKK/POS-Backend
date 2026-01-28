const jwt = require('jsonwebtoken')
const User = require('../Models/Users')

exports.auth = async(req,res,next)=>{
    try{
        const token = req.headers["authtoken"]
        console.log(token);
        if(!token){
            return res.status(400).send('Token Invalid')

        }
        const decoded = jwt.verify(token,'jwtsecret')
        req.user = decoded.user
        
        next();

    }catch(err){
        console.log(err)
        res.send('Token Invalid').status(500)

    }
}

exports.adminCheck = async(req,res,next)=>{
    try{
        console.log(req.user);
        const userAdmin = await User.findOne({name:req.user.name})
        .select("-password")
        .exec()
        
        if(userAdmin.role !== 'admin'){
            res.status(403).send("Admin access Denied")

        }else{
            next();
        }
    }catch(err){
        console.log(err).res.status(403).send('Admin Access Denied')
    }
}