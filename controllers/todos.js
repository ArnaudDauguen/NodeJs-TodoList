const router = require('express')();
//const router = require('express').Router();
const Todos = require('./../models/todos');
const _ = require('lodash');

let userId = 1


// GET editing todo
// DONE
router.get('/:id/edit', (req, res, next) => {
  const todo = Todos.findOne(req.params.id)
  res.render("form_todo", {
    title: "Edit a todo",
    formTitle: "Edit todo n°" + req.params.id,
    todo: todo,
    idAndMethod: "/" + req.params.id + "?_method=PATCH"
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

    userIds.forEach((id) => {
      userList += '<option value="user' + id + '">' + id + '</option>'
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
        let content = '<table class="table"><tr><th>Id</th><th>Description</th><th>Completion</th><th>createdAt</th><th>updatedAt</th></tr>'
        content += '<tr>'
        content += '<td>' + todo['id'] + '</td>'
        content += '<td>' + todo['name'] + '</td>'
        content += '<td>' + todo['completion'] + '</td>'
        content += '<td>' + todo['createdAt'] + '</td>'
        content += '<td>' + todo['updatedAt'] + '</td>'
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
//DONE
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
        let content = '<table class="table"><tr><th>Id</th><th>Description</th><th>Completion</th><th>createdAt</th><th>updatedAt</th></tr>'
        
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


router.use((err, req, res, next) => {
  res.format({
    html: () => {
      console.log("error todo : " + err)
      res.render("error404", {
        error: err
      })
    },
    json: () => {
      console.log("error : " + err)
      res.json({
        message: "error 500",
        description: "Server Error"
      })
    }
  })
})


module.exports = router
