import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Header = () => {
	return (
		<Navbar expand="lg" className="bg-body-tertiary mb-3">
			<Container>
				<Navbar.Brand href="#home">
					<img
						alt=""
						src="/images/Logo.png"
						width="30"
						height="30"
						className="d-inline-block align-top"
					/>{" "}
					MemberNex
				</Navbar.Brand>
				<Form inline>
					<Row>
						<Col xs="auto">
							<Form.Control
								type="text"
								placeholder="Search"
								className=" mr-sm-2"
							/>
						</Col>
						<Col xs="auto">
							<Button type="submit">Submit</Button>
						</Col>
					</Row>
				</Form>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto"></Nav>
					<Nav>
						<Nav.Link href="#events">Events</Nav.Link>
						<Nav.Link href="#members">Members</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Header;
