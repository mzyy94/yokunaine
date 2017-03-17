"use strict"

// require modules
const Koa = require("koa")
const Router = require("koa-router")
const Knex = require("knex")
const ratelimit = require("koa-ratelimit-lru")
const rp = require("request-promise")
const crypto = require("crypto")
const uuid = require("uuid")

// define constant values
const app = new Koa()
const router = new Router({prefix: "/api/v1"})
const secretKey = crypto.randomBytes(32).hexSlice()
const {client_id, client_secret, port, rate_limit, NODE_ENV} = process.env
const knex = Knex(require("./knexfile.js")[NODE_ENV || "development"])
const endpoint = "https://qiita.com/api/v2"

// routing
router
.get("/auth", async (ctx, next) => {
    // request Authentication
    const {callback} = ctx.query
    ctx.assert(callback, 400, null, {detail: `Missing Parameter "callback"`})
    const token = crypto.randomBytes(32).hexSlice()
    const expires = new Date(Date.now() + 300000)
    ctx.cookies.set("callback", callback, {expires})
    .set("token", crypto.createHmac("sha256", secretKey).update(token).digest("hex"), {expires})
    ctx.redirect(`${endpoint}/oauth/authorize?client_id=${client_id}&scope=read_qiita&state=${token}`)
    await next()
})
.get("/auth/callback", async (ctx, next) => {
    // generate Authorization
    const {code, state} = ctx.query
    const token = ctx.cookies.get("token")
    ctx.assert(code && state, 400, null, {detail: `Missing Parameter(s) "code" and/or "state"`})
    ctx.assert(ctx.cookies.get("callback") && token, 400, null, {detail: `Missing Cookie(s) "callback" and/or "token"`})
    ctx.assert(crypto.createHmac("sha256", secretKey).update(state).digest("hex") === token, 400, null, {detail: `Invalid token`})
    ctx.cookies.set("token")
    await new Promise(resolve => setTimeout(resolve, 500))
    await rp({
        method: "POST",
        uri: `${endpoint}/access_tokens`,
        body: {client_id, client_secret, code},
        json: true
    })
    .then(auth => {
        ctx.assert(auth.client_id === client_id, 500, null, {detail: "Internal OAuth Request Failed"})
        return Promise.all([
            auth.token,
            rp({
                uri: `${endpoint}/authenticated_user`,
                headers: {"Authorization": `Bearer ${auth.token}`},
                json: true
            })
        ])
    })
    .then(([token, user]) => Promise.all([
        user,
        rp({
            method: "DELETE",
            uri: `${endpoint}/access_tokens/${token}`
        })
    ]))
    .then(([user]) => Promise.all([
        user.id,
        knex("users").first("id").where({id: user.id})
    ]))
    .then(([id, exists]) => {
        const token = uuid.v1()
        const process = [token]
        if (!exists) {
            process.push(knex("users").insert({id, token, revoked: false}))
        } else {
            process.push(knex("users").where({id}).update({revoked: false, token, updated_at: knex.fn.now()}))
        }
        return Promise.all(process)
    })
    .then(([token]) => {
        ctx.redirect(`${ctx.cookies.get("callback")}?token=${token}`)
        ctx.cookies.set("callback")
    }).catch(() => {
        ctx.throw(500, null, {detail: "Internal OAuth Request Failed"})
    })
    await next()
})
.delete("/auth/token/:token", async (ctx, next) => {
    // revoke token
    const {token} = ctx.params
    await knex("users").first("id", "revoked").where("token", token)
    .then(user => {
        ctx.assert(user, 404, null, {detail: `A token "${token}" is not found in this service`})
        ctx.assert(!user.revoked, 400, null, {detail: `A token "${token}" is already revoked`})
        return knex("users").where({id: user.id}).update({revoked: true, updated_at: knex.fn.now()})
    })
    .then(() => ctx.body = {complete: true})
    await next()
})
.use("/:username/items/:id", async (ctx, next) => {
    // authentication
    const auth = ctx.header.authorization
    ctx.assert(auth, 401, null, {detail: "Missing Authorization Header"})
    const token = auth.replace(/^Bearer /, "")
    await knex("users").first("id").where({token, revoked: false})
    .then(user => {
        ctx.assert(user, 403, null, {detail: "Invalid Authorization Token"})
        ctx.user = user.id
    })
    await next()
})
.get("/:username/items/:id", async (ctx, next) => {
    // get disliked status and dislike count from DB
    await knex("item_dislike").select("by_whom").where({id: ctx.params.id, state: true})
    .then(users => {
        ctx.body = {
            disliked: users.map(_=>_.by_whom).includes(ctx.user),
            count: users.length
        }
    })
    await next()
})
.post("/:username/items/:id", async (ctx, next) => {
    // set disliked status
    const {id, username} = ctx.params
    await knex("item_dislike").first("state").where({id, by_whom: ctx.user})
    .then(disliked => {
        if (disliked === undefined) {
            return knex("item_dislike").insert({id, username, by_whom: ctx.user, state: true})
        } else if (!disliked.state) {
            return knex("item_dislike").where({id, by_whom: ctx.user}).update({state: true, updated_at: knex.fn.now()})
        } else {
            ctx.throw(409, null, {detail: "Already Disliked"})
        }
    })
    .then(() => ctx.body = {complete: true})
    await next()
})
.delete("/:username/items/:id", async (ctx, next) => {
    // unset disliked status
    const {id} = ctx.params
    await knex("item_dislike").first("state").where({id, by_whom: ctx.user})
    .then(disliked => ctx.assert(disliked && disliked.state, 404, "Not Found"))
    .then(() => knex("item_dislike").where({id, by_whom: ctx.user}).update({state: false, updated_at: knex.fn.now()}))
    .then(() => ctx.body = {complete: true})
    await next()
})
.get("/statistics/dislike", async (ctx, next) => {
    await knex("item_dislike").count("*").where({state: true})
    .then(([result]) => ctx.body = {total: result["count(*)"] | 0})
    await next()
})

// run API Server
app
.use(async (ctx, next) => {
    await next()
    const {method, ip, status, path, length, protocol, user, headers: {"user-agent": ua, "accept-language": lang}} = ctx
    knex("access_log").insert({method, ip, status, path, length, ua, lang, protocol, user})
    .then(() => console.log(method, ip, status, path, length, ua, lang, protocol, user))
})
.use(async (ctx, next) => {
    // set cors headers
    ctx.set("Access-Control-Allow-Origin", "*")
    ctx.set("Access-Control-Allow-Headers", "Authorization")
    ctx.set("Access-Control-Allow-Methods", "GET, PUT, DELETE")
    ctx.req.setTimeout(10000)
    try {
        await next()
        if (ctx.status === 404) {
            ctx.throw(404, "Not Found")
        }
    } catch (e) {
        console.error(e.message)
        ctx.status = e.status || 500
        ctx.body = {type: "about:blank", status: ctx.status, title: e.status ? e.message : "Internal Server Error", detail: e.detail}
        ctx.set("Content-Type", "application/problem+json; charset=utf-8")
    }
})
.use(ratelimit({duration: 60000, rate: rate_limit || 30, id: ctx => `${ctx.method}${ctx.user}${ctx.ip}`, throw: true}))
.use(router.routes())
.use(router.allowedMethods({throw: true}))
.listen(+port || 3000)
