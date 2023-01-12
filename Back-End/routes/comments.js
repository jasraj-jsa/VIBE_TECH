var express = require('express');
var router = express.Router();
const Posts = require("../models/posts");
const Comments = require("../models/comments");
const bodyParser = require("body-parser");
const http = require('http');
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
            .then(async(post) => {
                if (post.length == 0) {
                    res.status(400)
                        .json({ error: "Post doesn't exist" });
                    next();
                }
                else {
                    const data = JSON.stringify({
                        "comment": req.body.comment
                      });
                    const options = {
                        hostname: "localhost",
                        port: 6000,
                        path: '/getSentimentForComment',
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                      };
                    
                    const my_request = await http.request(options, (response) => {
                    let data = '';
                
                    // console.log('Status Code:', response.statusCode);
                
                    response.on('data', (chunk) => {
                        data += chunk;
                    });
                
                    response.on('end', () => {
                        Comments.create({ comment: req.body.comment, postedBy: req.body.postedBy,type: data })
                        .then((c) => {
                            post.comments.push(c._id);
                            post.save();
                            res.status(200)
                                .json({});
                            next();
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

module.exports = router;