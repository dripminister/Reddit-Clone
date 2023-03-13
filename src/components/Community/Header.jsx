import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react"
import React from "react"
import { FaReddit } from "react-icons/fa"
import useCommunityData from "../../hooks/useCommunityData"

export default function Header({ community }) {
	const { communityStateValue, onJoinOrLeaveCommunity, loading } = useCommunityData()

	const isJoined = communityStateValue.mySnippets.find(
		(item) => item.communityId === community.id
	)

	return (
		<Flex
			direction="column"
			width="100%"
			height="146px"
		>
			<Box
				height="50%"
				bg="blue.400"
			/>
			<Flex
				justify="center"
				bg="white"
				flexGrow={1}
			>
				<Flex
					width="95%"
					maxWidth="860px"
				>
					{communityStateValue?.currentCommunity?.imageURL ? (
						<Image
							borderRadius="full"
							boxSize="66px"
							src={communityStateValue.currentCommunity.imageURL}
							alt="Dan Abramov"
							position="relative"
							top={-3}
							color="blue.500"
							border="4px solid white"
						/>
					) : (
						<Icon
							as={FaReddit}
							fontSize={64}
							position="relative"
							top={-3}
							color="blue.500"
							border="4px solid white"
							borderRadius="50%"
						/>
					)}
					<Flex padding="10px 16px">
						<Flex
							direction="column"
							mr={6}
						>
							<Text
								fontWeight={800}
								fontSize="16pt"
							>
								{community.id}
							</Text>
							<Text
								fontWeight={600}
								fontSize="10pt"
								color="gray.400"
							>
								r/{community.id}
							</Text>
						</Flex>
						<Button
							variant={isJoined ? "outline" : "solid"}
							height="30px"
							pr={6}
							pl={6}
							isLoading={loading}
							onClick={() => onJoinOrLeaveCommunity(community, isJoined)}
						>
							{isJoined ? "Joined" : "Join"}
						</Button>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	)
}
