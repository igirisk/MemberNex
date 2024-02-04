import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Stack from "react-bootstrap/esm/Stack";
import { Search } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";

const MyNavbar = () => {
	const [showModal, setShowModal] = useState(false);

	const handleShowModal = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};
	// Member popup modal
	const ProfileModal = ({ account, onClose }) => {
		const [validated, setValidated] = useState(false);

		const [form, setForm] = useState({
			email: "",
			password: "",
			confirmPassword: "",
		});

		function updateForm(value) {
			setForm((prev) => ({ ...prev, ...value }));
			setValidated(false);
		}

		async function updateProfile(e) {
			e.preventDefault();
			const formElement = e.currentTarget;
			setValidated(true);

			// get profile id
			const id = sessionStorage.getItem("loginId");

			if (formElement.checkValidity()) {
				const newUpdate = { ...form };

				// retrieve token from session storage
				const token = sessionStorage.getItem("token");

				try {
					const response = await fetch(`http://localhost:3050/account/${id}`, {
						method: "PATCH",
						headers: {
							Authorization: token ? token : "",
							"Content-Type": "application/json",
						},
						body: JSON.stringify(newUpdate),
					});

					if (response.ok) {
						// reset form
						setForm({
							email: "",
							password: "",
							confirmPassword: "",
						});

						// Show success notification
						toast.success(`Profile updated successfully.`, {
							position: toast.POSITION.TOP_RIGHT,
						});
					} else {
						const res = await response.json();

						// show unsuccessful notification
						toast.error(`Failed to update profile. Try again later.`, {
							position: toast.POSITION.TOP_RIGHT,
						});
						console.log(
							`Failed to update profile.
							${res.error}, details: ${res.details}`
						);
					}
				} catch (error) {
					toast.error(`Failed to update profile. Try again later.`, {
						position: toast.POSITION.TOP_RIGHT,
					});
					console.error("Error updating profile:", error);
				}
			}
		}

		// #region Custom form validations
		function isValidInput(value, validationCondition) {
			// Check if the value is present before applying validation
			const isInputPresent = value && value.trim() !== "";

			// If input is present, apply the validation condition
			if (isInputPresent) {
				return validationCondition(value);
			}

			// If input is not present, consider it as valid
			return true;
		}

		const isValidEmail = (email) =>
			// one or more characters that is not white space before @, contains @, one or more characters that is not white space after @, contains .,one or more chatacters that matches is not white space till the end of the str
			isValidInput(email, (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));

		const isValidPassword = (password) =>
			// Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character
			isValidInput(password, (value) =>
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-]).{8,}$/.test(
					value
				)
			);

		function matchingPassword(password, confirmPassword) {
			return password === confirmPassword;
		}
		// #endregion

		return (
			<Modal show={true} onHide={onClose} size="lg">
				<Modal.Header closeButton className="px-4">
					<h2>Update Profile</h2>
				</Modal.Header>

				<Modal.Body className="px-4 pb-4">
					<Form
						noValidate
						validated={validated}
						onSubmit={(e) => updateProfile(e)}
					>
						<Row className="mb-3">
							<Form.Group as={Col} md="12" controlId="email">
								<Form.Label>Email:</Form.Label>
								<Form.Control
									type="email"
									placeholder="example@gmail.com"
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
									type="password"
									placeholder="Enter password"
									isInvalid={!isValidPassword(form.password)}
									isValid={isValidPassword(form.password)}
									value={form.password}
									onChange={(e) => updateForm({ password: e.target.value })}
								/>
								<Form.Control.Feedback type="invalid">
									Password must be a minimum of eight characters and include at
									least one uppercase letter, one lowercase letter, one number,
									and one special character.
								</Form.Control.Feedback>
								<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
							</Form.Group>
						</Row>
						<Row className="mb-3">
							<Form.Group as={Col} md="12" controlId="confirmPassword">
								<Form.Label>Confirm new password:</Form.Label>
								<Form.Control
									type="password"
									placeholder="Confirm new password"
									isInvalid={
										!matchingPassword(form.password, form.confirmPassword)
									}
									isValid={matchingPassword(
										form.password,
										form.confirmPassword
									)}
									value={form.confirmPassword}
									onChange={(e) =>
										updateForm({ confirmPassword: e.target.value })
									}
								/>
								<Form.Control.Feedback type="invalid">
									New password and confirm new password do not match.
								</Form.Control.Feedback>
								<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
							</Form.Group>
						</Row>

						<Stack direction="horizontal" gap={3}>
							<Button type="button" variant="danger" onClick={handleCloseModal}>
								Cancel
							</Button>
							<Button type="submit" variant="primary">
								Update
							</Button>
						</Stack>
					</Form>
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
		<>
			<Navbar expand="lg" className="bg-body-tertiary" fixed="top">
				<Container>
					<NavLink
						className="navbar-brand d-flex align-items-center"
						to="/home"
					>
						<img
							alt=""
							src="./imgs/logo.png"
							width="180"
							className="d-inline-block align-top"
						/>
					</NavLink>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="me-auto"></Nav>
						<Nav>
							<NavLink className="nav-link" to="events">
								Events
							</NavLink>
							<NavLink className="nav-link" to="/members">
								Members
							</NavLink>
							<NavLink className="nav-link" to="/joinRequests">
								Join Requests
							</NavLink>
							<NavLink className="nav-link" onClick={handleShowModal}>
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
			{showModal && <ProfileModal onClose={handleCloseModal} />}
			<ToastContainer />
		</>
	);
};

export default MyNavbar;
