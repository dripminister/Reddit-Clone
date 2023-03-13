import React from "react"
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuItemOption,
	MenuGroup,
	MenuOptionGroup,
	MenuDivider,
	Button,
	Flex,
	Icon,
    Box,
    Text
} from "@chakra-ui/react"
import { FaRedditSquare } from "react-icons/fa"
import { VscAccount } from "react-icons/vsc"
import { IoSparkles } from "react-icons/io5"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { CgProfile } from "react-icons/cg"
import { MdOutlineLogin } from "react-icons/md"
import { signOut } from "firebase/auth"
import { auth } from "../../../firebase"
import { useResetRecoilState, useSetRecoilState } from "recoil"
import { authModalState } from "../../../atoms/authModalAtom"
import { communityState } from "../../../atoms/communitiesAtom"

export default function UserMenu({ user }) {

	const resetCommunityState = useResetRecoilState(communityState)
    const setAuthModalState = useSetRecoilState(authModalState)

	const logout = async () => {
		await signOut(auth)
		// resetCommunityState()
	}

	return (
		<Menu>
			<MenuButton
				cursor="pointer"
				padding="0px 6px"
				borderRadius={4}
				_hover={{ outline: "1px solid", outlineColor: "gray.200" }}
			>
				<Flex align="center">
					<Flex align="center">
						{user ? (
							<>
								<Icon
									as={FaRedditSquare}
									fontSize={24}
									mr={1}
									color="gray.300"
								/>
								<Box
									display={{ base: "none", lg: "flex" }}
									flexDirection="column"
									fontSize="8pt"
									alignItems="flex-start"
									mr={8}
								>
									<Text fontWeight={700}>
										{user?.displayName || user?.email?.split("@")[0]}
									</Text>
									<Flex alignItems="center">
										<Icon
											as={IoSparkles}
											color="brand.100"
											mr={1}
										/>
										<Text color="gray.400">1 karma</Text>
									</Flex>
								</Box>
							</>
						) : (
							<Icon
								as={VscAccount}
								fontSize={24}
								mr={1}
								color="gray.400"
							/>
						)}
					</Flex>
					<ChevronDownIcon />
				</Flex>
			</MenuButton>
			<MenuList>
				{user ? (
					<>
						<MenuItem
							fontSize="10px"
							fontWeight={700}
							_hover={{ bg: "blue.500", color: "white" }}
						>
							<Flex align="center">
								<Icon
									as={CgProfile}
									fontSize={20}
									mr={2}
								/>{" "}
								Profile
							</Flex>
						</MenuItem>
						<MenuDivider />
						<MenuItem
							fontSize="10px"
							fontWeight={700}
							_hover={{ bg: "blue.500", color: "white" }}
							onClick={logout}
						>
							<Flex align="center">
								<Icon
									as={MdOutlineLogin}
									fontSize={20}
									mr={2}
								/>{" "}
								Log Out
							</Flex>
						</MenuItem>
					</>
				) : (
					<>
						<MenuItem
							fontSize="10px"
							fontWeight={700}
							_hover={{ bg: "blue.500", color: "white" }}
							onClick={() => setAuthModalState({ open: true, view: "login" })}
						>
							<Flex align="center">
								<Icon
									as={MdOutlineLogin}
									fontSize={20}
									mr={2}
								/>{" "}
								Log In / Sign Up
							</Flex>
						</MenuItem>
					</>
				)}
			</MenuList>
		</Menu>
	)
}
