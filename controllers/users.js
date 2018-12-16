const router = require('express')();
//const router = require('express').Router();
const Users = require('./../models/todos');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const saltRounds = 10;


//GET todos for UserId
router.get('/:id/todos', (req, res) => {
  if (req.params.id === undefined || req.params.id === null) {
    return res.status(404).send('NOT FOUND')
  }
  Users.getAllTodosForUserId(req.params.id)
  .then((todos) => {
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
    return res.status(404).send(err)
  })
})


// GET editing User
// WIP
router.get('/:id/edit', (req, res) => { 
  const user = Users.findOneUser(req.params.id)
  res.render("form_user", {
    title: "Patch a user",
    todo: user,
    idAndMethod: "/" + req.params.id + "?_method=PATCH"
  })
})

// GET adding User
// DONE
router.get('/add', (req, res) => {
    res.render("form_user", {
    title: "Create a user",
    idAndMethod: "/?_method=POST"
    })
})


// GET a user
// DONE
router.get('/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(404).send('NOT FOUND')
  }
  Users.findOneUser(req.params.id)
  .then((user) => {
    res.format({
      html: () => { // Prepare content
        let content = ''
        content += '<table><tr><th><td> User n\': ' + user['id'] + ' Username : ' + user['username'] + '</th></td>';
        content += '<th><td> ' + 'Firstname : ' + user['firstname'] + 'Lastname : ' + user['lastname'] + '</th></td>';
        content += '<th><td> ' + 'Email : ' + user['email'] + '</th></td>';
        content += '<th><td> ' + 'User created at : ' + user['createdAt'] + '</th></td>';
        content += '<th><td> ' + 'User updated at : ' + user['updatedAt'] + '</th></td></tr></table>';
       
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


// EDIT a user
// DONE
router.patch('/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(404).send('NOT FOUND')
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
    return res.status(404).send(err)
  })
})


// DELETE a user
// DONE
router.delete('/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(404).send('NOT FOUND');
  }
  Users.findOneUser(req.params.id)
  .then((user) => {
    if(!user){
      return res.status(404).send('NOT FOUND')
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
    return res.status(404).send(err)
  })
})



// CREATE users
// WIP
router.post('/', (req, res) => {
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
    return res.status(404).send(err)
  })
})


// GET all users
// DONE
router.get('/', (req, res) => {

  Users.getAllUsers()
  .then((users) =>
  {
    res.format({
      html: () => { // Prepare content
        let content = '<table><tr><th>Id</th><th>Username</th><th>Firstname</th><th>Lastname</th><th>Email</th><th>createdAt</th><th>updatedAt</th></tr>'
        
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
            title: 'user List',
            content: content
        })
      },
      json: () => {
          res.json(users)
      }
    })
  })
  .catch((err) => {
    return res.status(404).send(err)
  })
})

module.exports = router