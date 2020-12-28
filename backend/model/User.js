const db = require('../admin/database')

exports.getRole = (userId) => {
    return db.query('SELECT role FROM Users WHERE id = ? LIMIT 1', [userId])
}