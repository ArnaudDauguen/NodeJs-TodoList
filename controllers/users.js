const router = require('express')();
//const router = require('express').Router();
const users = require('./../models/todos');
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
  users.deleteUser(req.params.id)
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
    users.createUser([req.body.firstname, req.body.lastname, req.body.username, req.body.passsword, req.body.email])
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
          const done = { message: 'sucess' };
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

  users.getAll()
  .then((users) =>
  {

    res.format({
      html: () => {//prepare content
        let content = ''
        
        users.forEach((user) => {//TODO
          content += '<div><h2>' + user['id'] + '. ' + user['name'] + '</h2>';
          content += '<p>' + 'Status : ' + user['completion'] + '</p>';
          content += '<p> Created at ' + user['createdAt'] + '</p>';
          content += '<p> Updated at ' + user['updatedAt'] + '</p></div>';
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