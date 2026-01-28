const User = require('../Models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { token } = require('morgan')

exports.register = async (req, res) => {
    try {
        //code
        // 1.CheckUser
        const { name, password } = req.body
        var user = await User.findOne({ name })
        if (user) {
            return res.send('ชื่อผู้ใช้ถูกใช้งานแล้ว!').status(400)
        }
        // 2.Encrypt
        const salt = await bcrypt.genSalt(10)
        user = new User({
            name,
            password
        })
        user.password = await bcrypt.hash(password, salt)
        // 3.Save
       
        res.send("สมัครสมาชิกเรียบร้อย")
        await user.save()

       
    } catch (err) {
        //code
        console.log(err)
        res.status(500).send('Server Error')
    }
}
exports.login = async (req, res) => {
    try {
        //code
        // 1. Check User
        const { name, password } = req.body
        var user = await User.findOneAndUpdate({ name }, { new: true })
       
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.send('รหัสผ่านไม่ถูกต้อง').status(400)
            }
            // 2. Payload
            var payload = {
                user: {
                    name: user.name,
                    role:user.role,
                    id:user.id
                    
                }
            }
            // 3. Generate
            jwt.sign(payload, 'jwtsecret', { expiresIn: '7d' }, (err, token) => {
                if (err) throw err;
                res.json({ token, payload })
            })
        } else {
            return res.send('ไม่มีชื่อผู้ใช้นี้ในระบบ').status(400)
        }

    } catch (err) {
        //code
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.currentUser = async (req,res) =>{
    try{
        console.log('currentUser',req.user);
        const user= await User.findOne({name:req.user.name})
        .select("-password")
        .exec()

        res.send(user)
    }catch(err){
        console.log(err);
        res.status(500).send('Server Error')
    }
}