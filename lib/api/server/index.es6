'use strict';

var _ = require('lodash-node'),
  config = require('../../../json/config'),
  options = config.server,
  util = require ('../util'),
  log = util.log('server', 'TDA'),
  app, express;

/*
 * Serve the static assets
 * http://expressjs.com/guide/using-middleware.html#middleware.built-in
 */
function setStaticDir(list) {
  if(app && express) {
    var set = (dir => {app.use(express.static(process.cwd() + dir));});
    if(_.isArray(list)) {
      list.forEach(dir => {set(dir);});
    } else if(_.isString(list)) {
      set(list);
    } else {
      throw Error('Error');
    }
  } else {
    throw Error('Error');
  }
}


/*
 * Set bodyParser so that you can get post query
 * https://www.npmjs.com/package/body-parser
 * http://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
 */
function setBodyParser() {
  var bodyParser = require('body-parser');
  app.use(bodyParser.json());       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
    extended: true
  }));
}

/*
 * Allow Cors
 */
function setAllowCORS() {
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
}

/*
 * Setup handlebars template
 * https://www.npmjs.com/package/express-handlebars
 */
function setHandlebars() {
  var exphbs = require('express-handlebars');
  // Create `ExpressHandlebars` instance with a default layout.
  var hbs = exphbs.create({defaultLayout: 'main'});
  // Register `hbs` as our view engine using its bound `engine()` function.
  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');
}

/*
 * Basic Express 4.0 Setup with connect-flash
 * https://gist.github.com/tpblanke/11061808
 * https://github.com/expressjs/session/issues/56
 * https://github.com/expressjs/session#options
 */
function setConnectFlash() {
  var session = require('express-session'),
    cookieParser = require('cookie-parser'),
  flash = require('connect-flash');
  app.use(cookieParser('secret'));
  app.use(session({
    secret: 'rHCbQzPnpnkZSV8BTufxZTzn',
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
  }));
  app.use(flash());
}

function getContext(req) {
  return {
    login: req.flash('login'),
    host: req.get('host'),
    date: Date.now()
  };
}

/*
 * Generic basic auth Authorization header field parser
 * https://davidbeath.com/posts/expressjs-40-basicauth.html
 */
function checkAuth() {
  var basicAuth = require('basic-auth');
  var url = process.env.WEBHOOK_URL;
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  }
  return ((req, res, next) => {
    if(url && /localhost/.test(req.get('host'))) {
      // res.redirect(`${url}:${config.server.port}`);
      res.redirect(url + '/admin');
    } else {
      var user = basicAuth(req);
      if (!user || !user.name || !user.pass) {
        return unauthorized(res);
      };
      if (user.name === config.admin.id && user.pass === config.admin.pw) {
        return next();
      } else {
        return unauthorized(res);
      };
    }
  });
}

/*
 * Redirect to ngrok URL if the host is localhost
 */
function checkLocalhost() {
  // var url = process.env.LOCAL_URL;
  var url = process.env.WEBHOOK_URL;
  return ((req, res, next) => {
    if(url && /localhost/.test(req.get('host'))) {
      // res.redirect(`${url}:${config.server.port}`);
      res.redirect(url);
    } else {
      next();
    }
  });
}

function setRoute() {
  var auth = checkAuth(),
    noLocalhost = checkLocalhost(),
    obj = {
      timestamp: Date.now(),
      version: require('../../../package').version,
      options: options,
      development: !!(process.env.NODE_ENV === 'development'),
      ipaddress: process.env.LOCAL_URL || 'http://localhost'
    };
    
  app.get('/', noLocalhost, ((req, res) => {
    res.render('home', _.extend(obj, getContext(req)));
  }));

  app.get('/all', noLocalhost, ((req, res) => {
    res.redirect('back');
  }));

  app.get('/active', noLocalhost, ((req, res) => {
    res.redirect('back');
  }));

  app.get('/completed', noLocalhost, ((req, res) => {
    res.redirect('back');
  }));
}

exports.connect = ((expressApp, expressServer) => {
  if(expressApp && expressServer) {
    app = expressApp;
    express = expressServer;
    setConnectFlash();
    setBodyParser();
    setAllowCORS();
    setHandlebars();
    var http = require('http').Server(app);
    require('./socket.es6').setup(http, app);
    var port = process.env.PORT || options.port;
    http.listen(port, (() => {
      log(`listening to ${port}`, 'green');
    }));
  } else {
    throw Error('Error');
  }
});

exports.setup = (() => {
  setRoute();
  setStaticDir(options.staticDir);
});
