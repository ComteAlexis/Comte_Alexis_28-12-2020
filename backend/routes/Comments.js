const express = require('express')
const router = express.Router()
const Auth = require('../middlewares/Auth')

const commentsCtrl = require('../controllers/Comments')

router.post('/:postId', Auth, commentsCtrl.createComment)
router.get('/:postId', Auth, commentsCtrl.getAllComments)
router.delete('/:commentId', Auth, commentsCtrl.deleteComment)

module.exports = router
