var express = require('express');
var router = express.Router();
const Posts = require("../models/posts");
const Comments = require("../models/comments");
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.route('/:postId')
    .get((req, res, next) => {
        Posts.findById({ _id: req.params.postId }).populate('comments')
            .then((post) => {
                if (post.length == 0) {
                    res.status(400)
                        .json({ error: "Post doesn't exist" });
                    next();
                }
                else {
                    if (post.comments.length == 0) {
                        res.status(204)
                            .json({ comments: "NULL" });
                    }
                    else {
                        res.status(200)
                            .json({ comments: post.comments });
                        next();
                    }
                }
            })
    })
    .put((req, res, next) => {
        Posts.findById({ _id: req.params.postId }).populate('comments')
            .then((post) => {
                if (post.length == 0) {
                    res.status(400)
                        .json({ error: "Post doesn't exist" });
                    next();
                }
                else {
                    Comments.create({ comment: req.body.comment, postedBy: req.body.postedBy })
                        .then((c) => {
                            post.comments.push(c._id);
                            post.save();
                            res.status(200)
                                .json({});
                            next();
                        })
                        .catch((err) => console.log(err));
                }
            })
            .catch(err => console.log(err));
    })

module.exports = router;