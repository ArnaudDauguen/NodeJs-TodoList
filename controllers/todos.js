const router = require('express')();
//const router = require('express').Router();
const Todos = require('./../models/todos');
const _ = require('lodash');

let userId = 1


// GET editing todo
// DONE
router.get('/:id/edit', (req, res) => {
  const todo = Todos.findOne(req.params.id)
  res.render("form_todo", {
    title: "Patch a todo",
    todo: todo,
    idAndMethod: "/" + req.params.id + "?_method=PATCH"
  })
})


// GET adding todo
// DONE
router.get('/add', (req, res) => {
  let userList = ''
  Todos.getAllUserIds()
  .then((userIds) => {
    if (!userIds) {
      return res.status(404).send('CREATE A USER FIRST')
    }

    userIds.foreach((id) => {
      userList += '<option value="user' + id + '">' + id + '</option>'
    })

    res.render("form_todo", {
      title: "Add a todo",
      idAndMethod: "/?_method=POST",
      userList : userList
    })
  })
  .catch((err) => {
    return res.status(404).send(err)
  })
})


// GET a todo
// DONE
router.get('/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(404).send('NOT FOUND')
  }
  Todos.findOne(req.params.id)
  .then((todo) => {
    res.format({
      html: () => { // Prepare content
        let content = ''
        content += '<div><h2>' + todo['id'] + '. ' + todo['name'] + '</h2>'
        content += '<p>' + 'Status : ' + todo['completion'] + '</p>'
        content += '<p> UserID :  ' + todo['userId'] + '</p>'
        content += '<p> Created at : ' + todo['createdAt'] + '</p>'
        content += '<p> Updated at : ' + todo['updatedAt'] + '</p></div>'
          
        res.render("show", {  
            title: 'Todo List',
            content: content
        })
      },
      json: () => {
          res.json(todo)
      }
    })
  })
  .catch((err) => {
    return res.status(404).send(err)
  })
})


// EDIT a todo
// DONE
router.patch('/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(404).send('NOT FOUND')
  }

  let changes = {}

  if (req.body.name) {
    changes.name = req.body.name
  }
  if (req.body.completion) {
    changes.completion = req.body.completion
  }

  changes.id = req.params.id // add id

  Todos.update(changes)
  .then((todo) => {
    res.format({
      html: () => {
        res.redirect(301, '/todos')
      },
      json: () => {
        res.json({message : 'sucess'});
      }
    })
  })
  .catch((err) => {
    return res.status(404).send(err)
  })
})


// DELETE a todo
//DONE
router.delete('/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(404).send('NOT FOUND')
  }
  Todos.findOne(req.params.id)
  .then((todo) => {
    if(!todo){
      return res.status(404).send('NOT FOUND')
    }
    Todos.delete(req.params.id)
    .then(() => {
      res.format({
        html: () => {
          res.redirect(301, '/todos')
        },
        json: () => {
          res.json({message : 'sucess'})
        }
      })
    })
  })
  .catch((err) => {
    return res.status(404).send(err)
  })
})


// ADD a new todo
// DONE
router.post('/', (req, res) => {
  Todos.create([req.body.message, req.body.completion, userId])
  .then((todo) => {
    res.format({
      html: () => {
        res.redirect(301, '/todos')
      },
      json: () => {
        res.json({message : 'sucess'});

      }
    })
  })
  .catch((err) => {
    return res.status(404).send(err)
  })
})

// GET all todos
// DONE
router.get('/', (req, res) => {

  Todos.getAll()
  .then((todos) =>
  {

    res.format({
      html: () => { // Prepare content
        let content = ''
        
        todos.forEach((todo) => {
          content += '<div><h2>' + todo['id'] + '. ' + todo['name'] + '</h2>';
          content += '<p>' + 'Status : ' + todo['completion'] + '</p>';
          content += '<p> Created at ' + todo['createdAt'] + '</p>';
          content += '<p> Updated at ' + todo['updatedAt'] + '</p></div>';
        });
          res.render("index", {  
              title: 'Todo List',
              content: content
          })
      },
      json: () => {
          res.json(todos)
      }
    })
  })
  .catch((err) => {
    return res.status(404).send(err)
  })
})

module.exports = router
