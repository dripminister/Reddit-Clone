import React from "react"
import { Flex, Button } from "@chakra-ui/react"
import AuthButtons from "./AuthButtons"
import AuthModal from "../../Modal/Auth/AuthModal"
import { signOut } from "firebase/auth"
import { auth } from "../../../firebase"
import Icons from "./Icons"
import UserMenu from "./UserMenu"

export default function RightContent({user}) {

	return (
		<>
			<AuthModal />
			<Flex
				justify="center"
				align="center"
			>
				{user ? <Icons /> : <AuthButtons />}
				<UserMenu user={user}/>
			</Flex>
		</>
	)
}
