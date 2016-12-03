const Koa = require("koa")
const Router = require("koa-router")
const app = new Koa()
const router = new Router({prefix: "/api/v1"})

//TODO: Authorization control (generate UUID using OAuth response)

// Authentication
const checkAuth = async (ctx, next) => {
    // Token should be "Authorization: Bearer <UUID>"
    const token = ctx.header.authorization
    // TODO: Authentication (token to user)
    await Promise.resolve("username")
    .then(username => {
        ctx.user = username
        next()
    })
}

// Dislike API
router
.get("/:username/items/:id", checkAuth, async (ctx, next) => {
    // TODO: Get disliked status and dislike count from DB
    await Promise.resolve({disliked: Math.random() < 0.5, count: (Math.random() * 100) | 0})
    .then(status => {
        ctx.body = status
    })
})
.post("/:username/items/:id", checkAuth, async (ctx, next) => {
    // TODO: Set disliked status and get new dislike count
    await Promise.resolve({disliked: Math.random() < 0.5, count: (Math.random() * 100) | 0})
    .then(status => {
        ctx.body = status
    })
})
.delete("/:username/items/:id", checkAuth, async (ctx, next) => {
    // TODO: Unset disliked status and get new dislike count
    await Promise.resolve({disliked: Math.random() < 0.5, count: (Math.random() * 100) | 0})
    .then(status => {
        ctx.body = status
    })
})



app
.use(router.routes())
.use(router.allowedMethods())
.listen(3000)
