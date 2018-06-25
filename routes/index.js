const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const orgaController = require("../controllers/orgaController");
const eventController = require("../controllers/eventController");
const subscriptionController = require("../controllers/subscriptionController");
const { catchErrors } = require("../handlers/errorHandlers");

/* Main */

router.get("/", mainController.homePage);
router.get("/login", userController.loginForm);
router.get("/logout", authController.logout);
router.post("/login", authController.preLogin, authController.login);
router.get("/signup", userController.signupForm);
router.post("/signup", userController.validateRegister, catchErrors(userController.register), authController.login);
router.get("/forgot", userController.forgotForm);
router.post("/forgot", catchErrors(authController.forgot));
router.get("/reset/:token", catchErrors(authController.reset));
router.post("/reset/:token", authController.confirmedPasswords, catchErrors(authController.update));

/* Subscriptions */

router.get("/souscriptions", subscriptionController.subscriptionsPage);
router.get(
  "/souscriptions/free",
  authController.isLoggedIn,
  catchErrors(subscriptionController.selectFreeSubscription)
);
router.get(
  "/souscriptions/payment/:subscription",
  authController.isLoggedIn,
  subscriptionController.subscriptionPaymentPage
);

/* Account */

router.get("/account", authController.isLoggedIn, userController.account);
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
router.get("/organisms/:id/edit", authController.isLoggedIn, catchErrors(orgaController.editOrga));
router.get("/organism/:slug", catchErrors(orgaController.getOrgaBySlug));
router.get("/organism/id/:id", catchErrors(orgaController.getOrgaById));

/* Events */

router.get("/events", eventController.eventsPage);
router.post("/events", eventController.eventsPage);
router.get("/events/add", authController.isLoggedIn, catchErrors(userController.hasOrganism), eventController.addPage);
router.post(
  "/events/add",
  authController.isLoggedIn,
  catchErrors(userController.hasOrganism),
  mainController.upload,
  catchErrors(mainController.resize),
  catchErrors(eventController.create)
);
router.post(
  "/events/add/:id",
  authController.isLoggedIn,
  catchErrors(userController.hasOrganism),
  mainController.upload,
  catchErrors(mainController.resize),
  catchErrors(eventController.updateEvent)
);
router.get("/events/:id/edit", authController.isLoggedIn, catchErrors(eventController.editEvent));
router.get("/event/:slug", catchErrors(eventController.getEventBySlug));

/* API */

router.get("/api/organisms", authController.isLoggedIn, catchErrors(orgaController.getOrganisms));
router.get("/api/events", authController.isLoggedIn, catchErrors(eventController.getEvents));
router.get("/api/search", catchErrors(eventController.getSearchResult));

module.exports = router;
