var express = require('express');
var router = express.Router();
const Users = require("../models/users");
const Posts = require("../models/posts");
const bodyParser = require("body-parser");
const uuidv4 = require("uuid/v4")
const http = require('http');
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
            .then(async(user) => {
                if (user.length == 0) {
                    res.status(400)
                        .json({ error: "Username doesn't exist" });
                    next();
                }
                else {
                    const data = JSON.stringify({
                        "heading": req.body.heading,
                        "description": req.body.description,
                        "username": req.params.username,
                        "id": uuidv4()
                      });
                    const options = {
                        hostname: "localhost",
                        port: 7000,
                        path: '/indexDB',
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                      };
                    const my_request = await http.request(options, (response) => {
                    let data = '';
                    response.on('data', (chunk) => {
                        data += chunk;
                    });
                
                    response.on('end', () => {
                        Posts.create({ heading: req.body.heading, description: req.body.description })
                        .then((p) => {
                            user.posts.push(p._id);
                            user.save();
                            res.status(200).json({});
                        })
                        .catch((err) => console.log(err));
                        // console.log('Body: ', data);
                    });
                
                    }).on("error", (err) => {
                    console.log("Error: ", err.message);
                    });
                    my_request.write(data);
                    my_request.end();
                

                    
                }
            })
            .catch(err => console.log(err));
    })

router.route("/:username/:postId")
    .delete((req, res, next) => {
        Posts.findByIdAndDelete({ _id: req.params.postId })
            .then(() => {
                Users.findOne({ username: req.params.username })
                    .then((user) => {
                        user.posts = user.posts.filter((item) => {
                            return item != req.params.postId;
                        })
                        user.save();
                        res.status(200).json({});
                        next();
                    })
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