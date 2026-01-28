    /*
    const mongoose = require('mongoose')

    const connectDB = async () => {
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017/test')
            console.log('DB Connected')
        } catch (err) {
            console.log(err)
        }
    }

    module.exports = connectDB
    */

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // ใช้ srv เป็นหลักเพื่อให้ DNS ของ Atlas จัดการเลข IP ให้เอง
        const dbUrl = process.env.DATABASE || 'mongodb+srv://nopponkrungkaew_db_user:0811597850a@cluster0.ucf82qu.mongodb.net/POS_Database?retryWrites=true&w=majority';
        
        console.log('--- ⏳ Connecting to MongoDB (SRV Mode)... ---');
        await mongoose.connect(dbUrl);
        console.log('--- ✅ DB Connected Success! ---');
    } catch (err) {
        console.error('--- ❌ DB Connection Error: ', err.message);
    }
}
module.exports = connectDB;