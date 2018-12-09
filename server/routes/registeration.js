const router = require('express').Router()
const Controller = require('../controllers/registeration')
const isUserExist = require('../middlewares/isUserExist')
const isLogin = require('../middlewares/isLogin')

router.post('/signup', Controller.signup)
router.post('/signin', isUserExist, Controller.signin)
router.get('/decode', isLogin, Controller.decode)

module.exports = router