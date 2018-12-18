const router = require('express')();
//const router = require('express').Router();
const Todos = require('./../models/todos');
const _ = require('lodash');


// GET editing todo
// DONE
router.get('/:id/edit', (req, res, next) => {
  Todos.findOne(req.params.id)
  .then((todo) => {
    if (!todo) {
      return next(new Error("404 NOT FOUND"))
    }

    //objet pour connaitre la completion de la todo (pour le formulaire)
    let completion = {
      todo: undefined,
      inProgress: undefined,
      done: undefined
    }

    if(todo.completion === "Todo"){
      completion.todo = true
    }
    if(todo.completion === "In Progress"){
      completion.inProgress = true
    }
    if(todo.completion === "Done"){
      completion.done = true
    }

    res.render("form_todo", {
      title: "Edit a todo",
      formTitle: "Edit todo n°" + req.params.id,
      todo: todo,
      completion: completion,
      idAndMethod: "/" + req.params.id + "?_method=PATCH"
    })
  })
  .catch((err) => {
    return next(new Error("404 NOT FOUND"))
  })
})


// GET adding todo
// DONE
router.get('/add', (req, res, next) => {
  let userList = ''
  Todos.getAllUserIds()
  .then((userIds) => {
    if (!userIds) {
      return next(new Error("500 NEED A USER FIRST"))
    }

    userIds.forEach((userId) => {
      userList += '<option value="' + userId.id + '">' + userId.id + '</option>'
    })

    res.render("form_todo", {
      title: "Add a todo",
      formTitle: "Create a Todo",
      idAndMethod: "/?_method=POST",
      userList : userList
    })
  })
  .catch((err) => {
    console.log(err)
    return next(err)
  })
})


// GET a todo
// DONE
router.get('/:id', (req, res, next) => {
  if (!req.params.id) {
    return next(new Error("404 NOT FOUND"))
  }
  Todos.findOne(req.params.id)
  .then((todo) => {
    if (!todo) {
      return next(new Error("404 NOT FOUND"))
    }
    res.format({
      html: () => { // Prepare content
        let content = '<table class="table"><tr><th>Id</th><th>Description</th><th>Completion</th><th>createdAt</th><th>updatedAt</th><th>userID</th></tr>'
        content += '<tr>'
        content += '<td>' + todo['id'] + '</td>'
        content += '<td>' + todo['name'] + '</td>'
        content += '<td>' + todo['completion'] + '</td>'
        content += '<td>' + todo['createdAt'] + '</td>'
        content += '<td>' + todo['updatedAt'] + '</td>'
        content += '<td>' + todo['userId'] + '</td>'
        content += '</tr>'
        content += '</table>'

        res.render("show", {  
            title: 'Todo n°' + todo['id'],
            h1Title: 'Todo n°' + todo['id'],
            content: content
        })
      },
      json: () => {
        res.json(todo)
      }
    })
  })
  .catch((err) => {
    console.log(err)
    return next(err)
  })
})


// EDIT a todo
// DONE
router.patch('/:id', (req, res, next) => {
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
    console.log(err)
    return next(err)
  })
})


// DELETE a todo
// DONE
router.delete('/:id', (req, res, next) => {
  if (!req.params.id) {
    return next(new Error("404 NOT FOUND"))
  }
  Todos.findOne(req.params.id)
  .then((todo) => {
    if(!todo){
      return next(new Error("404 NOT FOUND"))
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
    console.log(err)
    return next(err)
  })
})


// ADD a new todo
// DONE
router.post('/', (req, res, next) => {
  if (req.body.name == '') {
    return next(new Error("Veuillez entrer un nom pour la todo"))
  }
  Todos.create([req.body.name, req.body.completion, req.body.userId])
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
    console.log(err)
    return next(err)
  })
})

// GET all todos
// DONE
router.get('/', (req, res, next) => {

  Todos.getAll()
  .then((todos) =>
  {

    res.format({
      html: () => { // Prepare content
        let content = '<table class="table"><tr><th>ID</th><th>Description</th><th>Completion</th><th>createdAt</th><th>updatedAt</th><th>userID</th></tr>'
        
        todos.forEach((todo) => {
          content += '<tr>'
          content += '<td>' + todo['id'] + '</td>'
          content += '<td>' + todo['name'] + '</td>'
          content += '<td>' + todo['completion'] + '</td>'
          content += '<td>' + todo['createdAt'] + '</td>'
          content += '<td>' + todo['updatedAt'] + '</td>'
          content += '<td>' + todo['userId'] + '</td>'
          content += '</tr>'
        })
        
        content += '</table>'

        res.render("index", {  
            title: 'Todolist',
            content: content
        })
      },
      json: () => {
          res.json(todos)
      }
    })
  })
  .catch((err) => {
    console.log(err)
    return next(err)
  })
})

// Middleware 404
// DONE
router.use((err, req, res, next) => {
  res.format({
    html: () => {
      console.log(err)
      res.render("error404", {
        error: err
      })
    },
    json: () => {
      console.log(err)
      res.json({
        message: err.message,
        description: "An error occured"
      })
    }
  })
})


module.exports = router

/* COPYRIGHT © 2018 ARNAUD DAUGUEN GANS QUENTIN - TOUT DROITS RÉSERVÉS */