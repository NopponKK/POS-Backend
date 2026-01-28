const express = require('express')
const router = express.Router()

const {
    read,
    list,
    create,
    update,
    remove,
    listby,
    searchFilters
} = require('../Controllers/product')

const {auth,adminCheck} = require('../Middleware/auth')
const { upload } = require('../Middleware/upload')

//http://localhost:5000/api/product
router.get('/product', list)
router.post('/productby', listby)

router.get('/product/:id', read)
router.post('/product', upload,create)
router.put('/product/:id',upload, update)
router.delete('/product/:id' , remove)

router.post('/search/filters',searchFilters)




module.exports = router