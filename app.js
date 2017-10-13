const express = require('express'),
    app = express(),
    session = require('express-session'),
    path = require('path'),
    conf = require('./config/')

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

// app.use(express.logger,conf.get(''))

app.set('views', path.join(__dirname, conf.get('app-view')));

app.set(express.static(path.join(__dirname,conf.get('app-static'))))

app.set('view engine', conf.get('app-engine'));

app.set('port',(process.env.PORT||conf.get('app-port')))



// Authentication and Authorization Middleware
let auth = function(req, res, next) {
  if (req.session && req.session.user === "amy" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};

// Login endpoint
app.get('/',function(req,res) {
  res.send('Hello, Guest!');
})
app.get('/login', function (req, res) {
  if (!req.query.username || !req.query.password) {
    res.send('login failed');    
  } else if(req.query.username === "amy" || req.query.password === "amyspassword") {
    req.session.user = "amy";
    req.session.admin = true;
    res.send("login success!");
  }
});

// Logout endpoint
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});

// Get content endpoint
app.get('/content', auth, function (req, res) {
  res.send("You can only see this after you've logged in.");
});

app.listen(app.get('port'),function(err) {
    if(err) console.error(err);
    else console.log('app running at:' , app.get('port'))
});