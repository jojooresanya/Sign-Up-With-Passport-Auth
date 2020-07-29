const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const signUpValidator = require('../validator/validator')

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.post('/signup', async (req, res) => {
  const {
    name,
    email,
    password,
    password2
  } = req.body

  const errors = signUpValidator(name, email, password, password2)

  if (errors.length > 0) {
    return res.render('signup', {
      errors,
      name,
      email,
      password,
      password2
    })
  }
  const user = await User.findOne({
    email
  })

  if (user) {
    errors.push({
      msg: 'Email is already registered'
    })

    return res.render('signup', {
      errors,
      name,
      email,
      password,
      password2
    })
  }

  const newUser = new User({
    name,
    email,
    password,
    date: new Date()
  })

  await newUser.save()

  req.flash('success_msg', 'You are now registered and can login')
  res.redirect('/user/login')
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/user/login',
    failureFlash: true
  })(req, res, next)
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You are logged out')
  res.redirect('/user/login')
})

module.exports = router