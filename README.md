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
  - HTML: affiche la page show.hbs d'une todo ou d'un user
  
- POST /ressources
  - JSON: {message : 'sucess'}
  - HTML: redirect sur index.hbs et ajoute une todo ou un user
  
- PUT/PATCH /ressources/:id
  - JSON: {message : 'sucess'}
  - HTML: redirect sur index.hbs et modifier une todo ou un user
  
- DELETE /ressources/:id *
  - JSON: {message : 'sucess'}
  - HTML: redirect sur index.hbs et supprime une todo ou un user
  
- GET /ressources/add
  - HTML: affiche un formulaire pour ajouter une todo ou un user
  
- GET /ressources/:id/edit
  - HTML: affiche le même formulaire que pour /add mais pour modifier une todo ou un user
  
- GET /users/:id/todos
  - JSON: renvoi les todos de l'utilisateur
  - HTML: affiche un tableau des todos de l'utilisateur


## Installation

MacOs 💻
```sh
sudo npm install -g
```
Windows (executer l'invité de commande en administrateur)
```sh
npm install -g
```
⚠️ Si vous rencontrez une erreur du type 
```sh
Error: Cannot find module 'node_modules/sqlite3/lib/binding/node-v59-linux-x64/node_sqlite3.node'
```
Faites un 
```sh
npm install sqlite3
```
