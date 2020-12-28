const db = require('../admin/database')

exports.insertPost = (postText, userId, imageUrl = null) => {
    return db.query(`INSERT INTO Posts (content, user_id ${imageUrl ? ', image_url' : ''}) VALUES (?, ? ${imageUrl ? ', ?' : ''})`, [postText, userId, imageUrl])
}

exports.getAllPost = () => {
    return db.query('SELECT P.id as postId, U.avatar_url, U.id, P.content, P.image_url, p.created_at, U.lastname, U.firstname FROM Posts as P INNER JOIN Users as U WHERE P.user_id = U.id ORDER BY P.id DESC')
}

exports.getOnePost = (postId) => {
    return db.query('SELECT * FROM Posts WHERE id = ? LIMIT 1', [postId])
}

exports.deletePost = (postId) => {
    return db.query('DELETE FROM Posts WHERE id = ?', [postId])
}