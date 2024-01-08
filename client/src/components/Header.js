import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Search } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";

const Header = () => {
	return (
		<Navbar expand="lg" className="bg-body-tertiary mb-3">
			<Container>
				<NavLink className="navbar-brand" to="/home">
					<img
						alt=""
						src="/images/Logo.png"
						width="30"
						height="30"
						className="d-inline-block align-top"
					/>
					{"MemberNex"}
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
						<Nav.Link href="#events">Events</Nav.Link>
						<Nav.Link href="#members">Members</Nav.Link>
						<Nav.Link href="#login" className="bg-danger text-white rounded">
							Logout
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Header;
