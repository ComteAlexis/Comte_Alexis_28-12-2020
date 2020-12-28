const jwt = require('jsonwebtoken')
const db = require('../admin/database')

exports.createComment = (req, res, next) => {
    if (req.body.comment && req.body.comment !== '') {
        try{
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.decode(token)
            const userId = decodedToken.userId
            db.query('INSERT INTO Comments (content, post_id, user_id) VALUES (?, ?, ?)', [req.body.comment, req.params.postId, userId])
                .then(result => res.status(201).json({message: 'ok'}))
                .catch(error => res.status(500).json({error}))
          }catch(error){
              res.status(401).json({error: error | 'Il y a eu un problème avec l\'authentification'})
          }
    } else {
        res.status(500).json({error: 'Merci de ne pas laisser le champ post vide.'})
    }
}

exports.getAllComments = (req, res, next) => {
    db.query('SELECT C.id, C.user_id, C.content, U.firstname, U.lastname, U.avatar_url FROM Comments as C LEFT JOIN Users as U ON C.user_id = U.id WHERE C.post_id = ? ORDER BY C.created_at DESC', [req.params.postId])
        .then(result => res.status(200).json({ comments: result }))
        .catch(error => res.status(500).json({error: 'Erreur sur la base de donnée'}))
}

exports.deleteComment = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.decode(token)
        const userId = decodedToken.userId

        db.query('SELECT * FROM Comments WHERE id = ? LIMIT 1', [req.params.commentId])
            .then(result => {
                const comment = result[0]
                db.query('SELECT role FROM Users WHERE id = ? LIMIT 1', [userId])
                    .then(result => {
                        const user = result[0]
                        
                        if (comment.user_id === userId || user.role >= 2) {
                            db.query('DELETE FROM Comments WHERE id = ?', [req.params.commentId])
                                .then(result => res.status(200).json({message: 'comment deleted'}))
                        } else {
                            res.status(400).json({message: 'Tu n\'as pas les droits'})
                        }
                    })
            })
      }catch(error){
          res.status(401).json({error: error | 'Il y a eu un problème avec l\'authentification'})
      }
}