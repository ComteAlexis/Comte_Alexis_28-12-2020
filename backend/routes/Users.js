const express = require('express')
const router = express.Router()
const Auth = require('../middlewares/Auth')
const Multer = require('../middlewares/multer_config_avatar')

const userCtrl = require('../controllers/Users')

router.post('/login', userCtrl.connectUser)
router.post('/signup', userCtrl.createUser)
router.delete('/:id', Auth, userCtrl.deleteUser)
router.get('/myinfo', Auth, userCtrl.getMyInfo)
router.put('/password', Auth, userCtrl.updatePassword)
router.put('/', Auth, Multer, userCtrl.updateUser)

module.exports = router
