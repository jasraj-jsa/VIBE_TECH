var express = require('express');
var router = express.Router();
const Users = require("../models/users");
const Posts = require("../models/posts");
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.route('/:username')
    .get((req, res, next) => {
        Users.findOne({ username: req.params.username }).populate('posts')
            .then((user) => {
                if (user.length == 0) {
                    res.status(400)
                        .json({ error: "Username doesn't exist" });
                    next();
                }
                else {
                    if (user.posts.length == 0) {
                        res.status(200)
                            .json({ body: "" });
                    }
                    else {
                        res.status(200)
                            .json({ body: user.posts });
                        next();
                    }
                }
            })
    })
    .put((req, res, next) => {
        Users.findOne({ username: req.params.username }).populate('posts')
            .then((user) => {
                if (user.length == 0) {
                    res.status(400)
                        .json({ error: "Username doesn't exist" });
                    next();
                }
                else {
                    Posts.create({ heading: req.body.heading, description: req.body.description })
                        .then((p) => {
                            user.posts.push(p._id);
                            user.save();
                            res.status(200).json({});
                        })
                        .catch((err) => console.log(err));
                }
            })
            .catch(err => console.log(err));
    })

router.route("/:username/:postId")
    .delete((req, res, next) => {
        Posts.findByIdAndDelete({ _id: req.params.postId })
            .then(() => {
                res.status(200).json({});
                next();
            })
            .catch(err => console.log(err));
    })
    .put((req, res, next) => {
        Posts.findById({ _id: req.params.postId })
            .then((post) => {
                post.likedBy.push(req.params.username);
                post.save();
                res.status(200).json({});
            })
    })

module.exports = router;