import React, { useEffect } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { postState } from "../atoms/postAtom"
import { communityState } from "../atoms/communitiesAtom"
import { ref, deleteObject } from "firebase/storage"
import { db, storage, auth } from "../firebase"
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	where,
	writeBatch,
} from "firebase/firestore"
import { authModalState } from "../atoms/authModalAtom"
import { useNavigate } from "react-router-dom"

export default function usePosts() {
	const [postStateValue, setPostStateValue] = useRecoilState(postState)
	const currentCommunity = useRecoilValue(communityState).currentCommunity
	const setAuthModalState = useSetRecoilState(authModalState)
	const navigate = useNavigate()

	const user = auth?.currentUser

	const onVote = async (event, post, vote, communityId) => {
    event.stopPropagation()

		if (!user?.uid) {
			setAuthModalState({ open: true, view: "login" })
			return
		}

		const { voteStatus } = post
		const existingVote = postStateValue.postVotes.find(
			(vote) => vote.postId === post.id
		)

		try {
			let voteChange = vote
			const batch = writeBatch(db)

			const updatedPost = { ...post }
			const updatedPosts = [...postStateValue.posts]
			let updatedPostVotes = [...postStateValue.postVotes]

			if (!existingVote) {
				const postVoteRef = doc(
					collection(db, "users", `${user.uid}/postVotes`)
				)

				const newVote = {
					id: postVoteRef.id,
					postId: post.id,
					communityId,
					voteValue: vote,
				}

				console.log("NEW VOTE!!!", newVote)
				batch.set(postVoteRef, newVote)

				updatedPost.voteStatus = voteStatus + vote
				updatedPostVotes = [...updatedPostVotes, newVote]
			} else {
				const postVoteRef = doc(
					db,
					"users",
					`${user.uid}/postVotes/${existingVote.id}`
				)

				if (existingVote.voteValue === vote) {
					voteChange *= -1
					updatedPost.voteStatus = voteStatus - vote
					updatedPostVotes = updatedPostVotes.filter(
						(vote) => vote.id !== existingVote.id
					)
					batch.delete(postVoteRef)
				} else {
					voteChange = 2 * vote
					updatedPost.voteStatus = voteStatus + 2 * vote
					const voteIdx = postStateValue.postVotes.findIndex(
						(vote) => vote.id === existingVote.id
					)

					if (voteIdx !== -1) {
						updatedPostVotes[voteIdx] = {
							...existingVote,
							voteValue: vote,
						}
					}
					batch.update(postVoteRef, {
						voteValue: vote,
					})
				}
			}

			let updatedState = { ...postStateValue, postVotes: updatedPostVotes }

			const postIdx = postStateValue.posts.findIndex(
				(item) => item.id === post.id
			)

			updatedPosts[postIdx] = updatedPost
			updatedState = {
				...updatedState,
				posts: updatedPosts,
				postsCache: {
					...updatedState.postsCache,
					[communityId]: updatedPosts,
				},
			}

			if (updatedState.selectedPost) {
				updatedState = {
					...updatedState,
					selectedPost: updatedPost,
				}
			}

			setPostStateValue(updatedState)

      if(postStateValue.selectedPost){
        setPostStateValue(prev => ({
          ...prev,
          selectedPost: updatedPost
        }))
      }

			const postRef = doc(db, "posts", post.id)
			batch.update(postRef, { voteStatus: voteStatus + voteChange })
			await batch.commit()
		} catch (error) {
			console.log("onVote error", error)
		}
	}

	const onSelectPost = (post) => {
		setPostStateValue((prev) => ({
			...prev,
			selectedPost: post,
		}))
		navigate(`/r/${post.communityId}/comments/${post.id}`)
	}

	const onDeletePost = async (post) => {
    console.log(post)
		try {
			if (post.imageUrl) {
				const imageRef = ref(storage, `posts/${post.id}/image`)
				await deleteObject(imageRef)
			}

			const postDocRef = doc(db, "posts", post.id)
			await deleteDoc(postDocRef)

			setPostStateValue((prev) => ({
				...prev,
				posts: prev.posts.filter((item) => item.id !== post.id),
			}))

			return true
		} catch (error) {
			return false
		}
	}

	const getCommunityPostVotes = async (communityId) => {
		const postVoteQuery = query(
			collection(db, "users", `${user?.uid}/postVotes`),
			where("communityId", "==", communityId)
		)

		const postVoteDocs = await getDocs(postVoteQuery)
		const postVotes = postVoteDocs.docs.map((doc) => ({
			...doc.data(),
			id: doc.id,
		}))

		setPostStateValue((prev) => ({
			...prev,
			postVotes: postVotes,
		}))
	}

	useEffect(() => {
		if (!currentCommunity?.id || !user) return
		getCommunityPostVotes(currentCommunity.id)
	}, [currentCommunity, user])

	useEffect(() => {
		if (!user) {
			setPostStateValue((prev) => ({
				...prev,
				postVotes: [],
			}))
		}
	}, [user])

	return {
		postStateValue,
		setPostStateValue,
		onVote,
		onSelectPost,
		onDeletePost,
	}
}
