const express = require("express");
const router = express.Router();

const {
    home,
    addFav
} = require("../controllers/home");


router.get('/', home);
router.post('/addFav', addFav);

module.exports = router;