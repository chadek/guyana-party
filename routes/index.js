const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const orgaController = require("../controllers/orgaController");
const eventController = require("../controllers/eventController");
const { catchErrors } = require("../handlers/errorHandlers");

/* Main */

router.get("/", mainController.homePage);
router.get("/login", userController.loginForm);
router.get("/logout", authController.logout);
router.post("/login", authController.login);
router.post(
  "/register",
  mainController.upload,
  catchErrors(mainController.resize),
  userController.validateRegister,
  catchErrors(userController.register),
  authController.login
);

/* Account */

router.get("/account", authController.isLoggedIn, catchErrors(userController.account));
//router.post("/account", catchErrors(userController.updateAccount));
router.post("/account/forgot", catchErrors(authController.forgot));
router.get("/account/reset/:token", catchErrors(authController.reset));
router.post("/account/reset/:token", authController.confirmedPasswords, catchErrors(authController.update));

/* Organisms */

router.get("/organisms/add", authController.isLoggedIn, orgaController.addPage);
router.post(
  "/organisms/add",
  authController.isLoggedIn,
  mainController.upload,
  catchErrors(mainController.resize),
  catchErrors(orgaController.create)
);
router.get("/organism/:slug", catchErrors(orgaController.getOrgaBySlug));

/* Events */

router.get("/events/", eventController.eventsPage);
router.get("/events/add", authController.isLoggedIn, eventController.addEventPage);
router.post(
  "/events/add",
  authController.isLoggedIn,
  mainController.upload,
  catchErrors(mainController.resize),
  catchErrors(eventController.create)
);
router.get("/event/:slug", catchErrors(eventController.getEventBySlug));

/* API */

router.get("/api/organisms", authController.isLoggedIn, catchErrors(orgaController.getOrganisms));
router.get("/api/events", authController.isLoggedIn, catchErrors(eventController.getEvents));

module.exports = router;
