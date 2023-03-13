import { Flex } from "@chakra-ui/react"
import { doc, getDoc } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import { communityState } from "../atoms/communitiesAtom"
import About from "../components/Community/About"
import CreatePostLink from "../components/Community/CreatePostLink"
import Header from "../components/Community/Header"
import NotFound from "../components/Community/NotFound"
import Posts from "../components/Posts/Posts"
import { db } from "../firebase"

export default function Community() {
	const { communityId } = useParams()
	const [community, setCommunity] = useState(null)
	const setCommunityStateValue = useSetRecoilState(communityState)

	useEffect(() => {
		const getCommunity = async () => {
			const communityDocRef = doc(db, "communities", communityId)
			const res = await getDoc(communityDocRef)
			if (!res.data()) return setCommunity(null)
			setCommunity({ ...res.data(), id: res.id })
		}
		getCommunity()
	}, [communityId])

	useEffect(() => {
		setCommunityStateValue(prev => ({
			...prev,
			currentCommunity: community
		}))
	}, [community, communityId])

	if (!community) {
		return <NotFound />
	}

	return (
		<>
			{community && (
				<>
					<Header community={community} />
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
								<CreatePostLink />
								<Posts community={community}/>
							</Flex>
							<Flex
								flexDirection="column"
								display={{ base: "none", md: "flex" }}
								flexGrow={1}
							>
								<About communityData={community}/>
							</Flex>
						</Flex>
					</Flex>
				</>
			)}
		</>
	)
}
