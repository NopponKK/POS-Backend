const express = require('express')
const router = express.Router()

const { list,changeRole,changeOrderStatus, getAllOrder, getSelectedOrder,getUserByOrder} = require('../Controllers/admin')
const {auth,adminCheck} = require('../Middleware/auth')

// http://localhost:5000/api/admin

router.get('/user',auth,adminCheck, list)
router.post('/change-role',auth,adminCheck,changeRole)
router.get('/admin/orders',auth,adminCheck,getAllOrder)
router.put('/admin/order-status',auth,adminCheck, changeOrderStatus)
router.get('/admin/orders/:id',auth,adminCheck,getSelectedOrder)
router.get('/admin/userorder/:id',auth,adminCheck,getUserByOrder)


module.exports = router