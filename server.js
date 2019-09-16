const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const zipcodes = require('./server/routes/zipcodes');

const app = express();

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));
// app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
// app.use('/assets', express.static(path.join(__dirname, 'server/assets')));

app.use('/zipcodes', zipcodes);

module.exports = app;
