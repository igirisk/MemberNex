import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Search } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";

const MyNavbar = () => {
	// Member popup modal
	const ProfileModal = ({ props, onClose, updateTrigger }) => {
		const [showEdit, setShowEdit] = useState(false);

		const handleShowEdit = () => {
			setShowEdit(true);
		};

		const handleCloseEdit = () => {
			setShowEdit(false);
		};

		const handleUpdate = () => {
			// Call the callback function to trigger the useEffect in Members
			updateTrigger((prev) => !prev);
		};

		return (
			<Modal show={true} onHide={onClose} size="lg">
				<Modal.Header closeButton className="px-4">
					<h2>Update Profile</h2>
				</Modal.Header>
				<Modal.Body className="px-4 pb-4">
					<h2>profile.admin_number</h2>
					<Col md="9">
						<Form
							noValidate
							validated={validated}
							onSubmit={(e) => updateMember(e, member._id, sendReload)}
						>
							<Row className="mb-3">
								<Form.Group as={Col} md="12" controlId="email">
									<Form.Label>Email:</Form.Label>
									<Form.Control
										type="email"
										placeholder={member.email}
										isInvalid={!isValidEmail(form.email)}
										isValid={isValidEmail(form.email)}
										value={form.email}
										onChange={(e) => updateForm({ email: e.target.value })}
									/>
									<Form.Control.Feedback type="invalid">
										Please provide a valid email.
									</Form.Control.Feedback>
									<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
								</Form.Group>
							</Row>
							<Row className="mb-3">
								<Form.Group as={Col} md="12" controlId="newPassword">
									<Form.Label>New password:</Form.Label>
									<Form.Control
										type="text"
										placeholder={member.newPassword}
										isInvalid={!isValidAdminNumber(form.newPassword)}
										isValid={isValidAdminNumber(form.newPassword)}
										value={form.oldPassword}
										onChange={(e) =>
											updateForm({ newPassword: e.target.value })
										}
									/>
								</Form.Group>
							</Row>
							<Row className="mb-3">
								<Form.Group as={Col} md="12" controlId="confirmPassword">
									<Form.Label>Confirm password:</Form.Label>
									<Form.Control
										type="text"
										placeholder={member.newPassword}
										isInvalid={!isValidAdminNumber(form.confirmPassword)}
										isValid={isValidAdminNumber(form.confirmPassword)}
										value={form.confirmPassword}
										onChange={(e) =>
											updateForm({ confirmPassword: e.target.value })
										}
									/>
									<Form.Control.Feedback type="invalid">
										New password and Confirm password do not match.
									</Form.Control.Feedback>
									<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
								</Form.Group>
							</Row>

							<Stack direction="horizontal" gap={3}>
								<Button
									type="button"
									variant="danger"
									onClick={handleCloseEdit}
								>
									Cancel
								</Button>
								<Button type="submit" variant="primary">
									Update
								</Button>
							</Stack>
						</Form>
					</Col>
				</Modal.Body>
			</Modal>
		);
	};

	async function logout() {
		// retrieve token from session storage
		const token = sessionStorage.getItem("token");

		// Make a request to the server to invalidate the JWT token
		try {
			const response = await fetch("http://localhost:3050/logout", {
				method: "POST",
				headers: {
					Authorization: token ? token : "",
				},
			});

			if (response.ok) {
				// Clear all items from sessionStorage
				sessionStorage.clear();
			} else {
				console.error("Error during logout:", response.statusText);
				// Handle the error, display a message, or perform other actions
			}
		} catch (error) {
			console.error("Error during logout:", error);
			// Handle the error, display a message, or perform other actions
		}
	}

	return (
		<Navbar expand="lg" className="bg-body-tertiary" fixed="top">
			<Container>
				<NavLink className="navbar-brand d-flex align-items-center" to="/home">
					<img
						alt=""
						src="./imgs/logo.png"
						width="180"
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
						<NavLink className="nav-link" to="">
							Profile
						</NavLink>
						<div className="px-2" />
						<NavLink
							className="nav-link bg-danger text-white rounded"
							to="/"
							onClick={logout}
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
