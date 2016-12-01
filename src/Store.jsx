import {createStore} from "redux"

export const INITIAL_STATE = Symbol("Initial state")
export const LIKED_STATE = Symbol("Liked state")
export const SET_DISLIKE = Symbol("Set dislike")
export const UNSET_DISLIKE = Symbol("Unset dislike")

const dislikeStore = (state = {disliked: false, liked: false, count: 0}, action) => {
    switch (action.type) {
        case INITIAL_STATE:
            for (const prop in action.data) {
                state[prop] = action.data[prop]
            }
            return state
        case LIKED_STATE:
            state.liked = action.data
            return state
        case SET_DISLIKE:
            state.disliked = true
            state.count++
            return state
        case UNSET_DISLIKE:
            state.disliked = false
            state.count--
            return state
        default:
            return state
    }
}

export const Store = createStore(dislikeStore)
