import { atom } from "recoil"

export const postState = atom({
	key: "postState",
	default: {
		selectedPost: null,
		posts: [],
		postVotes: [],
		// postsCache: {},
		// postUpdateRequired: true
	},
})
