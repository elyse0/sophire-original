const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config()
let cors = require('cors')
let sexyRequire = require('sexy-require')
const mongoconnecton = require('./util/mongo_connection').connection

// Routers
let indexRouter = require('/routes/index')
let verbsRouter = require('/routes/verbs')
let vocabularyRouter = require('/routes/vocabulary')
let verbsApiRouter = require('/routes/verbs_api')
let vocabularyApiRouter = require('/routes/vocabulary_api')
let contextRouter = require('/routes/utilities/context')

var app = express();

// Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/', indexRouter);
app.use('/verbs', verbsRouter)
app.use('/vocabulary', vocabularyRouter)
app.use('/api/verbs', verbsApiRouter)
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
