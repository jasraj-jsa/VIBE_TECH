var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const googleIt = require('google-it');
router.route('/')
    .post((req, response, next) => {
        googleIt({ query: "Ideas related to " + req.body.query })
            .then(ideas => {
                googleIt({ query: "Problems related to " + req.body.query })
                    .then(problems => {

                        var output = {};
                        output.ideas = ideas;
                        output.problems = problems;
                        response.status(200).json({ output: output });
                    })
                    .catch(err => console.log(err))
            })
            .catch(e => {
                console.log(e);
                // any possible errors that might have occurred (like no Internet connection)
            });
        next();
    })


module.exports = router;