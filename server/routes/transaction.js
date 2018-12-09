const router = require('express').Router()
const Controller = require('../controllers/transaction.js')
const isLogin = require('../middlewares/isLogin')

router.get('/', isLogin, Controller.viewTransactions)
router.post('/', isLogin, Controller.addTransaction)


module.exports = router