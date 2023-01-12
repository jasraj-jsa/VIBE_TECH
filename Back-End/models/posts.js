const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comments = require("../models/comments");
var moment = require("moment");
const now = moment();
var PostSchema = new Schema({
    heading: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    postedAt: {
        type: String,
        default: now.format("MMMM Do YYYY") + " " + now.format("h:mm:ss a")
    },
    comments: [{
        type: Schema.ObjectId,
        ref: Comments
    }],
    likedBy: {
        type: Array,
        default: []
    }


});

var Posts = mongoose.model("Post", PostSchema);
module.exports = Posts;