import { Flex } from "@chakra-ui/react"
import React, { useState } from "react"
import { BiPoll } from "react-icons/bi"
import { BsLink45Deg, BsMic } from "react-icons/bs"
import { IoDocumentText, IoImageOutline } from "react-icons/io5"
import ImageUpload from "./PostForm/ImageUpload"
import TextInputs from "./PostForm/TextInputs"
import TabItem from "./TabItem"
import { useNavigate, useParams } from "react-router-dom"
import {
	addDoc,
	collection,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore"
import { db, storage } from "../../firebase"
import { getDownloadURL, ref, uploadString } from "firebase/storage"
import useSelectFile from "../../hooks/useSelectFile"

export default function NewPostForm({ user, communityImageUrl }) {
	const formTabs = [
		{
			title: "Post",
			icon: IoDocumentText,
		},
		{
			title: "Images & Video",
			icon: IoImageOutline,
		},
		{
			title: "Link",
			icon: BsLink45Deg,
		},
		{
			title: "Poll",
			icon: BiPoll,
		},
		{
			title: "Talk",
			icon: BsMic,
		},
	]

	const [selectedTab, setSelectedTab] = useState(formTabs[0].title)
	const [textInputs, setTextInputs] = useState({
		title: "",
		body: "",
	})
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const { communityId } = useParams()
	const {selectedFile, setSelectedFile, onSelectFile} = useSelectFile()

	const handleCreatePost = async () => {
		const newPost = {
			communityId,
			creatorId: user.uid,
			creatorDisplayName: user.email.split("@")[0],
			title: textInputs.title,
			body: textInputs.body,
			numberOfComments: 0,
			voteStatus: 0,
			createdAt: serverTimestamp(),
			communityImageUrl: communityImageUrl || ""
		}
		setLoading(true)
		try {
			const postDocRef = await addDoc(collection(db, "posts"), newPost)
			if (selectedFile) {
				const imageRef = ref(storage, `posts/${postDocRef.id}/image`)
				await uploadString(imageRef, selectedFile, "data_url")
				const downloadURL = await getDownloadURL(imageRef)

				await updateDoc(postDocRef, {
					imageUrl: downloadURL,
				})
			}
			navigate(-1)
		} catch (err) {
			console.log(err.message)
		}
		setLoading(false)
	}

	const onTextChange = (e) => {
		const {
			target: { name, value },
		} = e

		setTextInputs((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	return (
		<Flex
			direction="column"
			bg="white"
			borderRadius={4}
			mt={2}
		>
			<Flex width="100%">
				{formTabs.map((item, i) => (
					<TabItem
						key={i}
						item={item}
						selected={item.title === selectedTab}
						setSelectedTab={setSelectedTab}
					/>
				))}
			</Flex>
			<Flex p={4}>
				{selectedTab === "Post" && (
					<TextInputs
						textInputs={textInputs}
						handleCreatePost={handleCreatePost}
						onChange={onTextChange}
						loading={loading}
					/>
				)}
				{selectedTab === "Images & Video" && (
					<ImageUpload
						selectedFile={selectedFile}
						onSelectImage={onSelectFile}
						setSelectedTab={setSelectedTab}
						setSelectedFile={setSelectedFile}
					/>
				)}
			</Flex>
		</Flex>
	)
}
