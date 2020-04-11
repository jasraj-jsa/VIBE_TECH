var express = require('express');
var router = express.Router();
const Users = require("../models/users");
router.route('/:username')
    .all((req, res, next) => {
        Users.find({ username: req.params.username })
            .then((users) => {
                if (users.length == 0) {
                    res.status(400)
                        .json({ error: "Username doesn't exist" });
                    next();
                }
                else {
                    if (users[0].friends.length == 0) {
                        res.status(204)
                            .json({ friends: NULL });
                    }
                    else {
                        res.status(200)
                            .json({ friends: users[0].friends });
                        next();
                    }
                }
            })
            .catch((err) => console.log(err));
    })

module.exports = router;