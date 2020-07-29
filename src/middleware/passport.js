const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({
      usernameField: 'email'
    }, async (email, password, done) => {
      try {
        const user = await User.findOne({
          email
        })
        if (!user) {
          return done(null, false, {
            message: 'That email is not registered'
          })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
          return done(null, false, {
            message: 'Password incorrect'
          })
        }

        if (isMatch) {
          return done(null, user)
        }
      } catch (e) {
        console.log(e)
      }
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}