import { collection, doc, getDoc, getDocs, increment, writeBatch } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useRecoilState, useSetRecoilState } from "recoil"
import { authModalState } from "../atoms/authModalAtom"
import { communityState } from "../atoms/communitiesAtom"
import { auth, db } from "../firebase"

export default function useCommunityData() {
	const user = auth.currentUser
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [communityStateValue, setCommunityStateValue] =
		useRecoilState(communityState)
	const setAuthModalState = useSetRecoilState(authModalState)

	const {communityId} = useParams()

	const onJoinOrLeaveCommunity = (communityData, isJoined) => {

		if(!user) {
			setAuthModalState({open: true, view: "login"})
			return
		}

		if (isJoined) {
			leaveCommunity(communityData.id)
			return
		}
		joinCommunity(communityData)
	}

	const getMySnippets = async () => {
		setLoading(true)
		try {
			const snippetDocs = await getDocs(
				collection(db, `users/${user?.uid}/communitySnippets`)
			)
			const snippets = snippetDocs.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}))
			setCommunityStateValue((prev) => ({
				...prev,
				mySnippets: snippets,
				snippetsFetched: true
			}))
		} catch (error) {
			console.log("getMySnippets", error)
			setError(error.message)
		}
		setLoading(false)
	}

	const joinCommunity = async (communityData) => {
		setLoading(true)
		try {
			const batch = new writeBatch(db)
			const newSnippet = {
				communityId: communityData.id,
				imageURL: communityData.imageURL || "",
				isModerator: user.uid === communityData.creatorId
			}

			batch.set(
				doc(db, `users/${user?.uid}/communitySnippets`, communityData.id),
				newSnippet
			)

			batch.update(doc(db, "communities", communityData.id), {
				numberOfMembers: increment(1)
			})

			await batch.commit()

			setCommunityStateValue(prev => ({
				...prev,
				mySnippets: [...prev.mySnippets, newSnippet]
			}))

		} catch (error) {
			console.log(error)
			setError(error.message)
		}

		setLoading(false)
	}

	const leaveCommunity = async (id) => {
		setLoading(true)
		try {
			const batch = new writeBatch(db)

			batch.delete(doc(db, `users/${user?.uid}/communitySnippets`, id))

			batch.update(doc(db, "communities", id), {
				numberOfMembers: increment(-1),
			})

			await batch.commit()

			setCommunityStateValue((prev) => ({
				...prev,
				mySnippets: prev.mySnippets.filter(item => item.communityId !== id),
			}))

		} catch (error) {
			console.log(error)
			setError(error.message)
		}
		setLoading(false)
	}

	const getCommunityData = async (communityId) => {
		try {
			const communityDocRef = doc(db, "communities", communityId)
			const communityDoc = await getDoc(communityDocRef)
			setCommunityStateValue(prev => ({
				...prev,
				currentCommunity: {id: communityDoc.id, ...communityDoc.data()}
			}))
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		if(communityId && !communityStateValue.currentCommunity){
			getCommunityData(communityId)
		}
	}, [communityId, communityStateValue.currentCommunity])

	useEffect(() => {
		if (!user) {
			setCommunityStateValue(prev => ({
				...prev,
				mySnippets: [],
				snippetsFetched: false
			}))
			return
		}
		getMySnippets()
	}, [user])

	return {
		communityStateValue,
		onJoinOrLeaveCommunity,
		loading,
	}
}
