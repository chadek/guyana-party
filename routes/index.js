const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const eventController = require("../controllers/eventController");
const { catchErrors } = require("../handlers/errorHandlers");

// Main
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

// Account
router.get("/account", authController.isLoggedIn, userController.account);
//router.post("/account", catchErrors(userController.updateAccount));
router.post("/account/forgot", catchErrors(authController.forgot));
router.get("/account/reset/:token", catchErrors(authController.reset));
router.post("/account/reset/:token", authController.confirmedPasswords, catchErrors(authController.update));

// Events
router.get("/events/", eventController.eventsPage);
router.get("/events/add",authController.isLoggedIn, eventController.addEventPage);
router.post("/events/add",
    authController.isLoggedIn,
    mainController.upload,
    catchErrors(mainController.resize),
    catchErrors(eventController.createEvent));
router.get("/event/:slug", catchErrors(eventController.getEventBySlug));

module.exports = router;
