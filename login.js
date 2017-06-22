const express = require('express');
const expressSession = require('express-session');
const mustacheExpress = require('mustache-express');
const parseUrl = require('parseurl');
const bodyParser = require('body-parser');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(express.static('/public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3000, function () {
  console.log('Successfully started Login application!');
});

var usernameInput = '';
var passwordInput = '';

// hardcoded database of users and passwords
var userDatabase = { users : [
  { username:"poop" , password:"butt" },
  { username:"poop123" , password:"butts" },
  { username:"unicorns" , password:"andrainbows" } ]};

app.use(expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

// viewcount
app.use(function (request, response, next) {
  var views = request.session.views;

  if (!views) {
    views = request.session.views = {};
  }

  var pathName = parseUrl(request).pathname;
  views[pathName] = (views[pathName] || 0) + 1;
  next();
})

app.get('/', function(request, response){
  // console.log(userDatabase.users[0].username);
})

app.post('/login', function(request, response){
  usernameInput = request.body.username;
  passwordInput = request.body.password;

  request.session.user = usernameInput;
  request.session.password = passwordInput;

  for (var i = 0; i < userDatabase.users.length; i++) {
    if(request.session.user === userDatabase.users[i].username && request.session.password === userDatabase.users[i].password){
      response.render('login', {
        usernameInput: usernameInput,
        passwordInput: passwordInput
      });
    } else {
      console.log('Incorrect username or password.');
    }
  }
})

app.get('/login', function (request, response, next) {
  response.render('login');
})
