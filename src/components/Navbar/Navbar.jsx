import React, { useState } from 'react'
import { Flex, Image } from "@chakra-ui/react"
import Directory from './Directory/Directory'
import SearchInput from './SearchInput'
import RightContent from './RightContent/RightContent'
import { auth } from '../../firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function Navbar() {

	const [user, setUser] = useState(null)

	onAuthStateChanged(auth, (cUser) => {
		setUser(cUser)
	})
 
  return (
		<Flex
			bg="white"
			height="44px"
			padding="6px 12px"
		>
			<Flex align="center">
				<Image
					src="/images/redditFace.svg"
					height="30px"
				/>
				<Image
					display={{ base: "none", md: "unset" }}
					src="/images/redditText.svg"
					height="46px"
				/>
			</Flex>
			{user && <Directory />}
			<SearchInput user={user} />
			<RightContent user={user} />
		</Flex>
	)
}
