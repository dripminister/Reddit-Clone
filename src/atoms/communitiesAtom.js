import { atom } from "recoil"

export const communityState = atom({
	key: "communityState",
	default: {
		mySnippets: [],
		currentCommunity: "",
		snippetsFetched: false
	}
})