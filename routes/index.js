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

router.get("/account", authController.isLoggedIn, userController.account);
router.post("/account/forgot", catchErrors(authController.forgot));
router.get("/account/reset/:token", catchErrors(authController.reset));
router.post("/account/reset/:token", authController.confirmedPasswords, catchErrors(authController.update));
router.get("/account/edit", authController.isLoggedIn, userController.editAccount);
router.post(
  "/account/edit",
  authController.isLoggedIn,
  mainController.upload,
  catchErrors(mainController.resize),
  catchErrors(userController.updateAccount)
);

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
router.get("/organism/id/:id", catchErrors(orgaController.getOrgaById));

/* Events */

router.get("/events", eventController.eventsPage);
router.post("/events", eventController.eventsPage);
router.get(
  "/events/add",
  authController.isLoggedIn,
  catchErrors(userController.hasOrganism),
  eventController.addEventPage
);
router.post(
  "/events/add",
  authController.isLoggedIn,
  catchErrors(userController.hasOrganism),
  mainController.upload,
  catchErrors(mainController.resize),
  catchErrors(eventController.create)
);
router.get("/event/:slug", catchErrors(eventController.getEventBySlug));

/* Search */

//router.post("/recherche", eventController.eventsPage);
//router.get("/recherche/page/:page", catchErrors(eventController.getSearchResult));

/* API */

router.get("/api/organisms", authController.isLoggedIn, catchErrors(orgaController.getOrganisms));
router.get("/api/events", authController.isLoggedIn, catchErrors(eventController.getEvents));
router.get("/api/search", catchErrors(eventController.getSearchResult));
//router.get("/api/search/orga/:id", catchErrors(orgaController.getOrgaById));

module.exports = router;
