const jwt = require('jsonwebtoken');
const secret = "SUIT_UP!";
const Users = require("../models/users");
const withAuth = function (req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                Users.find({ username: 'admin' })
                    .then((users) => {
                        if (users.length == 0) {
                            res.status(401).send('Unauthorized: Invalid token');
                        }
                        else {
                            if (users[0].loggedIn) {
                                Users.findByIdAndUpdate({ _id: users[0]._id }, { currentUser: decoded.username }, { new: true }, (err, callback) => { });
                                req.username = decoded.username;
                                next();
                            }
                            else {
                                res.status(401).send('Unauthorized: Invalid token');
                            }
                        }
                    })
            }
        });
    }
}
module.exports = withAuth;