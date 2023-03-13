import React from 'react'
import { Flex, Button } from "@chakra-ui/react"
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
		<Flex
			direction="column"
			justifyContent="center"
			alignItems="center"
			minHeight="60vh"
		>
			Sorry, that community does not exist or has been banned
			<Link to="/">
				<Button mt={4}>GO HOME</Button>
			</Link>
		</Flex>
	)
}
