var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const Users = require("../models/users");
const jwt = require('jsonwebtoken');
const secret = "SUIT_UP!";
router.route("/authenticate")
  .post((req, res) => {

    const { username, password } = req.body;
    Users.findOne({ username }, function (err, user) {
      if (err) {
        res.status(500)
          .json({
            error: 'Internal error please try again'
          });
      } else if (!user) {
        res.status(401)
          .json({
            error: 'Incorrect username or password'
          });
      } else {
        user.isCorrectPassword(user.password, password, (err, same) => {
          if (err) {
            console.log(err);
            res.status(500)
              .json({
                error: 'Internal error please try again'
              });
          } else if (!same) {
            res.status(401)
              .json({
                error: 'Incorrect username or password'
              });
          } else {
            // Issue token
            Users.findOne({ username: 'admin' })
              .then((userlog) => {
                Users.findByIdAndUpdate({ _id: userlog._id }, { loggedIn: true }, { new: true }, (err, model) => {
                  const payload = { username };
                  const token = jwt.sign(payload, secret, {
                    expiresIn: '1h'
                  });
                  res.cookie('token', token, { httpOnly: true })
                    .sendStatus(200);
                });
              });

          }
        });
      }
    });
  });
router.route("/")
  .get((req, res, next) => {
    Users.find({})
      .then((users) => {
        var o = []
        for (var i = 0; i < users.length; i++)
          o.push(users[i])
        res.status(200).json({ users: o });
        next();
      })
  })
  .delete((req, res, next) => {
    Users.remove({})
      .then(() => {
        res.statusCode = 200;
        res.send();
        next();
      })
  })
router.route("/register")
  .all((req, res, next) => {
    Users.find({ username: 'admin' })
      .then((users) => {
        if (users.length == 0) {
          Users.create({ username: 'admin', password: 'weak_password' });
        }
        next();
      })
  })
  .post((req, res, next) => {
    Users.find({ username: req.body.newUser })
      .then((user) => {
        if (user.length != 0) {
          res.statusCode = 400;
          res.send();
          next();
        }
        else {
          Users.create({ username: req.body.newUser, password: req.body.newPassword }).then((user) => {
            res.statusCode = 201;
            res.send();
            next();
          });
        }
      })
  });
router.route("/:username")
  .get((req, res, next) => {
    Users.findOne({ username: req.params.username })
      .then((user) => {
        res.status(200).json({ user: user });
      })
  })
  .put((req, res, next) => {
    Users.find({ username: { $regex: req.params.username, $options: "i" } })
      .then((users) => {
        if (users.length == 0) {
          res.status(200).json({ error: "No users" });
        }
        else {
          users = users.filter(function (item) {
            if (item.request.length != 0)
              return !((item.request).includes(req.body.current));
            else
              return item;
          });
          if (users.length == 0) {
            res.status(200).json({ error: "No users" });
          }
          else {
            users = users.filter(function (item) {
              if (item.requestsSent.length != 0)
                return !((item.requestsSent).includes(req.body.current));
              else
                return item;
            });
            if (users.length == 0) {
              res.status(200).json({ error: "No users" });
            }
            else {
              users = users.filter(function (item) {
                if (item.friends.length != 0)
                  return !item.friends.includes(req.body.current);
                else
                  return item;
              });
              if (users.length == 0) {
                res.status(200).json({ error: "No users" });
              }
              else {
                res.status(200).json({ users: users, error: "" });
              }
            }
          }

          next();
        }
      })
      .catch((err) => console.log(err));
  });
router.route("/:username/friends")
  .get((req, res, next) => {                                //Get all friends of a particular user
    Users.findOne({ username: req.params.username })
      .then((user) => {
        if (user.friends.length == 0) {
          res.status(200).json({ friends: "" });
          next();
        }
        else {
          if (user.request.length != 0) {
            user.friends = user.friends.filter(function (item) {
              return !user.request.includes(item.username);
            });
          }
          if (user.friends.length == 0) {
            res.status(200).json({ friends: "" });
            next();
          }
          else {
            if (user.requestsSent.length != 0) {
              user.friends = user.friends.filter(function (item) {
                return !user.requestsSent.includes(item.username);
              });
            }
            if (user.friends.length == 0) {
              res.status(200).json({ friends: "" });
              next();
            }
            else {
              res.status(200).json({ friends: user.friends });
            }
          }

          next();
        }
      })
      .catch((err) => console.log(err));
  })
  .put((req, res, next) => {
    Users.findOne({ username: req.params.username })
      .then((user) => {
        var flag = 0;
        for (var i = 0; i < user.friends.length; i++) {
          if (user.friends[i] == req.body.username) {
            flag = 1;
            break;
          }
        }
        if (flag == 0) {
          user.friends.push(req.body.username);
          user.save();
        }
        Users.findOne({ username: req.body.username })
          .then((user) => {
            for (var i = 0; i < user.friends.length; i++) {
              if (user.friends[i] == req.params.username) {
                flag = 1;
                break;
              }
            }
            if (flag == 0) {
              user.friends.push(req.params.username);
              user.save();
            }
            res.status(200).json({});
          })
          .catch(err => console.log(err));
      })
  })
  .delete((req, res, next) => {
    Users.findOne({ username: req.params.username })
      .then((user) => {
        user.friends = (user.friends).filter((item) => { return (item != req.body.username) });
        user.save();
        Users.findOne({ username: req.body.username })
          .then((user) => {
            user.friends = user.friends.filter((item) => { return item != req.params.username });
            user.save();
            res.status(200).json({});
          })
          .catch(err => console.log(err));
      })
  });


router.route("/:username/requestsSent")
  .get((req, res, next) => {
    Users.findOne({ username: req.params.username })
      .then((user) => {
        res.status(200).json({ requestsSent: user.requestsSent, requests: user.request });
        next();

      })
      .catch((err) => console.log(err));
  })
  .post((req, res, next) => {
    Users.findOne({ username: req.params.username })
      .then((user) => {
        var flag = 0;
        for (var i = 0; i < user.requestsSent.length; i++) {
          if (user.requestsSent[i] == req.body.username) {
            flag = 1;
            break;
          }
        }
        if (flag == 0) {
          user.requestsSent.push(req.body.username);
          user.save();
        }
        Users.findOne({ username: req.body.username })
          .then((user) => {
            for (var i = 0; i < user.request.length; i++) {
              if (user.request[i] == req.params.username) {
                flag = 1;
                break;
              }
            }
            if (flag == 0) {
              user.request.push(req.params.username);
              user.save();
            }
            res.status(200).json({});
          })
          .catch(err => console.log(err));
      })
  })
  .delete((req, res, next) => {
    Users.findOne({ username: req.params.username })
      .then((user) => {
        user.request = (user.request).filter((item) => { return (item != req.body.username) });
        user.save();
        Users.findOne({ username: req.body.username })
          .then((us) => {
            us.requestsSent = us.requestsSent.filter((item) => { return item != req.params.username });
            us.save();
            res.status(200).json({});
          })
          .catch(err => console.log(err));
      })
  })

router.route("/:username/bio")
  .put((req, res, next) => {
    console.log("body:" + req.body);
    Users.findOne({ username: req.params.username })
      .then((user) => {
        user.bio = req.body.bio;
        user.save();
        res.status(200).json({});
      })
  })




module.exports = router;