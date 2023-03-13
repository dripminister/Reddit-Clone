import { ChakraProvider } from "@chakra-ui/react"
import { theme } from "./chakra/theme"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import { RecoilRoot } from "recoil"
import Community from "./pages/Community"
import Submit from "./pages/Submit"
import PostPage from "./pages/PostPage"
import Home from "./pages/Home"

function App() {
	return (
		<RecoilRoot>
			<BrowserRouter>
				<ChakraProvider theme={theme}>
					<Navbar />
					<Routes>
						<Route
							path={`/`}
							element={<Home />}
						/>
						<Route
							path={`/r/:communityId`}
							element={<Community />}
						/>
						<Route
							path={`/r/:communityId/submit`}
							element={<Submit />}
						/>
						<Route
							path={`/r/:communityId/comments/:postId`}
							element={<PostPage />}
						/>
					</Routes>
				</ChakraProvider>
			</BrowserRouter>
		</RecoilRoot>
	)
}

export default App
