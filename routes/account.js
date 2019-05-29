const express = require('express')
const mainController = require('../controllers/mainController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const { catchErrors } = require('../handlers/errorHandlers')

const router = express.Router() // eslint-disable-line babel/new-cap

// route: /account

router.get('/', authController.isLoggedIn, userController.account)
router.get('/edit', authController.isLoggedIn, userController.editAccount)
router.post(
  '/edit',
  authController.isLoggedIn,
  mainController.upload,
  catchErrors(mainController.resize),
  catchErrors(userController.updateAccount)
)
router.get(
  '/:id/remove',
  authController.isLoggedIn,
  catchErrors(userController.remove)
)

module.exports = router
