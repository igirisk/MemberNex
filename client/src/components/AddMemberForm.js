import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const AddMemberForm = () => {
	const [form, setForm] = useState({
		first_name: "",
		last_name: "",
		email: "",
		contact_number: "",
		matrix_number: "",
		study_year: "",
		activeness: "",
	});

	// update form state properties
	function updateForm(value) {
		return setForm((prev) => {
			return { ...prev, ...value };
		});
	}

	async function onSubmit(e) {
		e.preventDefault();

		// post request to add a new member
		const newMember = { ...form };
		console.log(newMember);

		await fetch("http://localhost:3050/member", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newMember),
		}).catch((error) => {
			window.alert(error);
			return;
		});

		setForm({
			first_name: "",
			last_name: "",
			email: "",
			contact_number: "",
			matrix_number: "",
			study_year: "",
			activeness: "",
		});
	}

	// form vaildations
	const [validated, setValidated] = useState(false);

	const handleSubmit = (event) => {
		const formElement = event.currentTarget;
		if (formElement.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		}

		setValidated(true);
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

	function isValidMatrixNumber(matrix_number) {
		const matrixNumberRegex = /^\d{6}[A-Za-z]$/; // 6 digit before a alphabet
		return matrixNumberRegex.test(matrix_number);
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
				<Form
					noValidate
					validated={validated}
					onSubmit={(handleSubmit, onSubmit)}
				>
					<Row className="mb-3">
						<Form.Group as={Col} md="6" controlId="validationCustom01">
							<Form.Label>First name:</Form.Label>
							<Form.Control required type="text" placeholder="First name" />
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} md="6" controlId="validationCustom02">
							<Form.Label>Last name:</Form.Label>
							<Form.Control required type="text" placeholder="Last name" />
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
								onChange={(e) => updateForm({ email: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Please provide a valid email.
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} md="6" controlId="validationCustom04">
							<Form.Label>Contact number:</Form.Label>
							<Form.Control
								type="number"
								placeholder="Contact number"
								required
								isInvalid={!isValidContactNumber(form.contact_number)}
								onChange={(e) => updateForm({ contact_number: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Please provide a valid contact number.
							</Form.Control.Feedback>
						</Form.Group>
					</Row>
					<Row className="mb-3">
						<Form.Group as={Col} md="4" controlId="validationCustom03">
							<Form.Label>Matrix card number:</Form.Label>
							<Form.Control
								type="text"
								placeholder="Matrix card number"
								required
								isInvalid={!isValidMatrixNumber(form.matrix_number)}
								onChange={(e) => updateForm({ matrix_number: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Please provide a valid matrix card number.
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} md="4">
							<Form.Label>Year of study:</Form.Label>
							<Form.Select
								id="study_year"
								value={form.study_year}
								required
								isInvalid={!isValidYearOfStudy(form.matrix_number)}
								onChange={(e) => updateForm({ study_year: e.target.value })}
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
								isInvalid={!isValidActiveness(form.matrix_number)}
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
		</div>
	);
};

export default AddMemberForm;
