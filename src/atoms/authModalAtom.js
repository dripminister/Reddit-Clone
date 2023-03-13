import { atom } from "recoil"

export const authModalState = atom({
	key: "authModalState",
	default: { view: "login", open: false },
})
