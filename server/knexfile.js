module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './development.db',
      timezone: 'UTC'
    },
    acquireConnectionTimeout: 1000,
    useNullAsDefault: true
  },
  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}

const Knex = require('knex')
const knex = Knex(module.exports[process.env.NODE_ENV || 'development'])

// Create table
knex.schema.createTableIfNotExists('users', (table) => {
  table.string('id').primary()
  table.string('token')
  table.boolean('revoked')
  table.timestamps(true, true)
})
.then(() => console.log('Users table initialize done.'))

knex.schema.createTableIfNotExists('item_dislike', (table) => {
  table.string('by_whom')
  table.string('username')
  table.string('id')
  table.boolean('state')
  table.timestamps(true, true)
  table.primary('by_whom', 'id')
})
.then(() => console.log('Item_dislike table initialize done.'))

knex.schema.createTableIfNotExists('access_log', (table) => {
  table.string('method')
  table.string('ip')
  table.integer('status')
  table.string('path')
  table.integer('length')
  table.string('ua')
  table.string('lang')
  table.string('protocol')
  table.string('user')
  table.timestamps(true, true)
})
.then(() => console.log('Access_log table initialize done.'))
