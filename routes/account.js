const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { catchErrors } = require("../handlers/errorHandlers");

router.get("/", authController.isLoggedIn, userController.account);
//router.post("/account", catchErrors(userController.updateAccount));
router.post("/forgot", catchErrors(authController.forgot));
router.get("/reset/:token", catchErrors(authController.reset));
router.post("/reset/:token", authController.confirmedPasswords, catchErrors(authController.update));

module.exports = router;
