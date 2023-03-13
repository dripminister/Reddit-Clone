import React, { useState } from "react"
import { Input, Button, Text, Flex } from "@chakra-ui/react"
import { useSetRecoilState } from "recoil"
import { authModalState } from "../../../atoms/authModalAtom"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../../../firebase"
import { setDoc, doc } from "firebase/firestore"

export default function Signup() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const setAuthModalState = useSetRecoilState(authModalState)

	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	const onSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		setError("")

		if (password != confirmPassword) {
			setError("Passwords do not match!")
			setLoading(false)
			return
		}
		try {
			const res = await createUserWithEmailAndPassword(auth, email, password)
			await setDoc(doc(db, "users", res.user.uid), {
				displayName: res.user?.displayName || null,
				email,
				uid: res.user.uid
			})
			
		} catch {
			setError("Something went wrong!")
		}
		setLoading(false)
	}


	return (
		<form onSubmit={onSubmit}>
			<Input
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				type="email"
				placeholder="Email"
				mb={2}
				required
				fontSize="10pt"
				_placeholder={{ color: "gray.500" }}
				_hover={{
					bg: "white",
					border: "1px solid",
					borderColor: "blue.500",
				}}
				_focus={{
					outline: "none",
					bg: "white",
					border: "1px solid",
					borderColor: "blue.500",
				}}
				bg="gray.50"
			/>
			<Input
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				type="password"
				placeholder="Password"
				required
				mb={2}
				fontSize="10pt"
				_placeholder={{ color: "gray.500" }}
				_hover={{
					bg: "white",
					border: "1px solid",
					borderColor: "blue.500",
				}}
				_focus={{
					outline: "none",
					bg: "white",
					border: "1px solid",
					borderColor: "blue.500",
				}}
				bg="gray.50"
			/>
			<Input
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				type="password"
				placeholder="Confirm Password"
				required
				mb={2}
				fontSize="10pt"
				_placeholder={{ color: "gray.500" }}
				_hover={{
					bg: "white",
					border: "1px solid",
					borderColor: "blue.500",
				}}
				_focus={{
					outline: "none",
					bg: "white",
					border: "1px solid",
					borderColor: "blue.500",
				}}
				bg="gray.50"
			/>
			<Text
				textAlign="center"
				color="red"
				fontSize="10pt"
			>
				{error}
			</Text>
			<Button
				width="100%"
				height="36px"
				mt={2}
				mb={2}
				type="submit"
				isLoading={loading}
			>
				Sign Up
			</Button>
			<Flex
				justifyContent="center"
				mb={2}
			>
				<Text
					fontSize="9pt"
					mr={1}
				>
					Forgot your password?
				</Text>
				<Text
					fontSize="9pt"
					color="blue.500"
					cursor="pointer"
					onClick={() =>
						setAuthModalState((prev) => ({
							...prev,
							view: "resetPassword",
						}))
					}
				>
					Reset
				</Text>
			</Flex>
			<Flex
				fontSize="9pt"
				justifyContent="center"
			>
				<Text mr={1}>Already a redditor?</Text>
				<Text
					color="blue.500"
					fontWeight={700}
					cursor="pointer"
					onClick={() =>
						setAuthModalState((prev) => ({
							...prev,
							view: "login",
						}))
					}
				>
					LOG IN
				</Text>
			</Flex>
		</form>
	)
}
