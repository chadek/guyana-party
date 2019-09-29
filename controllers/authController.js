const { check, validationResult } = require('express-validator')
const passport = require('passport')
const crypto = require('crypto')
const mongoose = require('mongoose')
const store = require('store')
const mail = require('../handlers/mail')

const User = mongoose.model('User')

// function checkEmail (req, res) {
//   req.checkBody('email', 'E-mail incorrect.').isEmail()
//   req.sanitizeBody('email').normalizeEmail({
//     remove_dots: false,
//     remove_extension: false,
//     gmail_remove_subaddress: false
//   })
//   const errors = req.validationErrors()
//   if (errors) {
//     store.set('form-errors', errors.map(err => err.param))
//     req.flash('error', errors.map(err => err.msg))
//     return false
//   }
//   return true
// }

const checkEmail = req => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    store.set('form-errors', result.errors.map(err => err.param))
    req.flash('error', result.errors.map(err => err.msg))
    return false
  }
  return true
}

exports.emailValidator = [
  check('email', 'E-mail incorrect.')
    .isEmail()
    .normalizeEmail({
      remove_dots: false,
      remove_extension: false,
      gmail_remove_subaddress: false
    })
]

exports.preLogin = (req, res, next) => {
  store.set('login-form-data', req.body) // store body to prefill the login form
  if (!checkEmail(req)) return res.redirect('/login')
  next()
}

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Connexion échouée !',
  successRedirect: '/account',
  successFlash: 'Connexion réussie !'
})

exports.logout = (req, res) => {
  req.logout()
  req.session.destroy(e => res.redirect('/'))
}

exports.isLoggedIn = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated()) {
    next() // carry on! They are logged in!
    return
  }
  req.flash('error', 'Vous devez être connecté(e) pour voir cette page !')
  res.redirect('/login')
}

exports.forgot = async (req, res) => {
  store.set('forgot-form-data', req.body)
  if (!checkEmail(req)) return res.redirect('/forgot')

  // 1. See if a user with that email exists
  const user = await User.findOne({ email: req.bodyEmail('email') })
  if (user) {
    // 2. Set reset tokens and expiry on their account
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex')
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour from now
    await user.save()
    // 3. Send them an email with the token
    const resetURL = `http://${req.headerString('host')}/reset/${
      user.resetPasswordToken
    }`
    await mail.send({
      user,
      subject: 'Réinitialisation de votre mot de passe',
      resetURL,
      filename: 'password-reset'
    })
  }
  // 4. flash the message
  req.flash(
    'success',
    `Un email vient de vous être envoyé à ${req.bodyEmail(
      'email'
    )}. Cet email contient un lien vous permettant de récupérer votre mot de passe.`
  )
  // 5. redirect to login page
  res.redirect('/login')
}

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.paramString('token'),
    resetPasswordExpires: { $gt: Date.now() }
  })
  if (!user) {
    req.flash(
      'error',
      'Le lien de récupération du mot de passe est invalide ou a expiré.'
    )
    return res.redirect('/login')
  }
  // if there is a user, show the reset password form
  res.render('reset', {
    title: 'Réinitialisez votre mot de passe',
    csrfToken: req.csrfToken()
  })
}

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.bodyString('password-confirm')) {
    next() // keepit going!
    return
  }
  req.flash('error', 'Les mots de passe ne correspondent pas !')
  res.redirect('back')
}

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.paramString('token'),
    resetPasswordExpires: { $gt: Date.now() }
  })
  if (!user) {
    req.flash(
      'error',
      'Le lien de récupération du mot de passe est invalide ou a expiré.'
    )
    return res.redirect('/login')
  }
  await user.setPassword(req.bodyString('password'))
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  const updatedUser = await user.save()
  await req.login(updatedUser)
  req.flash(
    'success',
    'Votre mot de passe a été réinitialisé ! Vous êtes maintenant connecté(e) !'
  )
  res.redirect('/')
}
