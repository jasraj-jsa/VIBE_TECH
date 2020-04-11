const GSR = require('google-search-results-nodejs');
let client = new GSR.GoogleSearchResults("secret_api_key")
var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.route('/')
    .post((req, res, next) => {
        res.statusCode = 200;
        var parameter = {
            engine: "google",
            q: "Coffee",
            location: "Delhi, India",
            google_domain: "google.co.in",
            gl: "in",
            hl: "hi",
        };

        var callback = (data) => {
            console.log(data);
        }

        // Show result as JSON
        client.json(parameter, callback);
        next();
    })


module.exports = router;