const router = require('express')();
//const router = require('express').Router();
const Todos = require('./../models/todos');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//GET adding User
//WIP
router.get('/adduser', (req, res) => { // need a VIEW
    res.render("form_user", {
    title: "Create a user",
    method: "POST"
    })
})

  
//delete a user
//DONE
router.delete('/:id', (req, res) => { // find a route
  if (!req.params.id) {
    return res.status(404).send('NOT FOUND');
  }
  Todos.deleteUser(req.params.id)
  .then(() => {
    res.format({
      html: () => {
        res.redirect(301, '/todos');
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
    Todos.createUser([req.body.firstname, req.body.lastname, req.body.username, req.body.passsword, req.body.email])
    .then(async () => {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          const crypt = bcrypt.hash(req.body.passsword, saltRounds)
          resolve(crypt)
        }, 1);
      });
      res.format({
        html: () => {
          res.redirect(301, '/todos');
        },
        json: () => {
          const done = { message: 'sucess' };
          res.json(done);
        }
      });
    })
    .catch((err) => {
      return res.status(404).send(err)
    })
  })


module.exports = router