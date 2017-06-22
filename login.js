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

var loginAttempt = false;

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

// initial redirect to login page. After successfully logging in, renders index.
app.get('/', function(request, response){
  if(loginAttempt === true){
    response.render('index', {
      loginAttempt: loginAttempt
    });
  } else {
    response.redirect('/login');
  }
})

app.get('/login', function (request, response) {
  response.render('login', {
    loginAttempt: loginAttempt
  });
})

app.post('/login', function(request, response){
  usernameInput = request.body.username;
  passwordInput = request.body.password;

  request.session.user = usernameInput;
  request.session.password = passwordInput;

  // for loop to check user input of username and password against hardcoded database of users
  for (var i = 0; i < userDatabase.users.length; i++) {
    if(request.session.user === userDatabase.users[i].username && request.session.password === userDatabase.users[i].password){
      response.redirect('/');
    } else {
      loginAttempt = true;
      response.redirect('login');
      response.render('login', {
        loginAttempt: loginAttempt
      });
    }
  }
})
