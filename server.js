// EXPRESS INIT
const express = require('express');
const app = express();

// EXPRESS MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/client/build'));

// COOKIES
const cookieParser = require('cookie-parser');

require('dotenv').config();
app.use(cookieParser(process.env.COOKIE_SECRET));

// LOGGING
const morgan = require('morgan');
app.use(morgan('combined'));

// ERROR HANDLER
const wrap = fn => (...args) => fn(...args).catch(args[2]);

// SECURITY
const rateLimit = require('express-rate-limit');

app.set('trust proxy', 1);

const apiLimiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 10,
  message: 'Please wait several seconds and try again.'
});

app.use('/api/', apiLimiter); // only limit requests that begin with /api/

const helmet = require('helmet');

app.use(helmet.xssFilter());
app.use(helmet.contentSecurityPolicy({
  directives: { // allowed website resources
    defaultSrc: [`'self'`],
    scriptSrc: [`'self'`, `'unsafe-inline'`, `stackpath.bootstrapcdn.com`],
    styleSrc: [`'self'`, `'unsafe-inline'`, `stackpath.bootstrapcdn.com`, `fonts.googleapis.com`],
    fontSrc: [`'self'`, `fonts.googleapis.com`, `fonts.gstatic.com`],
    imgSrc: [`'self'`, `i.ibb.co`]
  }
}));
app.use(helmet.frameguard({ action: 'deny' }));

const jwt = require('jsonwebtoken');

app.use(wrap(async (req, res, next) => {
  const { token } = req.signedCookies;

  if (token) {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenDecoded) {
      throw { status: 401 };
    }

    req.token = {
      UserId: tokenDecoded.UserId
    };
  }
  else if (req.path !== '/api/users' // public paths
    && req.path !== '/api/users/register'
    && req.path !== '/api/users/logout'
    && req.path !== '/'
    && req.path !== '/register') {
    throw { status: 401 };
  }

  next();
}));

// ROUTES
const expressWs = require('express-ws')(app);
require('./routes')(app, expressWs);


// PRODUCTION ROUTE
app.get('*', wrap(async (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(__dirname + '/client/build/index.html');
  }
  else {
    next();
  }
}));

// 404 HANDLER
app.use(wrap(async (req, res, next) => {
  throw { status: 404, msg: 'Page not found.' };
}));

// ERROR RESPONSE
app.use((err, req, res, next) => {
  console.log(typeof err === 'object' ?
    JSON.stringify(err, null, 2) // pretty print our object errors
    : err);

  if (err.errors && err.errors[0].validatorKey) {  // sequelize validation errors
    err = { status: 400, msg: err.errors[0].message };
  }
  else if (err.message) { // multer errors
    err = { status: 400, msg: err.message };
  }

  switch (err.status) {
    case 400:
      return res.status(err.status).send(err.msg ? err.msg : 'Request malformed.');
    case 401:
      return res.status(err.status).send(err.msg ? err.msg : 'Unauthorized.');
    case 404:
      return res.status(err.status).send(err.msg ? err.msg : 'Not found.');
    default:
      return res.status(500).send('Server error.');
  }
});

// SEQUELIZE, SERVER, WEBSOCKET INIT
const db = require('./models');
const PORT = process.env.PORT || 3001;

db.sequelize.sync({ force: JSON.parse(process.env.RESET_DB) }) // all env variables are strings, so bools must be parsed
  .then(function () {
    require('./data/seeds')(db); // run seeds

    app.listen(PORT, function () {
      console.log('App listening on PORT ' + PORT);
    });
  });
