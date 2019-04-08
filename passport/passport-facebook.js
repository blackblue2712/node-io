const passport = require("passport");
const User = require("../models/users");
const FacebookStrategy = require('passport-facebook').Strategy;
const secret = require("../secret/secret-file");
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {  
    User.findById(id, (err, user) => {              // Tìm thấý err trả về null
        done(err, user);
    });
});

passport.use("facebook", new FacebookStrategy({
    clientID: secret.facebook.clientID,
    clientSecret: secret.facebook.clientSecret,
    profileFields: ['email', 'displayName', 'photos'],
    callbackURL: 'http://localhost:8010/auth/facebook/callback',
    passReqToCallBack: true
}, (accessToken, refreshToken, profile, done) => {
    User.findOne( {facebook: profile.id} , (err, user) => {
        if(err) {
            return done(err);
        }

        if(user) {
            return done(null, user);
        } else {
            const newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email = profile._json.email;
            newUser.userImage = `https://graph.facebook.com/${profile.id}/picture?type=large`;
            newUser.fbTokens.push({token: accessToken});

            newUser.save(err => {
                return done(null, user);
            })
        }

        
    });
}));