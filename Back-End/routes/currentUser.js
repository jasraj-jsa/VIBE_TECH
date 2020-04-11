var express = require('express');
var router = express.Router();
var Users = require("../models/users");
router.route("/")
    .all((req, res, next) => {
        Users.findOne({ username: 'admin' })
            .then((user) => {
                res.status(200)
                    .json({ body: user.currentUser });
            })
    })

module.exports = router;