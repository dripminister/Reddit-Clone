import React, { useState } from "react"

export default function useSelectFile() {
	const [selectedFile, setSelectedFile] = useState()
	const onSelectFile = (event) => {
		const reader = new FileReader()
		if (event.target.files?.[0]) {
			reader.readAsDataURL(event.target.files[0])
		}

		reader.onload = (readerEvent) => {
			if (readerEvent.target?.result) {
				setSelectedFile(readerEvent.target?.result)
			}
		}
	}

	return {
		selectedFile,
		setSelectedFile,
		onSelectFile,
	}
}
