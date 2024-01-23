import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import React from "react";
import MyDropzone from "./MyDropzone";

const JoinRequestForm = () => {
	const [form, setForm] = useState({
		first_name: "",
		last_name: "",
		email: "",
		contact_number: "",
		admin_number: "",
		study_year: "",
		activeness: "",
		profile_image: "",
	});

	const [uploadedFiles, setUploadedFiles] = React.useState([]);

	// Handle files change
	const handleFilesChange = (files) => {
		setUploadedFiles(files);

		// If files contain an image, convert it to base64 and update the form state
		if (files.length === 1) {
			convertImageToBase64(files[0]).then((base64Image) => {
				setForm((prevForm) => ({
					...prevForm,
					profile_image: base64Image,
				}));
			});
		}
	};

	const convertImageToBase64 = async (file) => {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.readAsDataURL(file);
		});
	};

	function updateForm(value) {
		setForm((prev) => ({ ...prev, ...value }));
	}

	async function sendJoinRequest(e) {
		e.preventDefault();
		const formElement = e.currentTarget;

		// Attach the base64-encoded image data to the form
		if (uploadedFiles.length === 1) {
			const base64Image = await convertImageToBase64(uploadedFiles[0]);
			setForm((prevForm) => ({ ...prevForm, profile_image: base64Image }));
		}

		if (formElement.checkValidity()) {
			const newJoinRequest = { ...form };

			console.log(newJoinRequest);

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
						profile_image: "",
					});

					// Show success notification
					toast.success(`Join request sent successfully`, {
						position: toast.POSITION.TOP_RIGHT,
					});
				} else {
					const res = await response.json();

					if (res.error === "Admin number already registered, try another.") {
						// show unsuccessful notification
						toast.error(`${res.error}`, {
							position: toast.POSITION.TOP_RIGHT,
						});
						console.log(
							`Failed to submit join request.
						${res.error}, details: ${res.details}`
						);
					} else {
						// show unsuccessful notification
						toast.error(`Failed to send join request. Try again later.`, {
							position: toast.POSITION.TOP_RIGHT,
						});
						console.log(
							`Failed to submit join request.
						${res.error}, details: ${res.details}`
						);
					}
				}
			} catch (error) {
				toast.error(`Failed to send join request. Try again later.`, {
					position: toast.POSITION.TOP_RIGHT,
				});
				console.error("Error sending join request:", error);
			}
		}
	}

	// #region Custom form validations
	function isValidInput(value, validationCondition) {
		const isValid = validationCondition(value);
		return isValid;
	}

	const isValidFirstName = (first_name) =>
		isValidInput(first_name, (value) => value.trim() !== "");

	const isValidLastName = (last_name) =>
		isValidInput(last_name, (value) => value.trim() !== "");

	const isValidEmail = (email) =>
		// one or more characters that is not white space before @, contains @, one or more characters that is not white space after @, contains .,one or more chatacters that matches is not white space till the end of the str
		isValidInput(email, (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));

	const isValidContactNumber = (contact_number) =>
		// 8 digit contact number
		isValidInput(contact_number, (value) => /^\d{8}$/.test(value.toString()));

	const isValidAdminNumber = (admin_number) =>
		// 7 digit before a alphabet
		isValidInput(admin_number, (value) => /^\d{7}[A-Za-z]$/.test(value));

	const isValidYearOfStudy = (study_year) =>
		isValidInput(study_year, (value) => [1, 2, 3].includes(value));

	const isValidActiveness = (activeness) =>
		isValidInput(activeness, (value) =>
			["very high", "high", "medium", "low", "very low", "inactive"].includes(
				value
			)
		);
	// #endregion

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
				<Form noValidate onSubmit={sendJoinRequest}>
					<Row className="mb-3">
						<Form.Group as={Col} md="12" controlId="file-dropzone">
							<Form.Label>Profile image:</Form.Label>
							<MyDropzone onFilesChange={handleFilesChange} />
						</Form.Group>
					</Row>
					<Row className="mb-3">
						<Form.Group as={Col} md="6" controlId="firstName">
							<Form.Label>First name:</Form.Label>
							<Form.Control
								type="text"
								placeholder="john"
								required
								isInvalid={!isValidFirstName(form.first_name)}
								isValid={isValidFirstName(form.first_name)}
								value={form.first_name}
								onChange={(e) => updateForm({ first_name: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								First name is required.
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} md="6" controlId="lastName">
							<Form.Label>Last name:</Form.Label>
							<Form.Control
								type="text"
								placeholder="tan"
								required
								isInvalid={!isValidLastName(form.last_name)}
								isValid={isValidLastName(form.last_name)}
								value={form.last_name}
								onChange={(e) => updateForm({ last_name: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Last name is required.
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
					</Row>
					<Row className="mb-3">
						<Form.Group as={Col} md="6" controlId="email">
							<Form.Label>Email:</Form.Label>
							<Form.Control
								type="email"
								placeholder="example@snailmail.com"
								required
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
						<Form.Group as={Col} md="6" controlId="contactNumber">
							<Form.Label>Contact number:</Form.Label>
							<Form.Control
								type="number"
								placeholder="88776969"
								required
								isInvalid={!isValidContactNumber(form.contact_number)}
								isValid={isValidContactNumber(form.contact_number)}
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
						<Form.Group as={Col} md="4" controlId="adminNumber">
							<Form.Label>Admin number:</Form.Label>
							<Form.Control
								type="text"
								placeholder="1234567A"
								required
								isInvalid={!isValidAdminNumber(form.admin_number)}
								isValid={isValidAdminNumber(form.admin_number)}
								value={form.admin_number}
								onChange={(e) => updateForm({ admin_number: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Please provide a valid Admin number.
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} md="4" controlId="yearOfStudy">
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
							<Form.Control.Feedback type="invalid">
								Please select year of study.
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} md="4" controlId="activeness">
							<Form.Label>Activeness:</Form.Label>
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
							<Form.Control.Feedback type="invalid">
								Please select activeness.
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
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
