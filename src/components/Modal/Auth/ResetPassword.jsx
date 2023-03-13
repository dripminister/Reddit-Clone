import React, { useState } from "react"
import { useSetRecoilState } from "recoil"
import { Button, Flex, Icon, Input, Text } from "@chakra-ui/react"
import { BsDot, BsReddit } from "react-icons/bs"
import { authModalState, ModalView } from "../../../atoms/authModalAtom"
import { auth } from "../../../firebase"
import { sendPasswordResetEmail } from "firebase/auth"


export default function ResetPassword() {
	const setAuthModalState = useSetRecoilState(authModalState)
	const [email, setEmail] = useState("")
	const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)

	const onSubmit = async (e) => {
		e.preventDefault()
    setError("")
    setSending(true)

    try{
      await sendPasswordResetEmail(email)
      setSuccess(true)
    }catch{
      setError("Something went wrong. Try again!")
    }
    setSending(false)
	}
	return (
		<Flex
			direction="column"
			alignItems="center"
			width="100%"
		>
			<Icon
				as={BsReddit}
				color="brand.100"
				fontSize={40}
				mb={2}
			/>
			<Text
				fontWeight={700}
				mb={2}
			>
				Reset your password
			</Text>
			{success ? (
				<Text mb={4}>Check your email :)</Text>
			) : (
				<>
					<Text
						fontSize="sm"
						textAlign="center"
						mb={2}
					>
						Enter the email associated with your account and we will send you a
						reset link
					</Text>
					<form
						onSubmit={onSubmit}
						style={{ width: "100%" }}
					>
						<Input
							required
							name="email"
							placeholder="email"
							type="email"
							mb={2}
							onChange={(event) => setEmail(event.target.value)}
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
							fontSize="10pt"
							color="red"
						>
							{error}
						</Text>
						<Button
							width="100%"
							height="36px"
							mb={2}
							mt={2}
							type="submit"
							isLoading={sending}
						>
							Reset Password
						</Button>
					</form>
				</>
			)}
			<Flex
				alignItems="center"
				fontSize="9pt"
				color="blue.500"
				fontWeight={700}
				cursor="pointer"
			>
				<Text
					onClick={() =>
						setAuthModalState((prev) => ({
							...prev,
							view: "login",
						}))
					}
				>
					LOGIN
				</Text>
				<Icon as={BsDot} />
				<Text
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
		</Flex>
	)
}
