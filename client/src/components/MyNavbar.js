import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Search } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";

const MyNavbar = () => {
	return (
		<Navbar expand="lg" className="bg-body-tertiary" fixed="top">
			<Container>
				<NavLink className="navbar-brand d-flex align-items-center" to="/home">
					<img
						alt=""
						src="./imgs/logo.png"
						width="200"
						className="d-inline-block align-top"
					/>
				</NavLink>
				<Form className="d-flex">
					<Form.Control type="text" placeholder="Search" />
					<Button type="submit" className="mx-3">
						<Search size={20} /> {/* Bootstrap Search icon */}
					</Button>
				</Form>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto"></Nav>
					<Nav>
						<NavLink className="nav-link" to="">
							Events
						</NavLink>
						<NavLink className="nav-link" to="">
							Members
						</NavLink>
						<NavLink
							className="nav-link bg-danger text-white rounded"
							to="/addMember"
						>
							Logout
						</NavLink>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default MyNavbar;
