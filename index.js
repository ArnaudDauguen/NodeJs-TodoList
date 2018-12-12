const db = require('sqlite');
const express = require('express');
const api = express();
api.set('view engine', 'hbs');
api.set('views', __dirname + '/views');
const bodyParser = require('body-parser');

db.open('api.db').then(() => {
  Promise.all([
    db.run("CREATE TABLE IF NOT EXISTS todos (name, completion, updatedAt, createdAt, userId)"),
    db.run("CREATE TABLE IF NOT EXISTS users (firstname, lastname, username, password, email, createdAt, updatedAt)"),
  ]).then(() => {
    console.log('Database is ready')
  }).catch((err) => {
    console.log('Une erreur est survenue :', err)
  })
})

// MIDDLEWARE POUR PARSER LE BODY
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({ extended: false }))
// api.use(methodOverride(‘_method’))

// ROUTES
api.use('/todos', require('./controllers/todos.js'))

api.all('/', (req, res, next) => {
  res.redirect(301, '/todos');
});
api.get('*', (req, res, next) => {
  res.redirect(301, '/todos');
});

api.listen(3000);

console.log("http://localhost:3000/");