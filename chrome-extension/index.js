const store = new Vuex.Store({
    strict: true,
    state: {
        disliked: false,
        liked: false,
        count: NaN
    },
    mutations: {
        set(state, {count, disliked}) {
            state.count = count
            state.disliked = disliked
        },
        like(state, liked) { state.liked = liked },
        dislike(state) {
            state.disliked = true
            state.count++
        },
        undislike(state) {
            state.disliked = false
            state.count--
        }
    },
    getters: {
        yokunasugiru: state => state.count >= 2
    },
    actions: {
        init({commit}) {
            chrome.storage.sync.get(["service_uri", "token"], ({service_uri, token}) => {
                fetch(`${service_uri}${location.pathname}`, {
                    headers: {"Authorization": `Bearer ${token}`}
                })
                .then(response => response.json())
                .then(status => commit("set", status))
                .catch(console.error)
            })
        },
        dislike({commit, state}) {
            chrome.storage.sync.get(["service_uri", "token"], ({service_uri, token}) => {
                fetch(`${service_uri}${location.pathname}`, {
                    method: state.disliked ? "DELETE" : "POST",
                    headers: {"Authorization": `Bearer ${token}`}
                })
                .then(response => {
                    if (response.ok) {
                        commit(state.disliked ? "undislike" : "dislike")
                    }
                })
                .catch(console.error)
            })
        }
    }
})
store.dispatch("init")

document.addEventListener("DOMContentLoaded", () => {
    // Label vue instance
    document.querySelector("ul.list-unstyled.itemsShowHeaderStock_statusList")
    .children[1].insertAdjacentElement("beforebegin", new Vue({
        template: `
            <li>
                <div>
                    <div class="itemsShowHeaderStock_count">
                        <span class="fa fa-thumbs-down"></span>
                        <span id="yokunaine-counter">{{count}}</span>
                    </div>
                    <div class="itemsShowHeaderStock_countText">よくないね</div>
                </div>
            </li>`,
        computed: {
            count: () => store.state.count
        }
	}).$mount().$el)

    // Warning vue instance
    document.querySelector("[itemprop='articleBody']")
    .insertAdjacentElement("afterbegin", document.createElement("yokunaine-warning"))
    new Vue({
        el: "yokunaine-warning",
        template: `
            <div v-if="yokunasugiru">
                <div class="alert alert-danger">
                    <i class="fa fa-warning"></i>
                    <span>この記事には複数の<b>よくないね</b>がつけられています。</span>
                </div>
            </div>`,
        computed: {
            yokunasugiru: () => store.getters.yokunasugiru
        }
    })

    if (document.querySelector(".ArticleMainHeader .js-likebutton") == null) {
        // My self post
        return
    }

    // Like button wrapper vue instance
    new Vue({
        el: ".ArticleMainHeader .js-likebutton",
        computed: {
            disliked: () => store.state.disliked
        },
        watch: {
            disliked: "stateChange"
        },
        methods: {
            stateChange() {
                const button = this.$el.querySelector("button.p-button")
                if (!button) return
                if (this.disliked) {
                    button.classList.add("disabled")
                } else {
                    button.classList.remove("disabled")
                }
            }
        },
        beforeMount() {
            try {
                store.commit("like", JSON.parse(this.$el.getAttribute("data-props")).like_status)
            } catch (e) {
                console.error(e)
            }
        },
        mounted() {
            // Like button mounting observer
            new MutationObserver((_, mo) => {
                mo.disconnect()
                // Like button click event listener
                this.$el.addEventListener("click", () => {
                    store.commit("like", !store.state.liked)
                }, false)
                this.stateChange()
            }).observe(this.$el, {childList: true, subtree: true})
        }
    })

    // Dislike button
    document.querySelector(".ArticleMainHeader .ArticleMainHeader__users")
    .insertAdjacentElement("beforebegin", new Vue({
        template: `
            <div>
                <div class="LikeButton DislikeButton">
                    <button class="p-button" :class="{disabled: liked, liked: disliked}" @click="dislike">
                        <span class="fa fa-fw" :class="[disliked ? 'fa-check' : 'fa-thumbs-down']"></span>
                        <span>よくないね{{disliked ? "済み" : ""}}</span>
                    </button>
                </div>
            </div>`,
        computed: {
            liked: () => store.state.liked,
            disliked: () => store.state.disliked
        },
        methods: {
            dislike() {
                if (!this.liked) store.dispatch("dislike")
            }
        }
    }).$mount().$el)
}, false)
