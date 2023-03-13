import React from "react"
import { Box, Flex, Text } from "@chakra-ui/react"
import NewPostForm from "../components/Posts/NewPostForm"
import { auth } from "../firebase"
import { useRecoilValue } from "recoil"
import { communityState } from "../atoms/communitiesAtom"
import useCommunityData from "../hooks/useCommunityData"
import About from "../components/Community/About"

export default function Submit() {
	const user = auth?.currentUser
	const { communityStateValue } = useCommunityData()

	return (
		<Flex
			justify="center"
			p="16px 0px"
		>
			<Flex
				width="95%"
				justify="center"
				maxWidth="860px"
			>
				<Flex
					flexDirection="column"
					width={{ base: "100%", md: "65%" }}
					mr={{ base: 0, md: 6 }}
				>
					<Box
						p="14px 0px"
						borderBottom="1px solid"
						borderColor="white"
					>
						<Text>Create a post</Text>
					</Box>
					{user && <NewPostForm user={user} communityImageUrl={communityStateValue.currentCommunity?.imageURL}/>}
				</Flex>
				<Flex
					flexDirection="column"
					display={{ base: "none", md: "flex" }}
					flexGrow={1}
				>
					{communityState.currentCommunity && (
						<About communityData={communityStateValue.currentCommunity} />
					)}
				</Flex>
			</Flex>
		</Flex>
	)
}
