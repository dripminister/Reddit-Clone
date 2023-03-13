import React from "react"
import { Flex, Button, Image } from "@chakra-ui/react"
import { auth, provider } from "../../../firebase"
import { signInWithPopup } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"
import { db } from "../../../firebase"

export default function OAuthButtons() {
	const logIn = async () => {
		try {
			const res = await signInWithPopup(auth, provider)
			await setDoc(doc(db, "users", res.user.uid), {
				displayName: res.user?.displayName || null,
				email: res.user.email,
				uid: res.user.uid
			})
		} catch (err) {
			console.log(err)
		}
	}
	return (
		<Flex
			direction="column"
			width="100%"
			mb={4}
		>
			<Button
				variant="oauth"
				mb={2}
				onClick={logIn}
			>
				<Image
					src="images/googlelogo.png"
					height="20px"
					mr={4}
				/>
				Continue with Google
			</Button>
			<Button variant="oauth">Other Provider</Button>
		</Flex>
	)
}
