const express = require('express')
const mainController = require('../controllers/mainController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const groupController = require('../controllers/groupController')
const eventController = require('../controllers/eventController')
const { catchErrors } = require('../handlers/errorHandlers')

const router = express.Router() // eslint-disable-line babel/new-cap

// route: /

router.get('/', mainController.homePage)
router.get('/login', userController.loginForm)
router.get('/logout', authController.logout)
router.post(
  '/login',
  authController.emailValidator,
  authController.preLogin,
  authController.login
)
router.get('/signup', userController.signupForm)
router.post(
  '/signup',
  userController.validateRegister,
  catchErrors(userController.register),
  authController.login
)
router.get('/forgot', userController.forgotForm)
router.post(
  '/forgot',
  authController.emailValidator,
  catchErrors(authController.forgot)
)
router.get('/reset/:token', catchErrors(authController.reset))
router.post(
  '/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
)

/* API */

router.get('/api/groups', catchErrors(groupController.getGroups))
router.get('/api/admingroups', catchErrors(groupController.getAdminGroups))
router.get('/api/events', catchErrors(eventController.getEvents))
router.get('/api/search', catchErrors(eventController.getSearchResult))
router.get(
  '/api/isNameAvailable/:name',
  catchErrors(userController.isNameAvailable)
)

module.exports = router
