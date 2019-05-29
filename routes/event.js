const express = require('express')
const mainController = require('../controllers/mainController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const eventController = require('../controllers/eventController')
const { catchErrors } = require('../handlers/errorHandlers')

const router = express.Router() // eslint-disable-line babel/new-cap

// route: /event

router.get(
  '/add',
  authController.isLoggedIn,
  catchErrors(userController.hasGroup),
  eventController.addPage
)
router.post(
  '/add',
  authController.isLoggedIn,
  catchErrors(userController.hasGroup),
  mainController.upload,
  catchErrors(mainController.resize),
  catchErrors(eventController.create)
)
router.post(
  '/add/:id',
  authController.isLoggedIn,
  catchErrors(eventController.isAdmin),
  mainController.upload,
  catchErrors(mainController.resize),
  catchErrors(eventController.updateEvent)
)
router.get(
  '/:id/edit',
  authController.isLoggedIn,
  catchErrors(eventController.isAdmin),
  catchErrors(eventController.editEventPage)
)
router.get(
  '/:id/publish',
  authController.isLoggedIn,
  catchErrors(eventController.isAdmin),
  catchErrors(eventController.publish)
)
router.get(
  '/:id/gopublic',
  authController.isLoggedIn,
  catchErrors(eventController.isAdmin),
  catchErrors(eventController.goPublic)
)
router.get(
  '/:id/remove',
  authController.isLoggedIn,
  catchErrors(eventController.isAdmin),
  catchErrors(eventController.remove)
)
router.get('/:slug', catchErrors(eventController.getEventBySlug))

module.exports = router
