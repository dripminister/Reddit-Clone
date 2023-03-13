import React, { useEffect, useState } from "react"
import { Flex, Box, Text, Stack } from "@chakra-ui/react"
import { auth, db } from "../firebase"
import {
	collection,
	orderBy,
	query,
	limit,
	getDocs,
	where,
} from "firebase/firestore"
import { useRecoilValue } from "recoil"
import { communityState } from "../atoms/communitiesAtom"
import usePosts from "../hooks/usePosts"
import PostLoader from "../components/Posts/PostLoader"
import PostItem from "../components/Posts/PostItem"
import CreatePostLink from "../components/Community/CreatePostLink"
import { BsDoorClosed } from "react-icons/bs"
import Recommendations from "../components/Community/Recommendations"

export default function Home() {
	const user = auth?.currentUser
	const [loading, setLoading] = useState(false)
	const {
		setPostStateValue,
		postStateValue,
		onSelectPost,
		onDeletePost,
		onVote,
	} = usePosts()
	const communityStateValue = useRecoilValue(communityState)

	const buildUserHomeFeed = async () => {
		setLoading(true)
		try {
			if (communityStateValue.mySnippets.length) {
				const myCommunityIds = communityStateValue.mySnippets.map(
					(snippet) => snippet.communityId
				)

				const postQuery = query(
					collection(db, "posts"),
					where("communityId", "in", myCommunityIds),
					limit(10)
				)
				const postDocs = await getDocs(postQuery)
				const posts = postDocs.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}))
				setPostStateValue((prev) => ({ ...prev, posts: posts }))
			} else {
				buildNoUserHomeFeed()
			}
		} catch (error) {
			console.llog(error)
		}
		setLoading(false)
	}

	const buildNoUserHomeFeed = async () => {
		setLoading(true)
		try {
			const postQuery = query(
				collection(db, "posts"),
				orderBy("voteStatus", "desc"),
				limit(10)
			)
			const postDocs = await getDocs(postQuery)
			const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
			setPostStateValue((prev) => ({
				...prev,
				posts: posts,
			}))
		} catch (error) {
			console.log(error)
		}
		setLoading(false)
	}

	const getUserPostVotes = async () => {
		try {
			const postIds = postStateValue.posts.map((post) => post.id)
			const postVotesQuery = query(
				collection(db, `users/${user?.uid}/postVotes`),
				where("postId", "in", postIds)
			)
			const postVoteDocs = await getDocs(postVotesQuery)
			const postVotes = postVoteDocs.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}))
			setPostStateValue((prev) => ({
				...prev,
				postVotes: postVotes,
			}))

		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		if (!user) buildNoUserHomeFeed()
	}, [user])

	useEffect(() => {
		if (communityStateValue.snippetsFetched) buildUserHomeFeed()
	}, [communityStateValue.snippetsFetched])

	useEffect(() => {
		if (user && postStateValue.posts.length) getUserPostVotes()
	}, [user, postStateValue.posts])

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
						<CreatePostLink />
						<>
							{loading ? (
								<PostLoader />
							) : (
								<Stack>
									{postStateValue.posts.map((post) => (
										<PostItem
											key={post.id}
											post={post}
											userIsCreator={user?.uid === post.creatorId}
											userVoteValue={
												postStateValue.postVotes.find(
													(item) => item.postId === post.id
												)?.voteValue
											}
											onVote={onVote}
											onSelectPost={onSelectPost}
											onDeletePost={onDeletePost}
											homePage
										/>
									))}
								</Stack>
							)}
						</>
					</Box>
				</Flex>
				<Flex
					flexDirection="column"
					display={{ base: "none", md: "flex" }}
					flexGrow={1}
				>
					<Recommendations />
				</Flex>
			</Flex>
		</Flex>
	)
}
