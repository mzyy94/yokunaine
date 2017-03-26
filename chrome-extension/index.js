document.addEventListener("DOMContentLoaded", () => {
    const $ = document.querySelector.bind(document)
    // Label vue instance
    const label = new Vue({
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
        data: {
            count: NaN
        }
    })

    $("ul.itemsShowHeaderStock_statusList li").insertAdjacentElement("afterend", label.$mount().$el)

    // Warning vue instance
    $("[itemprop='articleBody']").insertAdjacentElement("afterbegin", document.createElement("yokunaine-warning"))
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
            yokunasugiru: () => label.count >= 2
        }
    })

    const button = new Vue({
        template: `
            <div>
                <div class="LikeButton DislikeButton">
                    <button class="p-button" :class="{disabled: liked, liked: disliked}" @click="dislike">
                        <span class="fa fa-fw" :class="[disliked ? 'fa-check' : 'fa-thumbs-down']"></span>
                        <span>よくないね{{disliked ? "済み" : ""}}</span>
                    </button>
                </div>
            </div>`,
        data: {
            liked: false,
            disliked: false
        },
        methods: {
            dislike() {
                if (this.liked) {
                    return
                }
                chrome.storage.sync.get(["service_uri", "token"], ({service_uri, token}) => {
                    fetch(`${service_uri}${location.pathname}`, {
                        method: this.disliked ? "DELETE" : "POST",
                        headers: {"Authorization": `Bearer ${token}`}
                    })
                    .then(response => {
                        if (response.ok) {
                            if (this.disliked) {
                                label.count--
                            } else {
                                label.count++
                            }
                            this.disliked = !this.disliked
                        }
                    })
                    .catch(console.error)
                })
            }
        }
    })

    chrome.storage.sync.get(["service_uri", "token"], ({service_uri, token}) => {
        fetch(`${service_uri}${location.pathname}`, {
            headers: {"Authorization": `Bearer ${token}`}
        })
        .then(response => response.json())
        .then(({disliked, count}) => {
            button.disliked = disliked
            label.count = count
        })
        .catch(console.error)
    })

    if ($(".ArticleMainHeader .js-likebutton") == null) {
        // My self post
        return
    }

    // Like button wrapper vue instance
    new Vue({
        el: ".ArticleMainHeader .js-likebutton",
        computed: {
            disliked: () => button.disliked
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
                button.liked = JSON.parse(this.$el.getAttribute("data-props")).like_status
            } catch (e) {
                console.error(e)
            }
        },
        mounted() {
            // Like button mounting observer
            new MutationObserver((_, mo) => {
                mo.disconnect()
                // Like button click event listener
                this.$el.addEventListener("click", (eve) => {
                    button.liked = !button.liked
                }, false)
                this.stateChange()
            }).observe(this.$el, {childList: true, subtree: true})
        }
    }).$el.insertAdjacentElement("afterend", button.$mount().$el)
}, false)
