var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const i18n = require('./lib/i18nConfigure');
const LoginController = require('./controllers/LoginController');
const PrivadoController = require('./controllers/PrivadoController');
const session = require('express-session');
const sessionAuth = require('./lib/sessionAuthMiddleware');
const MongoStore = require('connect-mongo');
const jwtAuthMiddleware = require('./lib/jwtAuthMiddleware');

require('./lib/connectMongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs');

app.locals.title = 'nodepop';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const loginController = new LoginController();

/**
 * Rutas del api
 */
app.use('/api/anuncios', jwtAuthMiddleware, require('./routes/api/anuncios'));
app.post('/api/login', loginController.postAPI)


app.use(i18n.init);
app.use(session({
  name: 'nodepop-session',
  secret: 'idjieogriorgi344r',
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 *24 * 2 // expira a los 2 dias de inactividad
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_CONNECTION_STR
  })
}))


const privadoController = new PrivadoController();

/**
 * Rutas del Website
 */
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// hacemos que el objeto de sesión esté disponible al renderizar vistas
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
})
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/features', require('./routes/features'));
app.use('/change-locale', require('./routes/change-locale'));
app.get('/login', loginController.index);
app.post('/login', loginController.post);
app.get('/logout', loginController.logout);
app.get('/privado', sessionAuth, privadoController.index);


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

  // si lo que ha fallado es una petición al API
  // devuelvo el error en formato JSON
  if (req.originalUrl.startsWith('/api/')) {
    res.json({ error: err.message });
    return;
  }
});

module.exports = app;
