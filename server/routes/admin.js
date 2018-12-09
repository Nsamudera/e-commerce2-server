const router = require('express').Router()
const Controller = require('../controllers/admin')
const isLogin = require('../middlewares/isLogin')
const isAdmin = require('../middlewares/isAdmin')
const isAuthorized = require('../middlewares/isAuthorized')

router.use(isLogin);
router.use(isAdmin);

router.get('/', Controller.canProceed)
router.post('/', Controller.addAdmin)
router.delete('/:id', isAuthorized, Controller.deleteAdmin)
router.put('/:id', isAuthorized, Controller.editAdmin)
module.exports = router