// const mongoose = require('mongoose')
// const User = mongoose.model('User')
// const { promisify } = require('es6-promisify')

// exports.subscriptionsPage = (req, res) => {
//   res.render('subscriptions', {
//     title: 'Choisissez une souscription',
//     csrfToken: req.csrfToken()
//   })
// }

// exports.selectFreeSubscription = async (req, res) => {
//   const user = await User.findOneAndUpdate(
//     { _id: req.user._id },
//     { $set: { subscription: 'free' } },
//     { new: true, runValidators: true, context: 'query' }
//   )
//   req.flash(
//     'success',
//     "Bravo, vous venez de souscrire à l'offre Gratuite ! Commencez dès maintenant la création de votre organisme !"
//   )
//   res.redirect('/account')
// }

// exports.subscriptionPaymentPage = (req, res) => {
//   const subscription = req.paramString('subscription')
//   res.render('payment', {
//     title: 'Paiement de votre souscription',
//     subscription,
//     csrfToken: req.csrfToken()
//   })
// }
