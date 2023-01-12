const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var moment = require("moment");
const now = moment();
var CommentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    postedAt: {
        type: String,
        default: now.format("MMMM Do YYYY") + " " + now.format("h:mm:ss a")
    },
    postedBy: {
        type: String
    },
    type: {
        type: String,
        enum: ["positive", "negative", "neutral"],
        default: "neutral",
        required: true
    }

});

var Comments = mongoose.model("Comment", CommentSchema);
module.exports = Comments;