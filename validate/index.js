

module.exports.userSignupValidator = (req, res, next) => {
    req.check("username", "User name is required").notEmpty();

    req.check("email", "Email is required").notEmpty();
    req.check("email")
        .matches(/.+\@.+\..+/)
        .withMessage("Invalid email")
        .isLength({min: 4, max: 32})
        .withMessage("Email must between 4 to 32 characters");

    // check for password
	req.check('password', 'Password is required').notEmpty();
	req.check('password')
	.isLength({min: 6})
	.withMessage('Password must contain at least 6 characters')
	.matches(/\d/)
    .withMessage('Password must has a number');
    
    req.getValidationResult()
    .then( result => {
        const errors = result.array();
        if(errors.length > 0) {
            req.flash("error", errors.map(err => err.msg)[0]);
            res.redirect("/signup");
        }
        next();
    })
    .catch(err => {
        // process to the next middleware
        next();    
    })
}

module.exports.userSigninValidator = (req, res, next) => {
    req.check("email", "Email is required").notEmpty();

    // check for password
    req.check('password', 'Password is required').notEmpty();
    
    req.getValidationResult()
    .then( result => {
        const errors = result.array();
        if(errors.length > 0) {
            req.flash("error", errors.map(err => err.msg)[0]);
            res.redirect("/signin");
        }
        next();
    })
    .catch(err => {
        // process to the next middleware
        next();    
    })
}