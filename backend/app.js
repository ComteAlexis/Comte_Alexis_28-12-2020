const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')

const userRoute = require('./routes/Users')
const postRoute = require('./routes/Posts')
const commentRoute = require('./routes/Comments')

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, cookie')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use('/api/images', express.static(path.join(__dirname, 'images')))

app.use('/api/user', userRoute)
app.use('/api/post', postRoute)
app.use('/api/comment', commentRoute)

module.exports = app
