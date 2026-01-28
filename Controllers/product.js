
const Product = require('../Models/Product')
const fs = require('fs')

exports.read = async (req, res) => {
    try {
        // code
        const id = req.params.id
        const producted = await Product.findOne({ _id: id }).exec();
        res.send(producted)
    } catch (err) {
        // error
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.list = async (req, res) => {
    try {
        // code
        
        const producted = await Product.find({}).exec();
        res.send(producted)
    } catch (err) {
        // error
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.listby = async (req, res) => {
    try {
        // code
       
        const {limit , sort ,order} = req.body;
        const producted = await Product.find({})
        .limit(limit)
        .sort([[sort, order]])

        .exec();
    
        res.send(producted)
    } catch (err) {
        // error
        console.log(req.body);
        console.log(err)
        res.status(500).send('Server Error')
    }
}
exports.create = async (req, res) => {
    try {
        // code
     
        var data = req.body
        if (req.file){
            data.file = req.file.filename
        }
        
        const producted = await Product(data).save()
        res.send("เพิ่มสินค้าเรียบร้อย")
    } catch (err) {
        // error
        console.log(err)
        res.status(500).send('Server Error')
    }
}
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;

        if (typeof req.file !== 'undefined') {
            newData.file = req.file.filename;
            if(newData.fileold=="noimage.jpg"){
                
            }else{
                await fs.unlink('./uploads/' + newData.fileold, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
 
        }

        const updated = await Product.findOneAndUpdate({ _id: id }, newData, { new: true }).exec();
        res.send(updated); // Move this line outside of the if condition

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

exports.remove = async (req, res) => {
    try {
        // code
        const id = req.params.id
        const removed = await Product.findOneAndDelete({_id:id}).exec()
        if (removed.file === 'noimage.jpg') {
            res.send("สินคู้าถูกลบเรียบร้อย")
        }else{

        if(removed?.file){
            await fs.unlink('./uploads/'+removed.file,(err)=>{
                if(err){
                    res.send("สินคู้าถูกลบเรียบร้อย")
                    
                   }
                    else{
                        res.send("สินคู้าถูกลบเรียบร้อย")
                    
                }
            })
        }
    }
        
        
    } catch (err) {
        // error
        console.log(err)
        res.status(500).send('Server Error')
    }
}


const handleQuery = async (req, res, query ) => {
    try {
      const products = await Product.find({ $text: { $search: query } });
      res.send(products);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
  };
exports.searchFilters = async(req,res)=>{
    const {query} = req.body
    try{
        if(query) {
            console.log('query',query);
            await handleQuery(req,res,query);
        }
    }catch (err) {
        // error
        console.log(err)
        res.status(500).send('Server Error')
    }

}
