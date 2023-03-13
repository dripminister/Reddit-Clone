import React, { useState } from "react"
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	Box,
	Divider,
	Text,
	Input,
	Checkbox,
	Stack,
	Flex,
	Icon,
} from "@chakra-ui/react"
import { BsFillEyeFill } from "react-icons/bs"
import { BsFillPersonFill } from "react-icons/bs"
import { HiLockClosed } from "react-icons/hi"
import { auth, db } from "../../../firebase"
import {
	doc,
	runTransaction,
	serverTimestamp,
} from "firebase/firestore"
import { useNavigate } from "react-router-dom"

export default function CreateCommunityModal({ open, handleClose }) {
	const [communityName, setCommunityName] = useState("")
	const [charsRemaining, setCharsRemaining] = useState(21)
	const [communityType, setCommunityType] = useState("public")
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const handleCreateCommunity = async () => {
		setLoading(true)
		setError("")
		const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/
		if (format.test(communityName) || communityName.length < 3) {
			setError(
				"Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores."
			)
			setLoading(false)
			return
		}

		try {
			const communityDocRef = doc(db, "communities", communityName)

			await runTransaction(db, async (transaction) => {
				const communityDoc = await transaction.get(communityDocRef)
				if (communityDoc.exists()) {
					setError(`Sorry, r/${communityName} is taken. Try another.`)
					setLoading(false)
					return
				}
				transaction.set(communityDocRef, {
					creatorId: auth.currentUser.uid,
					createdAt: serverTimestamp(),
					numberOfMembers: 1,
					privacyType: communityType,
				})

                transaction.set(doc(db, `users/${auth.currentUser.uid}/communitySnippets`, communityName),{
                    communityId: communityName,
                    isModerator: true
                })
			})
			handleClose()
			navigate(`r/${communityName}`)
		} catch (err) {
			console.log(err)
		}
		setLoading(false)
	}

	return (
		<>
			<Modal
				isOpen={open}
				onClose={handleClose}
				size="lg"
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						display="flex"
						flexDirection="column"
						fontSize={15}
						padding={3}
					>
						Create Community
					</ModalHeader>
					<Box
						pl={3}
						pr={3}
					>
						<Divider />
						<ModalCloseButton />
						<ModalBody
							display="flex"
							flexDirection="column"
							padding="10px 0px"
						>
							<Text
								fontWeight={600}
								fontSize={15}
							>
								Name
							</Text>
							<Text
								fontSize={11}
								color="gray.500"
							>
								Community names including capitalization cannot be changed
							</Text>
							<Text
								position="relative"
								top="28px"
								left="10px"
								width="20px"
								color="gray.400"
							>
								r/
							</Text>
							<Input
								position="relative"
								value={communityName}
								maxLength="21"
								size="sm"
								pl="22px"
								onChange={(e) => setCommunityName(e.target.value)}
							/>
							<Text color={communityName.length === 21 ? "red" : "gray.500"}>
								{charsRemaining - communityName.length} Characters remaining
							</Text>
							<Text
								fontSize="9pt"
								color="red"
								pt={1}
							>
								{error}
							</Text>
							<Box
								mt={4}
								mb={4}
							>
								<Text
									fontWeight={600}
									fontSize={15}
								>
									Community Type
								</Text>
								<Stack spacing={2}>
									<Checkbox
										onChange={(e) => setCommunityType("public")}
										isChecked={communityType === "public"}
									>
										<Flex alignItems="center">
											<Icon
												as={BsFillPersonFill}
												mr={2}
												color="gray.500"
											/>
											<Text
												fontSize="10pt"
												mr={1}
											>
												Public
											</Text>
											<Text
												fontSize="8pt"
												color="gray.500"
												pt={1}
											>
												Anyone can view, post, and comment to this community
											</Text>
										</Flex>
									</Checkbox>
									<Checkbox
										onChange={(e) => setCommunityType("restricted")}
										isChecked={communityType === "restricted"}
									>
										<Flex alignItems="center">
											<Icon
												as={BsFillEyeFill}
												color="gray.500"
												mr={2}
											/>
											<Text
												fontSize="10pt"
												mr={1}
											>
												Restricted
											</Text>
											<Text
												fontSize="8pt"
												color="gray.500"
												pt={1}
											>
												Anyone can view this community, but only approved users
												can post
											</Text>
										</Flex>
									</Checkbox>
									<Checkbox
										onChange={(e) => setCommunityType("private")}
										isChecked={communityType === "private"}
									>
										<Flex alignItems="center">
											<Icon
												as={HiLockClosed}
												color="gray.500"
												mr={2}
											/>
											<Text
												fontSize="10pt"
												mr={1}
											>
												Private
											</Text>
											<Text
												fontSize="8pt"
												color="gray.500"
												pt={1}
											>
												Only approved users can view and submit to this
												community
											</Text>
										</Flex>
									</Checkbox>
								</Stack>
							</Box>
						</ModalBody>
					</Box>

					<ModalFooter
						bg="gray.100"
						borderRadius="0px 0px 10px 10px"
					>
						<Button
							variant="outline"
							height="30px"
							mr={3}
							onClick={handleClose}
						>
							Cancel
						</Button>
						<Button
							height="30px"
							onClick={handleCreateCommunity}
							isLoading={loading}
						>
							Create Community
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}
