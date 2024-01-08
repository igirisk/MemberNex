import "./App.css";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Events from "./components/Events";
import Members from "./components/Members";
import Requests from "./components/Requests";

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
				></Route>
			</Routes>
		</div>
	);
}

export default App;
