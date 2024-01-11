import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const JoinRequestForm = () => {
	const [form, setForm] = useState({
		first_name: "",
		last_name: "",
		email: "",
		contact_number: "",
		admin_number: "",
		study_year: "",
		activeness: "",
	});

	const [validated, setValidated] = useState(false);

	function updateForm(value) {
		setForm((prev) => ({ ...prev, ...value }));
		setValidated(false);
	}

	async function sendJoinRequest(e) {
		e.preventDefault();
		const formElement = e.currentTarget;
		setValidated(true);

		if (formElement.checkValidity()) {
			const newJoinRequest = { ...form };

			try {
				const response = await fetch("http://localhost:3050/joinRequest", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(newJoinRequest),
				});

				if (response.ok) {
					setForm({
						first_name: "",
						last_name: "",
						email: "",
						contact_number: "",
						admin_number: "",
						study_year: "",
						activeness: "",
					});

					// Show success notification
					toast.success(`Join request sent successfully`, {
						position: toast.POSITION.TOP_RIGHT,
					});
				} else {
					const res = await response.json();

					// show unsuccessful notification
					toast.error(`Failed to send join request. Try again later.`, {
						position: toast.POSITION.TOP_RIGHT,
					});
					console.log(
						`Failed to submit join request.
						${res.error}, details: ${res.details}`
					);
				}
			} catch (error) {
				toast.error(`Failed to send join request. Try again later.`, {
					position: toast.POSITION.TOP_RIGHT,
				});
				console.error("Error sending join request:", error);
			}
		}
	}

	const isValidName = (name) => {
		// Check if the name is not empty
		return name.trim() !== "";
	};

	function isValidEmail(email) {
		// one or more characters that is not white space before @, contains @, one or more characters that is not white space after @, contains .,one or more chatacters that matches is not white space till the end of the str
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function isValidContactNumber(contact_number) {
		const contactNumberRegex = /^\d{8}$/; // 8 digit contact number
		return contactNumberRegex.test(contact_number);
	}

	function isValidMatrixNumber(admin_number) {
		const matrixNumberRegex = /^\d{7}[A-Za-z]$/; // 6 digit before a alphabet
		return matrixNumberRegex.test(admin_number);
	}

	function isValidYearOfStudy(study_year) {
		const value = [1, 2, 3];
		return value.includes(study_year);
	}

	function isValidActiveness(activeness) {
		const value = [
			"very high",
			"high",
			"medium",
			"low",
			"very low",
			"inactive",
		];
		return value.includes(activeness.toLowerCase());
	}

	return (
		<div id="addMember" className="my-5">
			<Container className="border border-secondary rounded p-5 w-50">
				<div
					id="logos"
					className="d-flex flex-row justify-content-center justify-content-between"
				>
					<div id="logo" className="d-flex align-items-center">
						<img src="./imgs/logo.png" width="70%" alt="app logo" />
					</div>
					<img src="./imgs/iitscXtp.png" width="40%" alt="iitsc and tp" />
				</div>
				<h2>Join Club</h2>
				<p className="muted">
					Sent a request to join ITSC. Ensure your details provided are valid.
				</p>
				<Form noValidate validated={validated} onSubmit={sendJoinRequest}>
					<Row className="mb-3">
						<Form.Group as={Col} md="6" controlId="validationCustom01">
							<Form.Label>First name:</Form.Label>
							<Form.Control
								type="text"
								placeholder="First name"
								required
								isInvalid={!isValidName(form.first_name)}
								value={form.first_name}
								onChange={(e) => updateForm({ first_name: e.target.value })}
							/>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} md="6" controlId="validationCustom02">
							<Form.Label>Last name:</Form.Label>
							<Form.Control
								type="text"
								placeholder="Last name"
								required
								isInvalid={!isValidName(form.last_name)}
								value={form.last_name}
								onChange={(e) => updateForm({ last_name: e.target.value })}
							/>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
					</Row>
					<Row className="mb-3">
						<Form.Group as={Col} md="6" controlId="validationCustom03">
							<Form.Label>Email:</Form.Label>
							<Form.Control
								type="email"
								placeholder="Email"
								required
								isInvalid={!isValidEmail(form.email)}
								value={form.email}
								onChange={(e) => updateForm({ email: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Please provide a valid email.
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} md="6" controlId="validationCustom04">
							<Form.Label>Contact number:</Form.Label>
							<Form.Control
								type="number"
								placeholder="Contact number"
								required
								isInvalid={!isValidContactNumber(form.contact_number)}
								value={form.contact_number}
								onChange={(e) => updateForm({ contact_number: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Please provide a valid contact number.
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
					</Row>
					<Row className="mb-3">
						<Form.Group as={Col} md="4" controlId="validationCustom03">
							<Form.Label>Admin number:</Form.Label>
							<Form.Control
								type="text"
								placeholder="Admin number"
								required
								isInvalid={!isValidMatrixNumber(form.admin_number)}
								value={form.admin_number}
								onChange={(e) => updateForm({ admin_number: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Please provide a valid Admin number.
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} md="4">
							<Form.Label>Year of study:</Form.Label>
							<Form.Select
								id="study_year"
								value={form.study_year}
								required
								isValid={isValidYearOfStudy(form.study_year)}
								isInvalid={!isValidYearOfStudy(form.study_year)}
								onChange={(e) =>
									updateForm({ study_year: parseInt(e.target.value) })
								}
							>
								<option value="" disabled>
									Select year of study
								</option>
								<option>1</option>
								<option>2</option>
								<option>3</option>
							</Form.Select>
						</Form.Group>
						<Form.Group as={Col} md="4">
							<Form.Label>Activeness</Form.Label>
							<Form.Select
								id="activeness"
								value={form.activeness}
								required
								isValid={isValidActiveness(form.activeness)}
								isInvalid={!isValidActiveness(form.activeness)}
								onChange={(e) => updateForm({ activeness: e.target.value })}
							>
								<option value="" disabled>
									Select Activeness
								</option>
								<option>very low</option>
								<option>low</option>
								<option>medium</option>
								<option>high</option>
								<option>very high</option>
							</Form.Select>
						</Form.Group>
					</Row>
					<Button type="submit">Send request</Button>
				</Form>
			</Container>
			<ToastContainer />
		</div>
	);
};

export default JoinRequestForm;
