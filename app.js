const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')

let imagesRouter = require('./routes/images');
let indexRouter = require('./routes/index')

var app = express();

// Connection to MongoDB
userMongoDB = "user"
passwordMongoDB = "FVDB4GgNtZMpOZmj"
databaseMongoDB = "french-verbs"
mongoURI = `mongodb+srv://${userMongoDB}:${passwordMongoDB}@french-verbs.t4tmy.mongodb.net/${databaseMongoDB}?retryWrites=true&w=majority`

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, client) => {
  if(err)
    console.error(err)
  else
    console.log("Connected to MongoDB")
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/verbs', imagesRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app
