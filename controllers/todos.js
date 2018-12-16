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
        let content = '<table><tr><th>Id</th><th>Description</th><th>Completion</th><th>createdAt</th><th>updatedAt</th></tr>'
        content += '<tr>'
        content += '<td>' + todo['id'] + '</td>'
        content += '<td>' + todo['name'] + '</td>'
        content += '<td>' + todo['completion'] + '</td>'
        content += '<td>' + todo['createdAt'] + '</td>'
        content += '<td>' + todo['updatedAt'] + '</td>'
        content += '</tr>'
        content += '</table>'

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
        let content = '<table><tr><th>Id</th><th>Description</th><th>Completion</th><th>createdAt</th><th>updatedAt</th></tr>'
        
        todos.forEach((todo) => {
          content += '<tr>'
          content += '<td>' + todo['id'] + '</td>'
          content += '<td>' + todo['name'] + '</td>'
          content += '<td>' + todo['completion'] + '</td>'
          content += '<td>' + todo['createdAt'] + '</td>'
          content += '<td>' + todo['updatedAt'] + '</td>'
          content += '</tr>'
        })
        
        content += '</table>'
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
