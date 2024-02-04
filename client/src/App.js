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
		return currentUrl === "/" || currentUrl === "/login";
	}

	return (
		<div className="App py-5">
			{!noNav() && <MyNavbar />}
			<Routes>
				<Route path="/" element={<JoinRequestForm />} />
				<Route path="/login" element={<LoginForm />} />
				<Route
					path="/home"
					element={
						<>
							<Events count={6} />
							<Members reload={reload} count={6} />
							<JoinRequests setReload={setReload} count={6} />
						</>
					}
				/>
				<Route path="/events" element={<Events />} />
				<Route path="/members" element={<Members reload={reload} />} />
				<Route
					path="/joinRequests"
					element={<JoinRequests setReload={setReload} />}
				/>
			</Routes>
		</div>
	);
}

export default App;
