const express = require("express");
const router = express.Router();

const {
    dashboard,
    adminSaveClub
} = require("../controllers/admin");

router.get('/dashboard', dashboard);

router.post('/dashboard', adminSaveClub);

module.exports = router;