import { Route, Routes } from "react-router-dom";

// Import components
import MyNavbar from "./components/MyNavbar";
import Events from "./components/Events";
import Members from "./components/Members";
import JoinRequests from "./components/JoinRequests";
import JoinRequestForm from "./components/JoinRequestForm";

function App() {
	return (
		<div className="App py-5">
			<MyNavbar />
			<Routes>
				<Route
					path="/home"
					element={
						<>
							<Events />
							<Members />
							<JoinRequests />
						</>
					}
				/>
				<Route path="/addMember" element={<JoinRequestForm />} />
			</Routes>
		</div>
	);
}

export default App;
