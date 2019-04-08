const passport = require("passport");
const User = require("../models/users");
const flash = require("connect-flash");
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {  
    User.findById(id, (err, user) => {              // Tìm thấý err trả về null
        done(err, user);
    });
});

passport.use("local.signup", new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    console.log("Passport")
    User.findOne( {email: email} , (err, user) => {
        if(err) {
            return done(err);
        }

        if(user) {
            return done(null, false, req.flash("error", "User with that email already exist"));
        }

        const newUser = new User();
        newUser.username = req.body.username;
        newUser.fullname = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);
        debugger;
        newUser.save( err => {
            done(null, newUser);
        });
    });
}));


passport.use("local.signin", new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne( {email: email} , (err, user) => {
        if(err) {
            return done(err);
        }
        if(!user || !user.validUserPassword(password)) {
            console.log("error")
            return done(null, false, req.flash("error", "Email or passwrod invalid"));
        }

        return done(null, user);

    });
}));