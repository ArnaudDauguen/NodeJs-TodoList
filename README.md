# NodeJs-TodoList

_Arnaud Dauguen - Quentin Gans Ingesup B2B_

Projet NodeJs : Todolist !

## Description du projet

C'est une todolist qui permet à plusieurs personnes d'ajouter des todos, de les modifier et de les supprimer 😏.

## Description des différentes routes

*Tips : /ressources correspont aux routes /todos et /users*

- GET /ressources: 
    - JSON: Renvoi le contenus de la requêtes sql
    - HTML: affiche la page index.hbs
    
- GET /ressources/:id
  - JSON: Renvoi le contenus de la requêtes sql
  - HTML: affiche la page show.hbs
  
- POST /ressources
  - JSON: {message : 'sucess'}
  - HTML: redirect sur index.hbs
  
- PUT/PATCH /ressources/:id
  - JSON: {message : 'sucess'}
  - HTML: redirect sur index.hbs
  
- DELETE /ressources/:id *
  - JSON: {message : 'sucess'}
  - HTML: redirect sur index.hbs
  
- GET /ressources/add
  - HTML: affiche un formulaire
  
- GET /ressources/:id/edit
  - HTML: affiche le même formulaire que pour /add
  
- GET /users/:id/todos
  - JSON: renvoi les todos de l'utilisateur
  - HTML: affiche un tableau des todos de l'utilisateur
  
* :*Pour supprimer une route il faut passer par postman
