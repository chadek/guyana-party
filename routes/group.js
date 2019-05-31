const express = require('express')
const mainController = require('../controllers/mainController')
const authController = require('../controllers/authController')
const groupController = require('../controllers/groupController')
const { catchErrors } = require('../handlers/errorHandlers')

const router = express.Router() // eslint-disable-line babel/new-cap

// route: /group

router.get('/add', authController.isLoggedIn, groupController.addPage)
router.post(
  '/add',
  authController.isLoggedIn,
  mainController.upload,
  catchErrors(mainController.resize),
  catchErrors(groupController.create)
)
router.post(
  '/add/:id',
  authController.isLoggedIn,
  catchErrors(groupController.isAdmin),
  mainController.upload,
  catchErrors(mainController.resize),
  catchErrors(groupController.updateGroup)
)
router.get(
  '/:id/edit',
  authController.isLoggedIn,
  catchErrors(groupController.isAdmin),
  catchErrors(groupController.editGroupPage)
)
router.get(
  '/:id/remove',
  authController.isLoggedIn,
  catchErrors(groupController.isAdmin),
  catchErrors(groupController.remove)
)
router.get('/:slug', catchErrors(groupController.getGroupBySlug))
router.get('/id/:id', catchErrors(groupController.getGroupById))
// Demande d'adhésion
router.get(
  '/:id/community/add',
  authController.isLoggedIn,
  catchErrors(groupController.addPendingRequest)
)
// Retirer demande d'adhésion
router.get(
  '/:id/community/remove',
  authController.isLoggedIn,
  catchErrors(groupController.removePendingRequest)
)
// Quit the group
router.get(
  '/:id/community/quit',
  authController.isLoggedIn,
  catchErrors(groupController.hasMoreThanOneAdmins),
  catchErrors(groupController.quitRequest)
)

router.get(
  '/:id/community/:userId/accept',
  authController.isLoggedIn,
  catchErrors(groupController.isAdmin),
  catchErrors(groupController.acceptPendingRequest)
)
router.get(
  '/:id/community/:userId/deny',
  authController.isLoggedIn,
  catchErrors(groupController.isAdmin),
  catchErrors(groupController.denyPendingRequest)
)

router.get(
  '/:id/community/:userId/grant',
  authController.isLoggedIn,
  catchErrors(groupController.isAdmin),
  catchErrors(groupController.grantPendingRequest)
)

router.get(
  '/:id/community/:userId/giveadminright',
  authController.isLoggedIn,
  catchErrors(groupController.isAdmin),
  catchErrors(groupController.giveAdminRightRequest)
)

router.get(
  '/:id/community/:userId/removeadminright',
  authController.isLoggedIn,
  groupController.isAdmin,
  catchErrors(groupController.hasMoreThanOneAdmins),
  catchErrors(groupController.removeAdminRightRequest)
)

module.exports = router
