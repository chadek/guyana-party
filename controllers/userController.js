const mongoose = require('mongoose')
const { promisify } = require('es6-promisify')
const store = require('store')
const slug = require('slugs')

const User = mongoose.model('User')
const Organism = mongoose.model('Organism')

exports.loginForm = (req, res) =>
  res.render('login', { title: 'Se connecter', csrfToken: req.csrfToken() })

exports.signupForm = (req, res) =>
  res.render('signup', {
    title: 'Créer un compte',
    csrfToken: req.csrfToken()
  })

exports.forgotForm = (req, res) =>
  res.render('forgot', {
    title: 'Réinitialiser votre mot de passe',
    csrfToken: req.csrfToken()
  })

exports.validateRegister = (req, res, next) => {
  store.set('signup-form-data', req.body) // store body to prefill the register form
  req.sanitizeBody('name')
  req
    .checkBody('name', 'Vous devez saisir un nom.')
    .notEmpty()
    .isLength({ min: 5, max: 50 })
  req.checkBody('email', 'E-mail incorrect.').isEmail()
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  })
  req.checkBody('password', 'Vous devez saisir un mot de passe.').notEmpty()
  req
    .checkBody('password-confirm', 'Vous devez confirmer le mot de passe.')
    .notEmpty()
  req
    .checkBody('password-confirm', 'Les mots de passe ne correspondent pas.')
    .equals(req.bodyString('password'))

  const errors = req.validationErrors()
  if (errors) {
    store.set('form-errors', errors.map(err => err.param))
    req.flash('error', errors.map(err => err.msg))
    return res.redirect('/signup')
  }
  next() // there were no errors!
}

exports.register = async (req, res, next) => {
  const user = new User({
    email: req.bodyEmail('email'),
    name: req.bodyString('name'),
    slug: slug(req.bodyString('name'))
  })
  const register = promisify(User.register.bind(User))
  await register(user, req.bodyString('password'))
  next() // pass to authController.login
}

exports.account = (req, res) => {
  store.clearAll() // clear all data stored
  res.render('account', { title: 'Votre compte', csrfToken: req.csrfToken() })
}

exports.hasOrganism = async (req, res, next) => {
  const orga = await Organism.findOne({
    author: req.user._id,
    status: { $regex: '^((?!archived).)*$', $options: 'i' }
  })
  if (!orga) {
    req.flash(
      'error',
      'Vous devez créer un groupe avant de créer votre évènement.'
    )
    res.redirect('/organisms/add')
    return
  }
  next()
}

// exports.hasSubscription = async (req, res, next) => {
//   const user = await User.findOne({
//     _id: req.user._id,
//     $where: function() {
//       return ["free", "asso", "pro", "complete"].includes(this.subscription);
//     }
//   });
//   if (!user) {
//     req.flash("error", "Choisissez une souscription pour la création de votre organisme.");
//     res.redirect("/souscriptions");
//     return;
//   }
//   next();
// };

exports.editAccount = (req, res) => {
  let remove = false
  if (req.queryString('remove')) {
    remove = true
  }
  res.render('editAccount', {
    title: 'Edition de votre compte',
    csrfToken: req.csrfToken(),
    remove
  })
}

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.bodyString('name'),
    slug: slug(req.bodyString('name')),
    email: req.bodyEmail('email')
  }
  const photo = req.bodyString('photo')
  if (photo) {
    updates.photo = photo
  }
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  )
  req.flash('success', 'Compte mis à jour !')
  res.redirect('/account')
}

exports.remove = async (req, res, next) => {
  const user = await User.findOne({ _id: req.paramString('id') })
  if (!user) return next()
  // we can't remove a user account if we are not the owner
  if (!req.user._id.equals(user._id)) {
    throw Error('Vous ne pouvez pas effectuer cet action !')
  }
  await user.remove()
  req.flash('success', 'Votre compte a été supprimé.')
  res.redirect('/')
}

exports.isNameAvailable = async (req, res) => {
  let isNameAvailable = true
  const name = slug(req.paramString('name'))
  // We don't check if it's the same name
  if (req.user && req.user.slug === name) {
    return res.json({ isNameAvailable })
  }
  const user = await User.findOne(
    { slug: { $regex: `^${name}$`, $options: 'i' } },
    { _id: 1 }
  )
  if (user) {
    isNameAvailable = false
  }
  res.json({ isNameAvailable })
}
