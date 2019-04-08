
const express = require("express");
const http = require("http")
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const validator = require("express-validator");
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const flash = require("connect-flash");
const passport = require("passport");
const socketIO = require("socket.io");

require("./passport/passport-local");
require("./passport/passport-facebook");
require("./passport/passport-google");

// require routes
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const adminRoute = require("./routes/admin");
const groupRoute = require("./routes/group");
const homeRoute = require("./routes/home");

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
require("./socket/groupChat")(io);
require("./socket/friend")(io);
const PORT = process.env.PORT || 8010;

// connect to database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true },  () => {
    console.log("Database connected");
});
mongoose.connection.on("error", error => {
    console.log(`Database connect error: ${error}`);
});

// middlewares
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(validator());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// static file
app.use(express.static("public"));


app.use('/', usersRoute);
app.use('/', authRoute);
app.use('/', adminRoute);
app.use('/', homeRoute);
app.use('/', groupRoute);




server.listen(PORT, () => console.log(`Server listen on port ${PORT}`));