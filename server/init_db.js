const uuid = require("uuid")
const knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: "./development.db",
        timezone: "UTC"
    },
    acquireConnectionTimeout: 1000,
    useNullAsDefault: true
})

// Create table
knex.schema.createTableIfNotExists("users", (table) => {
    table.string("name").primary()
    table.string("token")
    table.string("source")
    table.timestamps()
})
.then(() => console.log("Users table initialize done."))

knex.schema.createTableIfNotExists("item_dislike", (table) => {
    table.string("by_whom")
    table.string("username")
    table.string("id")
    table.boolean("state")
    table.timestamps()
    table.primary("by_whom", "id")
})
.then(() => console.log("Item_dislike table initialize done."))

// Create test account
const token = uuid.v1()
const suffix = new Date().getMilliseconds()
knex("users").insert({name: `testuser${suffix}`, token: token, source: "github" })
.then(() => console.log(`New user testuser${suffix} created.
Request with "Authorization: Bearer ${token}" http header.
`))
