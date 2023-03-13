import React, { useEffect } from "react"
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
} from "@chakra-ui/react"
import { useRecoilState } from "recoil"
import { authModalState } from "../../../atoms/authModalAtom"
import { Flex, Text } from "@chakra-ui/react"
import AuthInputs from "./AuthInputs"
import OAuthButtons from "./OAuthButtons"
import { auth } from "../../../firebase"
import ResetPassword from "./ResetPassword"

export default function AuthModal() {
	const [modalState, setModalState] = useRecoilState(authModalState)
	const user = auth?.currentUser

	const handleClose = () => {
		setModalState((prev) => ({
			...prev,
			open: false,
		}))
	}

	useEffect(() => {
		if (user) handleClose()
	}, [user])

	return (
		<>
			<Modal
				isOpen={modalState.open}
				onClose={handleClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign="center">
						{modalState.view === "login" && "Login"}
						{modalState.view === "signup" && "Sign Up"}
						{modalState.view === "resetPassword" && "Reset Password"}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						display="flex"
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						pb={6}
					>
						<Flex
							direction="column"
							align="center"
							justify="center"
							width="70%"
						>
							{modalState.view === "login" || modalState.view === "signup" ? (
								<>
									<OAuthButtons />
									<Text
										color="gray.500"
										fontWeight={700}
									>
										OR
									</Text>
									<AuthInputs />
								</>
							) : (
								<ResetPassword />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	)
}
