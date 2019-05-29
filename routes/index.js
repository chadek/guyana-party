const express = require('express')

const router = express.Router() // eslint-disable-line babel/new-cap
const mainController = require('../controllers/mainController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const orgaController = require('../controllers/orgaController')
const eventController = require('../controllers/eventController')
const { catchErrors } = require('../handlers/errorHandlers')

/* Main */

router.get('/', mainController.homePage)
router.get('/login', userController.loginForm)
router.get('/logout', authController.logout)
router.post('/login', authController.preLogin, authController.login)
router.get('/signup', userController.signupForm)
router.post(
  '/signup',
  userController.validateRegister,
  catchErrors(userController.register),
  authController.login
)
router.get('/forgot', userController.forgotForm)
router.post('/forgot', catchErrors(authController.forgot))
router.get('/reset/:token', catchErrors(authController.reset))
router.post(
  '/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
)

/* Account */

router.get('/account', authController.isLoggedIn, userController.account)
router.get(
  '/account/edit',
  authController.isLoggedIn,
  userController.editAccount
)
router.post(
  '/account/edit',
  authController.isLoggedIn,
  mainController.upload,
  catchErrors(mainController.resize),
  catchErrors(userController.updateAccount)
)
router.get(
  '/accounts/:id/remove',
  authController.isLoggedIn,
  catchErrors(userController.remove)
)

/* Organisms */

router.get('/organisms/add', authController.isLoggedIn, orgaController.addPage)
router.post(
  '/organisms/add',
  authController.isLoggedIn,
  mainController.upload,
  catchErrors(mainController.resize),
  catchErrors(orgaController.create)
)
router.post(
  '/organisms/add/:id',
  authController.isLoggedIn,
  catchErrors(orgaController.isAdmin),
  mainController.upload,
  catchErrors(mainController.resize),
  catchErrors(orgaController.updateOrga)
)
router.get(
  '/organisms/:id/edit',
  authController.isLoggedIn,
  catchErrors(orgaController.isAdmin),
  catchErrors(orgaController.editOrgaPage)
)
router.get(
  '/organisms/:id/remove',
  authController.isLoggedIn,
  catchErrors(orgaController.isAdmin),
  catchErrors(orgaController.remove)
)
router.get('/organism/:slug', catchErrors(orgaController.getOrgaBySlug))
router.get('/organism/id/:id', catchErrors(orgaController.getOrgaById))
// Demande d'adhésion
router.get(
  '/organism/:id/community/add',
  authController.isLoggedIn,
  catchErrors(orgaController.addPendingRequest)
)
// Retirer demande d'adhésion
router.get(
  '/organism/:id/community/remove',
  authController.isLoggedIn,
  catchErrors(orgaController.removePendingRequest)
)
// Quit the group
router.get(
  '/organism/:id/community/quit',
  authController.isLoggedIn,
  catchErrors(orgaController.isAdmin),
  catchErrors(orgaController.quitRequest)
)

router.get(
  '/organism/:id/community/:userId/accept',
  authController.isLoggedIn,
  catchErrors(orgaController.isAdmin),
  catchErrors(orgaController.acceptPendingRequest)
)
router.get(
  '/organism/:id/community/:userId/deny',
  authController.isLoggedIn,
  catchErrors(orgaController.isAdmin),
  catchErrors(orgaController.denyPendingRequest)
)

router.get(
  '/organism/:id/community/:userId/grant',
  authController.isLoggedIn,
  catchErrors(orgaController.isAdmin),
  catchErrors(orgaController.grantPendingRequest)
)

router.get(
  '/organism/:id/community/:userId/giveadminright',
  authController.isLoggedIn,
  catchErrors(orgaController.isAdmin),
  catchErrors(orgaController.giveAdminRightRequest)
)

router.get(
  '/organism/:id/community/:userId/removeadminright',
  authController.isLoggedIn,
  orgaController.isAdmin,
  orgaController.hasMoreThanOneAdmins,
  catchErrors(orgaController.removeAdminRightRequest)
)

/* Events */

router.get(
  '/events/add',
  authController.isLoggedIn,
  catchErrors(userController.hasOrganism),
  eventController.addPage
)
router.post(
  '/events/add',
  authController.isLoggedIn,
  catchErrors(userController.hasOrganism),
  mainController.upload,
  catchErrors(mainController.resize),
  catchErrors(eventController.create)
)
router.post(
  '/events/add/:id',
  authController.isLoggedIn,
  catchErrors(eventController.isAdmin),
  mainController.upload,
  catchErrors(mainController.resize),
  catchErrors(eventController.updateEvent)
)
router.get(
  '/events/:id/edit',
  authController.isLoggedIn,
  catchErrors(eventController.isAdmin),
  catchErrors(eventController.editEventPage)
)
router.get(
  '/events/:id/publish',
  authController.isLoggedIn,
  catchErrors(eventController.isAdmin),
  catchErrors(eventController.publish)
)
router.get(
  '/events/:id/gopublic',
  authController.isLoggedIn,
  catchErrors(eventController.isAdmin),
  catchErrors(eventController.goPublic)
)
router.get(
  '/events/:id/remove',
  authController.isLoggedIn,
  catchErrors(eventController.isAdmin),
  catchErrors(eventController.remove)
)
router.get('/event/:slug', catchErrors(eventController.getEventBySlug))

/* API */

router.get('/api/organisms', catchErrors(orgaController.getOrganisms))
router.get('/api/events', catchErrors(eventController.getEvents))
router.get('/api/search', catchErrors(eventController.getSearchResult))
router.get(
  '/api/isNameAvailable/:name',
  catchErrors(userController.isNameAvailable)
)

module.exports = router
