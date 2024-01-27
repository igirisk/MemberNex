import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import MyDropzone from "./MyDropzone";

// Display member in card
const MemberCard = (props) => {
	const [showModal, setShowModal] = useState(false);

	const handleShowModal = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	return (
		<>
			<Col>
				<Card style={{ width: "11rem" }} onClick={handleShowModal}>
					<Card.Img variant="top" src={props.member.profile_image} />
					<Card.Body>
						<Card.Title>
							{props.member.first_name + " " + props.member.last_name}
						</Card.Title>
						<Card.Text className="text-muted">{props.member.role}</Card.Text>
					</Card.Body>
				</Card>
			</Col>
			{showModal && (
				<MemberModal
					onClose={handleCloseModal}
					props={props}
					updateTrigger={props.updateTrigger}
				/>
			)}
		</>
	);
};

// Member popup modal
const MemberModal = ({ props, onClose, updateTrigger }) => {
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
				<h2>Member</h2>
			</Modal.Header>
			<Modal.Body className="px-4 pb-4">
				{showEdit ? (
					<MemberEdit
						member={props.member}
						closeEdit={handleCloseEdit}
						sendReload={handleUpdate}
					/>
				) : (
					<MemberDetails
						member={props.member}
						deleteMember={props.deleteMember}
						onClose={onClose}
						showEdit={handleShowEdit}
					/>
				)}
			</Modal.Body>
		</Modal>
	);
};

// Member details popup content
const MemberDetails = ({ member, deleteMember, showEdit, onClose }) => {
	return (
		<Row>
			<Col md="4">
				<img
					src={member.profile_image}
					alt="profile image"
					className="rounded img-fluid mb-2"
				/>
				<Stack gap={1}>
					<Button variant="success" onClick={showEdit}>
						Edit
					</Button>
					<Button
						variant="danger"
						onClick={() => {
							deleteMember(member._id);
							onClose(); // close the modal after deleting
						}}
					>
						Delete
					</Button>
				</Stack>
			</Col>
			<Col md="8">
				<Stack gap={1}>
					<h2>{member.first_name + " " + member.last_name}</h2>
					<p>Role: {member.role}</p>
					<p>Email: {member.email}</p>
					<p>Contact number: {member.contact_number}</p>
					<p>Admin number: {member.admin_number}</p>
					<p>Year of study: {member.study_year}</p>
					<p>Activeness: {member.activeness}</p>
				</Stack>
			</Col>
		</Row>
	);
};

