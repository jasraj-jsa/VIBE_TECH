var express = require('express');
var router = express.Router();
const ContentBasedRecommender = require('content-based-recommender');
const bodyParser = require("body-parser");
router.use(bodyParser.json());

router.route("/:username")
    .post((req, res, next) => {
        const recommender = new ContentBasedRecommender({
            minScore: 0.1,
            maxSimilarDocuments: 25
        });
        const documents = req.body.allheadings;
        const documents1 = req.body.alldesc;
        recommender.train(documents);
        const similar1 = recommender.getSimilarDocuments(req.params.username, 0);
        recommender.train(documents1);
        const similar2 = recommender.getSimilarDocuments(req.params.username, 0);
        var s1 = similar1;
        var output = s1.filter(value => similar2.includes(value));
        if (output.length == 0) {
            if (similar2.length == 0) {
                if (similar1.length == 0) {
                    res.status(200).json({ output: "" });
                }
                else {
                    res.status(200).json({ output: similar1 });
                }
            }
            else {
                res.status(200).json({ output: similar2 })
            }
        }
        else {
            res.status(200).json({ output: output });
        }
    })

module.exports = router;