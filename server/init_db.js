const Knex = require("knex")
const knex = Knex(require("./knexfile.js")[process.env.NODE_ENV || "development"])

// Create table
knex.schema.createTableIfNotExists("users", (table) => {
    table.string("id").primary()
    table.string("token")
    table.boolean("revoked")
    table.timestamps(true, true)
})
.then(() => console.log("Users table initialize done."))

knex.schema.createTableIfNotExists("item_dislike", (table) => {
    table.string("by_whom")
    table.string("username")
    table.string("id")
    table.boolean("state")
    table.timestamps(true, true)
    table.primary("by_whom", "id")
})
.then(() => console.log("Item_dislike table initialize done."))

knex.schema.createTableIfNotExists("access_log", (table) => {
    table.string("method")
    table.string("ip")
    table.integer("status")
    table.string("path")
    table.integer("length")
    table.string("ua")
    table.string("lang")
    table.string("protocol")
    table.string("user")
    table.timestamps(true, true)
})
.then(() => console.log("Access_log table initialize done."))
