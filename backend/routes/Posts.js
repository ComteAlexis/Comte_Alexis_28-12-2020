const express = require('express')
const router = express.Router()
const Auth = require('../middlewares/Auth')
const Multer = require('../middlewares/multer_config_post')

const postCtrl = require('../controllers/Posts')

router.post('/', Auth, Multer, postCtrl.createPost)
router.get('/', postCtrl.getAllPosts)
router.delete('/:postId', Auth, postCtrl.deletePost)

module.exports = router
