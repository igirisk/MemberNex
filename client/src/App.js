import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.css";

// Import components
import MyNavbar from "./components/MyNavbar";
import Events from "./components/Events";
import Members from "./components/Members";
import JoinRequests from "./components/JoinRequests";
import JoinRequestForm from "./components/JoinRequestForm";
import LoginForm from "./components/LoginForm";

function App() {
	const location = useLocation();
	const [reload, setReload] = useState(false);

	function noNav() {
		const currentUrl = location.pathname;
		console.log(currentUrl);
		return currentUrl === "/" || currentUrl === "/sendJoinRequest";
	}

	return (
		<div className="App py-5">
			{!noNav() && <MyNavbar />}
			<Routes>
				<Route path="/" element={<LoginForm />} />
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