// Member edit form pop up content
const MemberEdit = ({ member, closeEdit, sendReload }) => {
	const [form, setForm] = useState({
		first_name: "",
		last_name: "",
		email: "",
		admin_number: "",
		contact_number: "",
		study_year: "",
		activeness: "",
		role: "",
	});

	const [validated, setValidated] = useState(false);
	const [fileError, setFileError] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [resetDropzone, setResetDropzone] = useState(false);

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
		if (isValidProfileImage(form.profile_image)) {
			setFileError(false); // Reset file error state
		} else {
			// Handle invalid image case
			setFileError(true); // Set file error state
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
		setValidated(false);
	}

	async function updateMember(e, id, sendReload) {
		e.preventDefault();
		const formElement = e.currentTarget;
		setValidated(true);

		// Attach the base64-encoded image data to the form
		if (uploadedFiles.length === 1) {
			const base64Image = await convertImageToBase64(uploadedFiles[0]);
			setForm((prevForm) => ({ ...prevForm, profile_image: base64Image }));
		}

		if (
			formElement.checkValidity() &&
			isValidProfileImage(form.profile_image)
		) {
			const newUpdate = { ...form };

			try {
				const response = await fetch(`http://localhost:3050/member/${id}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(newUpdate),
				});

				if (response.ok) {
					// Reset the drop zone
					setResetDropzone(true);
					// reset form
					setForm({
						first_name: "",
						last_name: "",
						email: "",
						admin_number: "",
						contact_number: "",
						study_year: "",
						activeness: "",
						role: "",
						profile_image: "",
					});
					setFileError(false);
					setUploadedFiles([]);

					// Trigger the callback function passed from MemberModal
					sendReload();

					// Show success notification
					toast.success(`Member updated successfully.`, {
						position: toast.POSITION.TOP_RIGHT,
					});
				} else {
					const res = await response.json();

					if (res.error === "Admin number already registered, try another.") {
						// show unsuccessful notification
						toast.error(`${res.error}.`, {
							position: toast.POSITION.TOP_RIGHT,
						});
						console.log(
							`Failed to update member.
						${res.error}, details: ${res.details}`
						);
					} else {
						// show unsuccessful notification
						toast.error(`Failed to update member. Try again later.`, {
							position: toast.POSITION.TOP_RIGHT,
						});
						console.log(
							`Failed to submit join request.
						${res.error}, details: ${res.details}`
						);
					}
				}
			} catch (error) {
				toast.error(`Failed to update member. Try again later.`, {
					position: toast.POSITION.TOP_RIGHT,
				});
				console.error("Error updating member:", error);
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

	const isValidRole = (role) =>
		isValidInput(role, (value) =>
			["main com", "sub com", "member"].includes(value)
		);

	const isValidProfileImage = (profile_image) =>
		isValidInput(profile_image, (value) =>
			/^data:image\/(jpeg|jpg|png);base64,/.test(value)
		);
	// #endregion

	return (
		<Row>
			<Col md="3">
				<Stack gap={1}>
					<img
						src={member.profile_image}
						alt="profile image"
						className="rounded img-fluid mb-2"
					/>
				</Stack>
			</Col>
			<Col md="9">
				<Form
					noValidate
					validated={validated}
					onSubmit={(e) => updateMember(e, member._id, sendReload)}
				>
					<Row className="mb-3">
						<Form.Group as={Col} md="12" controlId="file-dropzone">
							<Form.Label>Profile image:</Form.Label>
							<MyDropzone
								onFilesChange={handleFilesChange}
								reset={resetDropzone}
							/>
							{fileError && (
								<div className="text-danger">
									Please upload a valid image file(jpg, jpeg or png)
								</div>
							)}
							{!fileError && <div className="text-success">Looks good!</div>}
						</Form.Group>
					</Row>
					<Row className="mb-3">
						<Form.Group as={Col} md="6" controlId="firstName">
							<Form.Label>First name:</Form.Label>
							<Form.Control
								type="text"
								placeholder={member.first_name}
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
								placeholder={member.last_name}
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
						<Form.Group as={Col} md="6" controlId="contactNumber">
							<Form.Label>Contact number:</Form.Label>
							<Form.Control
								type="number"
								placeholder={member.contact_number}
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
						<Form.Group as={Col} md="6" controlId="adminNumber">
							<Form.Label>Admin number:</Form.Label>
							<Form.Control
								type="text"
								placeholder={member.admin_number}
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
					</Row>
					<Row className="mb-3">
						<Form.Group as={Col} md="4" controlId="yearOfStudy">
							<Form.Label>Year of study:</Form.Label>
							<Form.Select
								id="study_year"
								value={form.study_year}
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
						<Form.Group as={Col} md="4" controlId="role">
							<Form.Label>Role:</Form.Label>
							<Form.Select
								id="role"
								value={form.role}
								isValid={isValidRole(form.role)}
								isInvalid={!isValidRole(form.role)}
								onChange={(e) => updateForm({ role: e.target.value })}
							>
								<option value="" disabled>
									Select role
								</option>
								<option>member</option>
								<option>sub com</option>
								<option>main com</option>
							</Form.Select>
							<Form.Control.Feedback type="invalid">
								Please select activeness.
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
					</Row>
					<Stack direction="horizontal" gap={3}>
						<Button type="button" variant="danger" onClick={closeEdit}>
							Cancel
						</Button>
						<Button type="submit" variant="primary">
							Update
						</Button>
					</Stack>
				</Form>
			</Col>
		</Row>
	);
};

const Members = (relaod) => {
	const [members, setMembers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [updateTrigger, setUpdateTrigger] = useState(false);

	// Fetch all join requests from the database
	useEffect(() => {
		async function getAllMembers() {
			try {
				const response = await fetch("http://localhost:3050/member");
				if (response.ok) {
					const membersData = (await response.json()).data;
					setMembers(membersData);
				} else {
					const res = await response.json();

					// show unsuccessful notification
					toast.error(`Failed to get members. Try again later.`, {
						position: toast.POSITION.TOP_RIGHT,
					});
					console.log(
						`Failed to get members.
						${res.error}, details: ${res.details}`
					);
					setError(`Failed to get members. Try again later.`);
				}
			} catch (error) {
				toast.error(`Failed to get members. Try again later.`, {
					position: toast.POSITION.TOP_RIGHT,
				});
				console.error("Error getting members:", error);
				setError(`Failed to get members. Try again later.`);
			} finally {
				// Set loading to false once data is fetched (whether successful or not)
				setLoading(false);
			}
		}

		getAllMembers();
	}, [updateTrigger, relaod]);

	// Remove member from database
	async function deleteMember(id) {
		try {
			const response = await fetch(`http://localhost:3050/member/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				const newMembers = members.filter((el) => el._id !== id);
				setMembers(newMembers);

				// Show success notification
				toast.success(`Member deleted`, {
					position: toast.POSITION.TOP_RIGHT,
				});
			} else {
				const res = await response.json();

				// show unsuccessful notification
				toast.error(`Failed to delete member. Try again later.`, {
					position: toast.POSITION.TOP_RIGHT,
				});
				console.log(
					`Failed to delete member.
				${res.error}, details: ${res.details}`
				);
			}
		} catch (error) {
			toast.error(`Failed to  delete member. Try again later.`, {
				position: toast.POSITION.TOP_RIGHT,
			});
			console.error("Error deleting member:", error);
		}
	}

	// Map out the members
	function membersList(updateTriggerSetter) {
		return members.map((member) => {
			return (
				<MemberCard
					member={member}
					deleteMember={() => {
						deleteMember(member._id);
					}}
					key={member._id}
					updateTrigger={updateTriggerSetter}
				/>
			);
		});
	}

	// Display the member cards in rows
	return (
		<div id="members" className="my-5">
			<Container>
				<h2 className="text-start">Members</h2>
				{loading ? (
					<p>
						<i className="fas fa-spinner fa-pulse"></i> Loading...
					</p>
				) : error ? (
					<p>{error}</p>
				) : members.length === 0 ? (
					<p>There is currently no member</p>
				) : (
					<Row>{membersList(setUpdateTrigger)}</Row>
				)}
			</Container>
			<ToastContainer />
		</div>
	);
};

export default Members;
