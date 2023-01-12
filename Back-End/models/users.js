const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const Posts = require("../models/posts");
var UserSchema = new Schema({
    username: {
        type: Schema.Types.Mixed
    },
    password: {
        type: Schema.Types.Mixed
    },
    loggedIn: {
        type: Boolean,
        default: false
    },
    currentUser: {
        type: Schema.Types.Mixed,
        default: ''
    },
    friends: {
        type: Array,
        default: []
    },
    posts: [{
        type: Schema.ObjectId,
        ref: Posts
    }],
    bio: {
        type: String,
        default: ""
    },
    request: {
        type: Array,
        default: []
    },
    requestsSent: {
        type: Array,
        default: []
    }
});

UserSchema.pre("save", function (next) {
    if (this.isNew || this.isModified("password")) {
        const document = this;
        bcrypt.hash(document.password, saltRounds,
            (err, hashedPassword) => {
                if (err) {
                    next(err);
                }
                else {
                    document.password = hashedPassword;
                    next();
                }
            });
    } else {
        next();
    }
});

UserSchema.methods.isCorrectPassword = (up, password, callback) => {
    bcrypt.compare(password, up, (err, same) => {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
}

var Users = mongoose.model("User", UserSchema);
module.exports = Users;