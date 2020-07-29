const path = require('path')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
require('./db/mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
require('./middleware/passport')(passport)

const app = express()
const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(expressLayouts)
app.use(express.urlencoded({
  extended: false
}))
app.use(session({
  secret: '86ef263dfb6eabb8779a89748724c510ea7fbda1f8d631873a524d51ce2570229126e2488aac',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// custom middleware with global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

app.use(express.static(publicDirectoryPath))
app.set('view engine', 'ejs')
app.use('/', require('./routes/index'))
app.use('/user', require('./routes/user'))

app.listen(port, console.log(`server up on port ${port}, God speed!!!`))
