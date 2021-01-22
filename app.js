const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
let cors = require('cors')

let imagesRouter = require('./routes/images');

let indexRouter = require('./routes/index');
let contextRouter = require('./routes/context')

let vocabulary = require('./routes/vocabulary')
let vocabularyApiRouter = require('./routes/vocabulary_api')

var app = express();

// Connection to MongoDB
mongoose.connect(process.env.DBCONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
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
app.use(cors())

app.use('/', indexRouter);
app.use('/vocabulary', vocabulary)
app.use('/api/verbs', imagesRouter)
app.use('/api/vocabulary', vocabularyApiRouter)
app.use('/context', contextRouter)

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
