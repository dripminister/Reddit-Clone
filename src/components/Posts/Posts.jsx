import React, { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { db, auth } from "../../firebase"
import usePosts from "../../hooks/usePosts"
import PostItem from "./PostItem"
import { Stack } from "@chakra-ui/react"
import PostLoader from "./PostLoader"

export default function Posts({ community }) {
	const [loading, setLoading] = useState(false)
	const {
		postStateValue,
		setPostStateValue,
		onVote,
		onSelectPost,
		onDeletePost,
	} = usePosts()
	const user = auth?.currentUser

	const getPosts = async () => {
        setLoading(true)
		try {
			const postsQuery = query(
				collection(db, "posts"),
				where("communityId", "==", community.id),
				orderBy("createdAt", "desc")
			)
			const postDocs = await getDocs(postsQuery)
			const posts = postDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
			setPostStateValue((prev) => ({
				...prev,
				posts: posts,
			}))
		} catch (err) {
			console.log(err)
		}
        setLoading(false)
	}

	useEffect(() => {
		getPosts()
	}, [community])

	return (
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
								postStateValue.postVotes.find((item) => item.postId === post.id)
									?.voteValue
							}
							onVote={onVote}
							onSelectPost={onSelectPost}
							onDeletePost={onDeletePost}
						/>
					))}
				</Stack>
			)}
		</>
	)
}
