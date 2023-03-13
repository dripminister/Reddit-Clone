import React, { useState } from "react"
import { Input, Button, Text, Flex } from "@chakra-ui/react"
import { useSetRecoilState } from "recoil"
import { authModalState } from "../../../atoms/authModalAtom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../../firebase"

export default function Login() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const setAuthModalState = useSetRecoilState(authModalState)
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	const onSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		setError("")
		try {
			await signInWithEmailAndPassword(auth, email, password)
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
				Log In
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
				<Text mr={1}>New here?</Text>
				<Text
					color="blue.500"
					fontWeight={700}
					cursor="pointer"
					onClick={() =>
						setAuthModalState((prev) => ({
							...prev,
							view: "signup",
						}))
					}
				>
					SIGN UP
				</Text>
			</Flex>
		</form>
	)
}
