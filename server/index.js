const Koa = require("koa")
const Router = require("koa-router")
const knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: "./development.db",
        timezone: "UTC"
    },
    acquireConnectionTimeout: 1000,
    useNullAsDefault: true
})

const app = new Koa()
const router = new Router({prefix: "/api/v1"})

//TODO: Authorization control (generate UUID using OAuth response)

// Authentication
const checkAuth = async (ctx, next) => {
    // Token should be "Authorization: Bearer <UUID>"
    const auth = ctx.header.authorization
    if (!auth) {
        throw new Error() // TODO: Return HTTP error status
    }
    const token = auth.split(" ").pop()
    // Authentication (token to user)
    await knex.first("name").where("token", token).from("users")
    .then(username => {
        if (username === undefined) {
            throw new Error() // TODO: Return HTTP error status
        }
        ctx.user = username.name
    })
    await next()
}

// Dislike API
router
.get("/:username/items/:id", checkAuth, async (ctx, next) => {
    // Get disliked status and dislike count from DB
    await knex.select("by_whom").where({id: ctx.params.id, state: true}).from("item_dislike")
    .then(users => {
        ctx.body = {
            disliked: users.map(_=>_.by_whom).includes(ctx.user),
            count: users.length
        }
    })
})
.post("/:username/items/:id", checkAuth, async (ctx, next) => {
    // Set disliked status and get new dislike count
    const {id, username} = ctx.params
    await knex.first("state").where({id, by_whom: ctx.user}).from("item_dislike")
    .then(disliked => {
        if (disliked === undefined) {
            return knex.transaction((trx) => knex("item_dislike")
            .transacting(trx)
            .insert({id, username, by_whom: ctx.user, state: true})
            .then(trx.commit)
            .catch(e => {
                trx.rollback()
                throw e
            }))
        }else if (!disliked.state) {
            return knex.transaction((trx) => knex("item_dislike")
            .transacting(trx)
            .where({id, by_whom: ctx.user})
            .update({state: true})
            .then(trx.commit)
            .catch(e => {
                trx.rollback()
                throw e
            }))
        } else {
            throw new Error() // TODO: Response HTTP response error
        }
    })
    .then(status => {
        ctx.body = {complete: true}
    })
})
.delete("/:username/items/:id", checkAuth, async (ctx, next) => {
    // Unset disliked status and get new dislike count
    const {id, username} = ctx.params
    await knex.first("state").where({id, by_whom: ctx.user}).from("item_dislike")
    .then(disliked => {
        if (disliked === undefined || !disliked.state) {
            throw new Error() // TODO: Response HTTP response error
        }
    })
    .then(knex.transaction((trx) => knex("item_dislike")
        .transacting(trx)
        .where({id, username, by_whom: ctx.user})
        .update({state: false})
        .then(trx.commit)
        .catch((e) => {
            trx.rollback()
            throw e
        })
    ))
    .then(status => {
        ctx.body = {complete: true}
    })
})

app
.use(async (ctx, next) => {
    ctx.req.setTimeout(1000)
    await next()
})
.use(router.routes())
.use(router.allowedMethods())
.listen(3000)
