const router = require('express')();
//const router = require('express').Router();
const Todos = require('./../models/todos');
const _ = require('lodash');

let username = "Toi";
let userId = 1;

//GET adding TODO
//TODO
router.get('/add', (req, res) => { // need a VIEW
    res.render("form_todo", {
    title: "Add a todo",
    method: "POST"
  })
})


// GET all TODOS
//DONE
router.get('/', (req, res) => {

  Todos.getAll()
  .then((todos) =>
  {
    
    res.format({
      html: () => {//prepare content
        let content = '';
        todos.forEach(function(todo) {
          content += '<div><h2>' + todo['name'] + '</h2>';
          content += '<p>' + todo['completion'] + '</p>';
          content += '<p> Created at ' + todo['created_at'] + '</p>';
          content += '<p> Updated at ' + todo['updated_at'] + '</p></div>';
        });
          res.render("index", {  
              title: 'Todo List',
              name: username,
              content: content
          });
      },
      json: () => {
          res.json(todos);
      }
    });
  })
  .catch((err) => {
    return res.status(404).send(err);
  });
  
});


//GET editing TODO
//TODO
router.get('/:id/edit', (req, res) => { // need a VIEW
  if (!req.params.id) {
    return res.status(404).send('NOT FOUND');
  }
  req.body.updated_at = new Date(); // Update time
  req.body.id = req.params.id; // Add id to body
  Todos.update(req.body).then((todo) => res.json(todo)).catch((err) => {
    return res.status(404).send(err);
  });
});



//get A todo
//DONE
router.get('/:id', (req, res) => { // need a VIEW
  if (!req.params.id) {
    return res.status(404).send('NOT FOUND');
  }
  Todos.findOne(req.params.id)
  .then((todo) => {
    res.format({
      html: () => {//prepare content
        let content = '';
        content += '<div><h2>' + todo['name'] + '</h2>';
        content += '<p>' + todo['completion'] + '</p>';
        content += '<p> Created at ' + todo['created_at'] + '</p>';
        content += '<p> Updated at ' + todo['updated_at'] + '</p></div>';
          
        res.render("show", {  
            title: 'Todo List',
            name: username,
            content: content
        });
      },
      json: () => {
          res.json(todo);
      }
    });
  })
  .catch((err) => {
    return res.status(404).send(err);
  });
});


// add a new todo
//DONE
router.post('/', (req, res) => { // need a VIEW
  Todos.create([req.body.message, req.body.completion, userId])
  .then((todo) => {
    res.format({
      html: () => {
        res.redirect(301, '/todos')
      },
      json: () => {
        res.json(todo)
      }
    })
  })
  .catch((err) => {
    return res.status(404).send(err);
  });
});


//CREATE USER
//TODO

//edit a todo
//TODO
router.put('/:id', (req, res) => { // need a VIEW
  if (!req.params.id) {
    return res.status(404).send('NOT FOUND');
  }
  req.body.updated_at = new Date(); // Update time
  req.body.id = req.params.id; // Add id to body
  Todos.update(req.body).then((todo) => res.json(todo)).catch((err) => {
    return res.status(404).send(err);
  });
});


//delete a todo
//WIP
router.delete('/:id', (req, res) => { // need a VIEW
  if (!req.params.id) {
    return res.status(404).send('NOT FOUND');
  }
  Todos.delete(req.params.id)
  .then(() => {
    res.format({
      html: () => {
        res.redirect(301, '/todos');
      },
      json: () => {
        res.status(200).end();
      }
    })
  })
  .catch((err) => {
    return res.status(404).send(err);
  })
});

module.exports = router;