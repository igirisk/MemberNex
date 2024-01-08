import "./App.css";
import { Route, Routes } from "react-router-dom";

// Import components
import Header from "./components/Header";
import Events from "./components/Events";
import Members from "./components/Members";
import Requests from "./components/Requests";
import AddMemberForm from "./components/AddMemberForm";

function App() {
	return (
		<div className="App">
			<Header />
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
