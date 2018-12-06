const router = require('express')();
//const router = require('express').Router();
const Todos = require('./../models/todos');
const _ = require('lodash');

let name = 'Arnaud';



// GET all TODOS
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Todo list',
    name: name,
    content: '<h2>tentative</h2>'
  });
  Todos.getAll().then((todos) => res.json(todos)).catch((err) => {
    return res.status(404).send(err);
  });
});



//get /todos/add WIP
//GET adding TODO
router.get('/add', (req, res) => { // need a VIEW
  console.log(req)
  if (!req.body || (req.body && (!req.body.name || !req.body.completion))){
    return res.status(404).send('NOT FOUND');
  }

  Todos.create(req.body).then((todo) => res.json(todo)).catch((err) => {
    return res.status(404).send(err);
  });
});



//get /todos/:todoId/edit WIP
//GET editing TODO
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



//
router.get('/:id', (req, res) => { // need a VIEW
  if (!req.params.id) {
    return res.status(404).send('NOT FOUND');
  }
  Todos.findOne(req.params.id).then((todo) => res.json(todo)).catch((err) => {
    return res.status(404).send(err);
  });
});



router.post('/', (req, res) => { // need a VIEW
  console.log(req)
  if (!req.body || (req.body && (!req.body.name || !req.body.completion))){
    return res.status(404).send('NOT FOUND');
  }

  Todos.create(req.body).then((todo) => res.json(todo)).catch((err) => {
    return res.status(404).send(err);
  });
});



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



router.delete('/:id', (req, res) => { // need a VIEW
  if (!req.params.id) {
    return res.status(404).send('NOT FOUND');
  }
  Todos.delete(req.params.id).then(() => res.json({ message: 'Todo supprimée avec succès' })).catch((err) => {
    return res.status(404).send(err);
  })
});



module.exports = router;