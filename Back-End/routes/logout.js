var express = require('express');
var router = express.Router();
var Users = require('../models/users');

router.route('/')
    .get((req, res, next) => {
        Users.findOne({ username: 'admin' })
            .then((user) => {
                if (user.length == 0) {
                    res.statusCode = 400;
                    res.send();
                    next();
                }
                else {
                    Users.findByIdAndUpdate({ _id: user._id }, { loggedIn: false, currentUser: '' }, { new: true }, (err, model) => {
                        if (err)
                            console.log(err);
                        res.statusCode = 200;
                        res.send();
                        next();
                    });
                }
            })
    })

module.exports = router;