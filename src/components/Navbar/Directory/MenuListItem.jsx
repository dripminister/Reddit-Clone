import { Flex, MenuItem, Icon, Image } from "@chakra-ui/react"
import React from "react"
import useDirectory from "../../../hooks/useDirectory"

export default function MenuListItem({
	displayText,
	link,
	icon,
	iconColor,
	imageURL,
}) {

	const {onSelectMenuItem} = useDirectory()
	return (
		<MenuItem
			width="100%"
			fontSize="10pt"
			_hover={{ bg: "gray.100" }}
			onClick={() => onSelectMenuItem({displayText, link, icon, iconColor, imageURL})}
		>
			<Flex align="center">
				{imageURL ? (
					<Image
						src={imageURL}
						borderRadius="full"
						boxSize="18px"
						mr={2}
					/>
				) : (
					<Icon
						as={icon}
						fontSize={20}
						mr={2}
						color={iconColor}
					/>
				)}
				{displayText}
			</Flex>
		</MenuItem>
	)
}
