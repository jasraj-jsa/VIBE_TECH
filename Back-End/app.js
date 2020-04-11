var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const url = "mongodb://localhost:27017/vibe";
const withAuth = require("./routes/middleware");
const logout = require("./routes/logout");
const SearchEngine = require("./routes/searchEngine");
const CurrentUser = require("./routes/currentUser");
const postsRouter = require("./routes/posts");
const commentRouter = require("./routes/comments");
mongoose.connect(url)
  .then((db) => {
    console.log("\t\t\t\t\t\tSucessfully connected to the server!!\n");
  })

var app = express();


// view engine setup
app.disable('etag');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentRouter);
app.get('/checkToken', withAuth, function (req, res) {
  res.sendStatus(200);
});
app.use('/logout', logout);
app.use("/current", CurrentUser);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
app.use('/search', SearchEngine);
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //res.status(err.status || 500);
  //res.render('error');
});



module.exports = app;
