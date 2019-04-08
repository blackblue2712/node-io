const passport = require("passport");
const User = require("../models/users");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const secret = require("../secret/secret-file");
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {  
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use("google", new GoogleStrategy({
    clientID: secret.google.clientID,
    clientSecret: secret.google.clientSecret,
    callbackURL: 'http://localhost:8010/auth/google/callback',
    passReqToCallBack: true
}, (accessToken, refreshToken, profile, done) => {
    User.findOne( {google: profile.id} , (err, user) => {
        if(err) {
            return done(err);
        }

        if(user) {
            return done(null, user);
        } else {
            const newUser = new User();
            newUser.google = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email = profile._json.email;
            newUser.userImage = profile._json.picture
            newUser.googleTokens.push({token: accessToken});

            newUser.save(err => {
                if(err) return done(err);
                return done(null, user);
            })
        }

        
    });
}));