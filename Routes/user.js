const express = require('express')
const router = express.Router()

const { userCart,getUserCart,emptyCart,addToWishList,
    removeWishList,getWishList, readUser,getOrder, updateUser,generateQRcode } = require('../Controllers/user')
const { saveOrder } = require('../Controllers/user');
const {auth} = require('../Middleware/auth');

// http://localhost:5000/api/user


router.post('/user/cart',auth,userCart)
router.get('/user/cart',auth,getUserCart)
router.post('/user/order',auth,saveOrder)
router.delete('/user/cart',auth,emptyCart)

router.post('/user/order',auth,getOrder)
router.get('/user/orders',auth,getOrder)


router.post('/user/wishlist',auth,addToWishList)
router.get('/user/wishlist',auth,getWishList)
router.put('/user/wishlist/:productId',auth,removeWishList)

router.get('/user/account/:id',auth, readUser)
router.put('/user/account/edit/:id',auth, updateUser)

router.post('/user/genqr',auth,generateQRcode)

module.exports = router