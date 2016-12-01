import {createStore} from "redux";

export const SET_DISLIKE = Symbol("Set dislike");
export const UNSET_DISLIKE = Symbol("Unset dislike");

const dislikeStore = (state = {disliked: false, liked: false, count: 0}, action) => {
	switch (action.type) {
		case SET_DISLIKE:
			state.disliked = true;
			state.count++;
			return state;
		case UNSET_DISLIKE:
			state.disliked = false;
			state.count--;
			return state;
		default:
			return state;
	}
}

export const Store = createStore(dislikeStore);
