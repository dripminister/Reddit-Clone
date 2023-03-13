import React, { useState } from "react"
import {
	Flex,
	Icon,
	Image,
	Skeleton,
	Spinner,
	Stack,
	Text,
} from "@chakra-ui/react"
import { AiOutlineDelete } from "react-icons/ai"
import { BsChat, BsDot } from "react-icons/bs"
import { FaMonument, FaReddit } from "react-icons/fa"
import {
	IoArrowDownCircleOutline,
	IoArrowDownCircleSharp,
	IoArrowRedoOutline,
	IoArrowUpCircleOutline,
	IoArrowUpCircleSharp,
	IoBookmarkOutline,
} from "react-icons/io5"
import moment from "moment"
import { Link, useNavigate } from "react-router-dom"

export default function PostItem({
	post,
	userIsCreator,
	userVoteValue,
	onVote,
	onDeletePost,
	onSelectPost,
	homePage,
}) {
	const [loadingImage, setLoadingImage] = useState(true)
	const [error, setError] = useState(false)
	const [loadingDelete, setLoadingDelete] = useState(false)
	const singlePostPage = !onSelectPost
	const navigate = useNavigate()

	const handleDelete = async (event) => {
		event.stopPropagation()
		setLoadingDelete(true)
		try {
			const success = await onDeletePost(post)

			if (!success) {
				throw new Error("Failed to delete post!")
			}
			if (singlePostPage) {
				navigate(`/r/${post.communityId}`)
			}
			console.log("Post deleted successfully!")
		} catch (error) {
			console.log(error)
			setError(error.message)
		}
		setLoadingDelete(false)
	}

	return (
		<Flex
			border="1px solid"
			bg="white"
			borderColor={singlePostPage ? "white" : "gray.300"}
			borderRadius={singlePostPage ? "4px 4px 0px 0px" : "4px"}
			cursor={singlePostPage ? "unset" : "pointer"}
			_hover={{ borderColor: singlePostPage ? "none" : "gray.500" }}
			onClick={() => onSelectPost && post && onSelectPost(post)}
		>
			<Flex
				direction="column"
				align="center"
				bg={singlePostPage ? "none" : "gray.100"}
				p={2}
				width="40px"
				borderRadius={singlePostPage ? "0" : "3px 0px 0px 3px"}
			>
				<Icon
					as={
						userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
					}
					color={userVoteValue === 1 ? "brand.100" : "gray.400"}
					fontSize={22}
					onClick={(event) => onVote(event, post, 1, post.communityId)}
				/>
				<Text fontSize="9pt">{post.voteStatus}</Text>
				<Icon
					as={
						userVoteValue === -1
							? IoArrowDownCircleSharp
							: IoArrowDownCircleOutline
					}
					color={userVoteValue === -1 ? "#4379FF" : "gray.400"}
					fontSize={22}
					onClick={(event) => onVote(event, post, -1, post.communityId)}
				/>
			</Flex>
			<Flex
				direction="column"
				width="100%"
			>
				<Stack
					spacing={1}
					p="10px"
				>
					<Stack
						direction="row"
						spacing={0.6}
						align="center"
						fontSize="9pt"
					>
						{homePage && (
							<>
								{post.communityImageUrl ? (
									<Image
										src={post.communityImageUrl}
										borderRadius="full"
										boxSize="18px"
										mr={2}
									/>
								) : (
									<Icon
										as={FaReddit}
										fontSize="18pt"
										mr={1}
										color="blue.500"
									/>
								)}
								<Link to={`/r/${post.communityId}`}>
									<Text
										fontWeight={700}
										_hover={{ textDecoration: "underline" }}
										onClick={(event) => event.stopPropagation()}
									>{`r/${post.communityId}`}</Text>
								</Link>
								<Icon
									as={BsDot}
									color="gray.500"
									fontSize={8}
								/>
							</>
						)}
						<Text>
							Posted by u/{post.creatorDisplayName}{" "}
							{moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
						</Text>
					</Stack>
					<Text
						fontSize="12pt"
						fontWeight={600}
					>
						{post.title}
					</Text>
					<Text fontSize="10pt">{post.body}</Text>
					{post.imageUrl && (
						<Flex
							justify="center"
							align="center"
							p={2}
						>
							{loadingImage && (
								<Skeleton
									height="200px"
									width="100%"
									borderRadius={4}
								/>
							)}
							<Image
								src={post.imageUrl}
								maxHeight="460px"
								alt="Post Image"
								display={loadingImage ? "none" : "unset"}
								onLoad={() => setLoadingImage(false)}
							/>
						</Flex>
					)}
				</Stack>
				<Flex
					ml={1}
					mb={0.5}
					color="gray.500"
					fontWeight={600}
				>
					<Flex
						align="center"
						p="8px 10px"
						borderRadius={4}
						_hover={{ bg: "gray.200" }}
						cursor="pointer"
					>
						<Icon
							as={BsChat}
							mr={2}
						/>
						<Text fontSize="9pt">{post.numberOfComments}</Text>
					</Flex>
					<Flex
						align="center"
						p="8px 10px"
						borderRadius={4}
						_hover={{ bg: "gray.200" }}
						cursor="pointer"
					>
						<Icon
							as={IoArrowRedoOutline}
							mr={2}
						/>
						<Text fontSize="9pt">Share</Text>
					</Flex>
					<Flex
						align="center"
						p="8px 10px"
						borderRadius={4}
						_hover={{ bg: "gray.200" }}
						cursor="pointer"
					>
						<Icon
							as={IoBookmarkOutline}
							mr={2}
						/>
						<Text fontSize="9pt">Save</Text>
					</Flex>
					{userIsCreator && (
						<Flex
							align="center"
							p="8px 10px"
							borderRadius={4}
							_hover={{ bg: "gray.200" }}
							cursor="pointer"
							onClick={handleDelete}
						>
							{loadingDelete ? (
								<Spinner size="sm" />
							) : (
								<>
									<Icon
										as={AiOutlineDelete}
										mr={2}
									/>
									<Text fontSize="9pt">Delete</Text>
								</>
							)}
						</Flex>
					)}
				</Flex>
			</Flex>
		</Flex>
	)
}
