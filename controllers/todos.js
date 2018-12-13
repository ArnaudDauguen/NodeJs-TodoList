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

        todos.forEach((todo) => {
          content += '<div><h2>' + todo['id'] + '. ' + todo['name'] + '</h2>';
          content += '<p>' + 'Status : ' + todo['completion'] + '</p>';
          content += '<p> Created at ' + todo['createdAt'] + '</p>';
          content += '<p> Updated at ' + todo['updatedAt'] + '</p></div>';
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
  const todo = Todos.findOne(req.params.id)
  res.render("form_todo", {
    title: "Patch a todo",
    todo: todo,
    method: "PATCH"
  })
});



//get a todo
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
        content += '<div><h2>' + todo['id'] + '. ' + todo['name'] + '</h2>';
        content += '<p>' + 'Status : ' + todo['completion'] + '</p>';
        content += '<p> Created at ' + todo['createdAt'] + '</p>';
        content += '<p> Updated at ' + todo['updatedAt'] + '</p></div>';
          
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




// Add a new todo
//DONE
router.post('/', (req, res) => { // need a VIEW
  Todos.create([req.body.message, req.body.completion, userId])
  .then((todo) => {
    res.format({
      html: () => {
        res.redirect(301, '/todos')
      },
      json: () => {
        const done = {message : 'sucess'};
        res.json(done);
      }
    })
  })
  .catch((err) => {
    return res.status(404).send(err);
  });
});

// Edit a todo
//TODO
router.patch('/:id', (req, res) => { // need a VIEW
  if (!req.params.id) {
    return res.status(404).send('NOT FOUND');
  }

  let changes = {};

  if (req.body.name) {
    changes.name = req.body.name;
  }
  if (req.body.completion) {
    changes.completion = req.body.completion;
  }

  changes.id = req.params.id; //add id

  Todos.update(changes)
  .then((todo) => {
    res.format({
      html: () => {
        res.redirect(301, '/todos')
      },
      json: () => {
        const done = {message : 'sucess'};
        res.json(done);
        res.json({message : 'sucess'});
      }
    })
  })
  .catch((err) => {
    return res.status(404).send(err);
  });
});

module.exports = router;