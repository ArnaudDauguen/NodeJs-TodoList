const router = require('express')();
//const router = require('express').Router();
const Users = require('./../models/todos');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//GET adding User
//DONE
router.get('/adduser', (req, res) => { // need a VIEW
    res.render("form_user", {
    title: "Create a user",
    idAndMethod: "/?_method=POST"
    })
})

//GET editing User
//TODO
router.get('/:id/edit', (req, res) => { // need a VIEW
  const user = Users.findOneUser(req.params.id)
  res.render("form_user", {
    title: "Patch a user",
    todo: user,
    idAndMethod: "/" + req.params.id + "?_method=PATCH"
  })
})

//delete a user
//DONE
router.delete('/:id', (req, res) => { // find a route
  if (!req.params.id) {
    return res.status(404).send('NOT FOUND');
  }
  Users.deleteUser(req.params.id)
  .then(() => {
    res.format({
      html: () => {
        res.redirect(301, '/users');
      },
      json: () => {
        res.json({message : 'sucess'});
      }
    })
  })
  .catch((err) => {
    return res.status(404).send(err);
  })
});


//CREATE USER
//WIP
router.post('/', (res, req) => {
    Users.createUser([req.body.firstname, req.body.lastname, req.body.username, req.body.passsword, req.body.email])
    .then(async () => {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          const crypt = bcrypt.hash(req.body.passsword, saltRounds)
          resolve(crypt)
        }, 1);
      });
      res.format({
        html: () => {
          res.redirect(301, '/users');
        },
        json: () => {
          const done = { message: 'sucess'};
          res.json(done);
        }
      });
    })
    .catch((err) => {
      return res.status(404).send(err)
    })
  })


// GET all USERS
//TODO
router.get('/', (req, res) => {

  Users.getAllUsers()
  .then((users) =>
  {

    res.format({
      html: () => {//prepare content
        let content = ''
        
        users.forEach((user) => {
          content += '<table><tr><th><td> User n\': ' + user['id'] + ' Username : ' + user['username'] + '</th></td>';
          content += '<th><td> ' + 'Firstname : ' + user['firstname'] + 'Lastname : ' + user['lastname'] + '</th></td>';
          content += '<th><td> ' + 'Email : ' + user['email'] + '</th></td>';
          content += '<th><td> ' + 'User created at : ' + user['createdAt'] + '</th></td>';
          content += '<th><td> ' + 'User updated at : ' + user['updatedAt'] + '</th></td></tr></table>';
        });
          res.render("index", {  
              title: 'user List',
              name: username,
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