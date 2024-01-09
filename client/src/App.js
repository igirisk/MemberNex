import { Route, Routes } from "react-router-dom";

// Import components
import MyNavbar from "./components/MyNavbar";
import Events from "./components/Events";
import Members from "./components/Members";
import Requests from "./components/Requests";
import AddMemberForm from "./components/AddMemberForm";

function App() {
	return (
		<div className="App">
			<MyNavbar />
			<Routes>
				<Route
					path="/home"
					element={
						<>
							<Events />
							<Members />
							<Requests />
						</>
					}
				/>
				<Route path="/addMember" element={<AddMemberForm />} />
			</Routes>
		</div>
	);
}

export default App;
