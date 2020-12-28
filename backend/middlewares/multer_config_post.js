const multer = require('multer')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': '.gif'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/post')
    },
    filename: (req, file, cb) => {
        const name = file.originalname.split(' ').join('_')
        const extension = MIME_TYPES[file.mimetype]
        cb(null, name + Date.now() + '.' + extension)
    }
})

module.exports = multer({storage}).single('image')