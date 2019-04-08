const Club = require('../models/clubs');
const formidable = require('formidable');
const path = require("path");
const fs = require("fs");
// Get

module.exports.dashboard = (req, res) => {
    res.render("admin/dashboard");
}

// Post

module.exports.adminSaveClub = (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = path.join(__dirname, '../public/uploads');

    form.parse(req, (err, fields, files) => {
        if(err) {
            console.log(err);
        } else {
            const newClub = new Club(fields);
            if(files) {
                fs.rename(files.upload.path, path.join(form.uploadDir, files.upload.name), err => {
                    console.log("Success");
                });
                newClub.image = files.upload.name;
            }
            newClub.save( err => {
                res.render("admin/dashboard");
            })
        }
    });
}


