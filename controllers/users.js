const router = require('express')();
//const router = require('express').Router();
const Users = require('./../models/todos');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const saltRounds = 10;


//GET todos for UserId
router.get('/:id/todos', (req, res, next) => {
  if (req.params.id === undefined || req.params.id === null) {
    return next(new Error("404 NOT FOUND"))
  }
  Users.getAllTodosForUserId(req.params.id)
  .then((todos) => {
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
            title: 'Todo List for User: ' + req.params.id,
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


// GET editing User
// WIP
router.get('/:id/edit', (req, res, next) => { 
  const user = Users.findOneUser(req.params.id)
  res.render("form_user", {
    title: "Patch a user",
    formTitle: "Edit user n°" + req.params.id,
    todo: user,
    idAndMethod: "/" + req.params.id + "?_method=PATCH"
  })
})

// GET adding User
// DONE
router.get('/add', (req, res, next) => {
    res.render("form_user", {
    title: "Create a user",
    formTitle: "Add a user",
    idAndMethod: "/?_method=POST"
    })
})


// GET a user
// DONE
router.get('/:id', (req, res, next) => {
  if (!req.params.id) {
    return next(new Error("404 NOT FOUND"))
  }
  Users.findOneUser(req.params.id)
  .then((user) => {
    if(!user){
      return next(new Error("404 NOT FOUND"))
    }
    res.format({
      html: () => { // Prepare content

        let content = '<table class="table"><tr><th>ID</th><th>Username</th><th>Firstname</th><th>Lastname</th><th>Email</th><th>createdAt</th><th>updatedAt</th></tr>'
        content += '<tr>'
        content += '<td>' + user['id'] + '</td>'
        content += '<td>' + user['username'] + '</td>'
        content += '<td>' + user['firstname'] + '</td>'
        content += '<td>' + user['lastname'] + '</td>'
        content += '<td>' + user['email'] + '</td>'
        content += '<td>' + user['createdAt'] + '</td>'
        content += '<td>' + user['updatedAt'] + '</td>'
        content += '</tr>'
        content += '</table>'

        res.render("show", {  
          title: 'Show user ' + user['username'],
          h1Title: "User " + user['username'],
          content: content
        })
      },
      json: () => {
        res.json(user)
      }
    })
  })
  .catch((err) => {
    console.log(err)
    return next(err)
  })
})


// EDIT a user
// DONE
router.patch('/:id', (req, res, next) => {
  if (!req.params.id) {
    return next(new Error("404 NOT FOUND"))
  }

  let changes = {}

  if (req.body.firstname) {
    changes.firstname = req.body.firstname
  }
  if (req.body.lastname) {
    changes.lastname = req.body.lastname
  }
  if (req.body.email) {
    changes.email = req.body.email
  }
  if (req.body.username) {
    changes.username = req.body.username
  }
  if (req.body.passsword) {
    changes.passsword = req.body.passsword
  }

  changes.id = req.params.id // add id

  Users.updateUser(changes)
  .then((user) => {
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


// DELETE a user
// DONE
router.delete('/:id', (req, res, next) => {
  if (!req.params.id) {
    return next(new Error("404 NOT FOUND"))
  }
  Users.findOneUser(req.params.id)
  .then((user) => {
    if(!user){
      return next(new Error("404 NOT FOUND"))
    }
    Users.deleteUser(req.params.id)
    .then(() => {
      res.format({
        html: () => {
          res.redirect(301, '/users')
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



// CREATE users
// DONE
router.post('/', (req, res, next) => {
  let promise = Promise.resolve()
  .then(async () => {
    let crypt = ''
    await new Promise((resolve, reject) => {
        crypt = bcrypt.hash(req.body.password, saltRounds)
        resolve(crypt)
    })
    return crypt
  })
  .then((encryptedPassword) => {
    Users.createUser([req.body.firstname, req.body.lastname, req.body.username, encryptedPassword, req.body.email])
    .then(() => {})
    res.format({
      html: () => {
        res.redirect(301, '/users')
      },
      json: () => {
        res.json({ message: 'sucess'})
      }
    })
  })
  .catch((err) => {
    console.log(err)
    return next(err)
  })
})


// GET all users
// DONE
router.get('/', (req, res, next) => {

  Users.getAllUsers()
  .then((users) =>
  {
    res.format({
      html: () => { // Prepare content
        let content = '<table class="table"><tr><th>Id</th><th>Username</th><th>Firstname</th><th>Lastname</th><th>Email</th><th>createdAt</th><th>updatedAt</th></tr>'
        
        users.forEach((user) => {
          content += '<tr>'
          content += '<td>' + user['id'] + '</td>'
          content += '<td>' + user['username'] + '</td>'
          content += '<td>' + user['firstname'] + '</td>'
          content += '<td>' + user['lastname'] + '</td>'
          content += '<td>' + user['email'] + '</td>'
          content += '<td>' + user['createdAt'] + '</td>'
          content += '<td>' + user['updatedAt'] + '</td>'
          content += '</tr>'
        })

        content += '</table>'
        
        res.render("index", {  
            title: 'User list',
            content: content
        })
      },
      json: () => {
          res.json(users)
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
      console.log("error : " + err)
      res.render("error404", {
        error: err
      })
    },
    json: () => {
      console.log("error : " + err)
      res.json({
        message: "Error 500",
        description: "Server Error"
      })
    }
  })
})


module.exports = router