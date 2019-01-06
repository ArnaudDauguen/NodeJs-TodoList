# NodeJs-TodoList

_Arnaud Dauguen - Quentin Gans Ingesup B2B_

Projet NodeJs : Todolist !

## Description du projet

C'est une todolist qui permet à plusieurs personnes d'ajouter des todos, de les modifier et de les supprimer 😏.
Elle est multiformat c'est à dire qu'elle répond au format **HTML** et au format **JSON**.

## Tables SQL 

- todos : (message, completion, createdAt, updatedAt, userId)
- users : (firstname, lastname, username, password, email, createdAt, updatedAt)

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

### Lancement du serveur

Pour lancer le serveur faites
```js
node index.js
```
Le serveur écoute sur le **port 3000** (libre à vous de le changer)

## Description des différentes routes

*Tips : /ressources correspont aux routes /todos et /users*

- GET /ressources
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
  
- DELETE /ressources/:id
  - JSON: {message : 'sucess'}
  - HTML: redirect sur index.hbs et supprime une todo ou un user
  
- GET /ressources/add
  - HTML: affiche un formulaire pour ajouter une todo ou un user
  
- GET /ressources/:id/edit
  - HTML: affiche le même formulaire que pour /add mais pour modifier une todo ou un user
  
- GET /users/:id/todos
  - JSON: renvoi les todos de l'utilisateur
  - HTML: affiche un tableau des todos de l'utilisateur

## Modules 

- express : Serveur HTTP
- sqlite3 : Creation + connexion avec la base de données
- handlebars : Rendu HTML des différentes routes
- bcrypt : Crypter les mots de passe des users
- method-override : Utilisation de méthode PATCH / DELETE sur des formulaires
