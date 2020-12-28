const jwt = require('jsonwebtoken')
const db = require('../admin/database')
const Post = require('../model/Post')
const User = require('../model/User')

exports.createPost = (req, res, next) => {
    if (req.body.post) {
        try{
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.decode(token)
            const userId = decodedToken.userId
            let imageUrl = ''
            if (req.file) {
                console.log(req.file)
                imageUrl = req.file.path.split('/')[2]
            }
            Post.insertPost(req.body.post, userId, imageUrl)
                .then(result => res.status(201).json({ success: true, message: 'Post créé avec succès'}))
                .catch(error => console.log({ error }))
          }catch(error){
              res.status(401).json({error: error | 'Il y a eu un problème avec l\'authentification'})
          }
    } else {
        res.status(400).json({error: 'Merci de ne pas laisser le champ post vide.'})
    }
}

exports.getAllPosts = (req, res, next) => {
    Post.getAllPost()
        .then(result => res.status(200).json({ posts: result }))
}

exports.deletePost = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.decode(token)
        const userId = decodedToken.userId

        Post.getOnePost(req.params.postId)
            .then(result => {
                const post = result[0]
                User.getRole(userId)
                    .then(result => {
                        const user = result[0]

                        if (post.user_id === userId || user.role >= 2) {
                            Post.deletePost(req.params.postId)
                                .then(result => res.status(200).json({message: 'post deleted'}))
                        } else {
                            res.status(400).json({message: 'Tu n\'as pas les droits'})
                        }
                    })
            })
      }catch(error){
          res.status(401).json({error: error | 'Il y a eu un problème avec l\'authentification'})
      }
}