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
					<Card.Img variant="top" src="holder.js/100px180" />
					<Card.Body>
						<Card.Title>
							{props.member.first_name + " " + props.member.last_name}
						</Card.Title>
						<Card.Text className="text-muted">{props.member.role}</Card.Text>
					</Card.Body>
				</Card>
			</Col>
			{showModal && <MemberModal onClose={handleCloseModal} props={props} />}
		</>
	);
};

// Member details
const MemberModal = ({ props, onClose }) => {
	const [showEdit, setShowEdit] = useState(false);

	const handleShowEdit = () => {
		setShowEdit(true);
	};

	const handleCloseEdit = () => {
		setShowEdit(false);
	};

	return (
		<Modal show={true} onHide={onClose}>
			<Modal.Header closeButton className="px-4 pb-3">
				<h2>Member</h2>
			</Modal.Header>
			<Modal.Body className="px-4">
				{showEdit ? (
					<MemberEdit member={props.member} closeEdit={handleCloseEdit} />
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

// Member details
const MemberDetails = ({ member, deleteMember, showEdit, onClose }) => {
	return (
		<Row>
			<Col md="4">
				<img src="" alt="profile image" />
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
					<p>Admin number:{member.admin_number}</p>
					<p>Year of study: {member.study_year}</p>
					<p>Activeness: {member.activeness}</p>
				</Stack>
			</Col>
		</Row>
	);
};

const MemberEdit = ({ member, closeEdit }) => {
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

	function updateForm(value) {
		setForm((prev) => ({ ...prev, ...value }));
		setValidated(false);
	}

	async function updateMember(e, id) {
		e.preventDefault();
		const formElement = e.currentTarget;
		setValidated(true);

		if (formElement.checkValidity()) {
			const newUpdate = { ...form };
			console.log(JSON.stringify(newUpdate));

			try {
				const response = await fetch(`http://localhost:3050/member/${id}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(newUpdate),
				});

				if (response.ok) {
					setForm({
						first_name: "",
						last_name: "",
						email: "",
						admin_number: "",
						contact_number: "",
						study_year: "",
						activeness: "",
						role: "",
					});

					// Show success notification
					toast.success(`Member updated successfully`, {
						position: toast.POSITION.TOP_RIGHT,
					});
				} else {
					const res = await response.json();

					// show unsuccessful notification
					toast.error(`Failed to update member. Try again later.`, {
						position: toast.POSITION.TOP_RIGHT,
					});
					console.log(
						`Failed to update member.
						${res.error}, details: ${res.details}`
					);
				}
			} catch (error) {
				toast.error(`Failed to update member. Try again later.`, {
					position: toast.POSITION.TOP_RIGHT,
				});
				console.error("Error updating member:", error);
			}
		}
	}

	// validations
	function isValidEmail(email) {
		// one or more characters that is not white space before @, contains @, one or more characters that is not white space after @, contains .,one or more chatacters that matches is not white space till the end of the str
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function isValidAdminNumber(admin_number) {
		const adminNumberRegex = /^\d{7}[A-Za-z]$/; // 6 digit before a alphabet
		return adminNumberRegex.test(admin_number);
	}

	function isValidContactNumber(contact_number) {
		const contactNumberRegex = /^\d{8}$/; // 8 digit contact number
		return contactNumberRegex.test(contact_number);
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

	function isValidRole(role) {
		const value = ["main com", "sub com", "member"];
		return value.includes(role.toLowerCase());
	}

	return (
		<Row>
			<Col md="4">
				<img src="" alt="profile image" />
				<Button variant="success">Upload image</Button>
			</Col>
			<Col md="8">
				<Form
					noValidate
					validated={validated}
					onSubmit={(e) => updateMember(e, member._id)}
				>
					<Row className="mb-3">
						<Form.Group as={Col} md="6" controlId="validationCustom01">
							<Form.Label>First name:</Form.Label>
							<Form.Control
								type="text"
								placeholder={member.first_name}
								value={form.first_name}
								onChange={(e) => updateForm({ first_name: e.target.value })}
							/>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} md="6" controlId="validationCustom02">
							<Form.Label>Last name:</Form.Label>
							<Form.Control
								type="text"
								placeholder={member.last_name}
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
								placeholder={member.email}
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
								placeholder={member.contact_number}
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
						<Form.Group as={Col} md="6" controlId="validationCustom03">
							<Form.Label>Admin number:</Form.Label>
							<Form.Control
								type="text"
								placeholder={member.admin_number}
								isInvalid={!isValidAdminNumber(form.admin_number)}
								value={form.admin_number}
								onChange={(e) => updateForm({ admin_number: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Please provide a valid Admin number.
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} md="6">
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
						</Form.Group>
						<Form.Group as={Col} md="6">
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
						</Form.Group>
						<Form.Group as={Col} md="6">
							<Form.Label>Role:</Form.Label>
							<Form.Select
								id="activeness"
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

const Members = () => {
	const [members, setMembers] = useState([]);
	const [loading, setLoading] = useState(true);

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
				}
			} catch (error) {
				toast.error(`Failed to get members. Try again later.`, {
					position: toast.POSITION.TOP_RIGHT,
				});
				console.error("Error getting members:", error);
			} finally {
				// Set loading to false once data is fetched (whether successful or not)
				setLoading(false);
			}
		}

		getAllMembers();
	}, []);

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
	function membersList() {
		return members.map((member) => {
			return (
				<MemberCard
					member={member}
					deleteMember={() => {
						deleteMember(member._id);
					}}
					key={member._id}
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
					<p>Loading...</p>
				) : members.length === 0 ? (
					<p>There is currently no member</p>
				) : (
					<Row>{membersList()}</Row>
				)}
			</Container>
			<ToastContainer />
		</div>
	);
};

export default Members;
