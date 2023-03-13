import React, { useEffect } from "react"
import { Flex } from "@chakra-ui/react"
import About from "../components/Community/About"
import PostItem from "../components/Posts/PostItem"
import usePosts from "../hooks/usePosts"
import { auth, db } from "../firebase"
import { useParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import useCommunityData from "../hooks/useCommunityData"
import Comments from "../components/Posts/Comments/Comments"

export default function PostPage() {
	const { postStateValue, setPostStateValue, onDeletePost, onVote } = usePosts()
	const { postId } = useParams()
	const { communityStateValue } = useCommunityData()
	const user = auth?.currentUser

	const fetchPost = async (postId) => {
		try {
			const postDocRef = doc(db, "posts", postId)
			const postDoc = await getDoc(postDocRef)
			setPostStateValue((prev) => ({
				...prev,
				selectedPost: { id: postDoc.id, ...postDoc.data() },
			}))
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		if (postId && !postStateValue.selectedPost) {
			fetchPost(postId)
		}
	}, [postId, postStateValue.selectedPost])

	return (
		<>
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
						{postStateValue.selectedPost && (
							<PostItem
								post={postStateValue.selectedPost}
								onVote={onVote}
								onDelete={onDeletePost}
								userVoteValue={
									postStateValue.postVotes.find(
										(item) => item.postId === postStateValue.selectedPost?.id
									)?.voteValue
								}
								userIsCreator={
									user?.uid === postStateValue.selectedPost?.creatorId
								}
							/>
						)}
						<Comments
							user={user}
							selectedPost={postStateValue.selectedPost}
							communityId={postStateValue.selectedPost?.communityId}
						/>
					</Flex>
					<Flex
						flexDirection="column"
						display={{ base: "none", md: "flex" }}
						flexGrow={1}
					>
						{communityStateValue.currentCommunity && (
							<About communityData={communityStateValue.currentCommunity} />
						)}
					</Flex>
				</Flex>
			</Flex>
		</>
	)
}
