const db = require('sqlite')
const _ = require('lodash')

module.exports = {
  getAll() {
    return db.all("SELECT rowid AS id, * FROM todos")
  },
  getAllUsers() {
    return db.all("SELECT rowid AS id, * FROM users")
  },
  findOne(id) {
    return db.get("SELECT rowid AS id, * FROM todos WHERE rowid = ?", id)
  },
  findOneUser(id) {
    return db.get("SELECT rowid AS id, * FROM users WHERE rowid = ?", id)
  },
  async create(params) {

    const data = _.values(params)

    const { lastID } = await db.run("INSERT INTO todos VALUES(?, ?, date('now'), date('now'), ?)", data)

    return this.findOne(lastID)
  },
  async createUser(params) {

    const data = _.values(params)

    const { lastID } = await db.run("INSERT INTO users VALUES(?, ?, ?, ?, ?, date('now'), date('now'))", data)

    return this.findOneUser(lastID)
  },
  delete(id) {
    return db.run("DELETE FROM todos WHERE rowid = ?", id)
  },
  deleteUser(id) {
    return db.run("DELETE FROM users WHERE rowid = ?", id)
  },
  async update(params) {
    let string = ''

    for (k in params) {
      if (k !== 'id') {
        string += k + ' = ?,'
      }
    }

    string = string.substring(0, string.length - 1); // Remove last comma

    const data = _.values(params)
    const { changes } = await db.run("UPDATE todos SET " + string + " WHERE rowid = ?", data)
    
    if (changes !== 0) {
      return this.findOne(params.id)
    } else {
      return Promise.reject({ message: 'Could not find id' })
    }
  },
  async updateUser(params) {
    let string = ''

    for (k in params) {
      if (k !== 'id') {
        string += k + ' = ?,'
      }
    }

    string = string.substring(0, string.length - 1); // Remove last comma

    const data = _.values(params)
    const { changes } = await db.run("UPDATE users SET " + string + " WHERE rowid = ?", data)
    
    if (changes !== 0) {
      return this.findOneUser(params.id)
    } else {
      return Promise.reject({ message: 'Could not find id' })
    }
  },
}