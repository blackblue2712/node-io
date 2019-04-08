const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
    getSignup,
    getSignin
} = require("../controllers/auth");
const { userSignupValidator, userSigninValidator } = require("../validate");

router.get("/signup", getSignup);
router.get("/signin", getSignin);

// facebook
router.get('/auth/facebook', passport.authenticate("facebook", {
    scope: "email"
}));
router.get('/auth/facebook/callback', passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true
}));

// google
router.get('/auth/google', passport.authenticate("google", {
    scope: ['profile', 'email']
}));
router.get('/auth/google/callback', passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true
}));

router.post("/signup", userSignupValidator, passport.authenticate("local.signup", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
}));

router.post("/signin", userSigninValidator, passport.authenticate("local.signin", {
    successRedirect: "/",
    failureRedirect: "/signin",
    failureFlash: true
}));


module.exports = router;