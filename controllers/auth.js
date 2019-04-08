// Get
module.exports.getSignin = (req, res) => {
    const errors = req.flash("error");
    res.render("auth/signin", {title: "Login", message: errors, hasError: errors.length > 0});
}

module.exports.getSignup = (req, res) => {
    const errors = req.flash("error");
    res.render("auth/signup", {title: "Register", message: errors, hasError: errors.length > 0});
}

// Post
