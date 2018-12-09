const router = require('express').Router()
const Controller = require('../controllers/cart.js')
const isLogin = require('../middlewares/isLogin')

router.get('/', isLogin, Controller.getCart)
router.post('/', isLogin, Controller.addtoCart)
router.post('/checkout', isLogin, Controller.checkout)
router.delete('/:cartId/:itemId', isLogin, Controller.removefromCart)


module.exports = router