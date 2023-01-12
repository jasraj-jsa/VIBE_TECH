var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const http = require('http');
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
router.route('/VIBESearch')
    .post(async(req,res,next) => {
        const data = JSON.stringify({
            "description": req.body.query,
          });
        const options = {
            hostname: "localhost",
            port: 7000,
            path: '/indexDB',
            method: 'PUT',
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
                // res.status(200).json(data)
                if(data)
                res.status(200).json({"output": JSON.parse(data)})
                else
                res.status(200).json({"output": []})
                // console.log('Body: ', data);
            });
        
            }).on("error", (err) => {
            console.log("Error: ", err.message);
            });
            my_request.write(data);
            my_request.end();
    })


module.exports = router;