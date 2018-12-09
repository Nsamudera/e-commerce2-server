const router = require('express').Router()
const Controller = require('../controllers/category.js')
const isLogin = require('../middlewares/isLogin.js')
const isAdmin = require('../middlewares/isAdmin.js')
const isCategoryExist = require('../middlewares/categories/isCategoryExist')

router.get('/', Controller.viewCategory)

router.use(isLogin);
router.use(isAdmin);

router.post('/', Controller.addCategory)

router.delete('/:categoryId', isCategoryExist, Controller.deleteCategory)
router.put('/:categoryId', isCategoryExist, Controller.editCategory)

module.exports = router