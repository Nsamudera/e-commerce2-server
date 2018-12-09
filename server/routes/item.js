const router = require('express').Router()
const Controller = require('../controllers/item')
const isLogin = require('../middlewares/isLogin')
const isAdmin = require('../middlewares/isAdmin')
const isItemExist = require('../middlewares/items/isItemExist')
const images = require('../helpers/images')

router.get('/', Controller.viewItems)
router.get('/search?', Controller.searchItem)
router.get('/popularity?', Controller.viewPopularItems)

router.post('/', isLogin, isAdmin, images.multer.single('image'), images.sendUploadToGCS, Controller.addItem)
router.delete('/:itemId', isLogin, isAdmin, isItemExist, Controller.deleteItem)
router.put('/:itemId', isLogin, isAdmin, isItemExist, images.multer.single('image'), images.sendUploadToGCS, Controller.editItem)
router.get('/:categoryId', Controller.viewItemsbyCategory)


module.exports = router