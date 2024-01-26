import { Route, Routes } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.css";

// Import components
import MyNavbar from "./components/MyNavbar";
import Events from "./components/Events";
import Members from "./components/Members";
import JoinRequests from "./components/JoinRequests";
import JoinRequestForm from "./components/JoinRequestForm";
import { useState } from "react";

function App() {
	const [reload, setReload] = useState(false);

	return (
		<div className="App py-5">
			<MyNavbar />
			<Routes>
				<Route
					path="/home"
					element={
						<>
							<Events />
							<Members reload={reload} />
							<JoinRequests setReload={setReload} />
						</>
					}
				/>
				<Route path="/sendJoinRequest" element={<JoinRequestForm />} />
			</Routes>
		</div>
	);
}

export default App;
