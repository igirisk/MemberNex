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

// Display event in card
const EventCard = (props) => {
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
					<Card.Img variant="top" src={props.event.cover_image} />
					<Card.Body>
						<Card.Title>{props.event.name}</Card.Title>
						<Card.Text className="text-muted">
							{props.event.start_time + " - " + props.event.end_time}
						</Card.Text>
					</Card.Body>
				</Card>
			</Col>
			{showModal && (
				<EventModal
					onClose={handleCloseModal}
					props={props}
					updateTrigger={props.updateTrigger}
				/>
			)}
		</>
	);
};

// event popup modal
const EventModal = ({ props, onClose, updateTrigger }) => {
	const [showEdit, setShowEdit] = useState(false);

	const handleShowEdit = () => {
		setShowEdit(true);
	};

	const handleCloseEdit = () => {
		setShowEdit(false);
	};

	const handleUpdate = () => {
		// Call the callback function to trigger the useEffect in Events
		updateTrigger((prev) => !prev);
	};

	return (
		<Modal show={true} onHide={onClose} size="lg">
			<Modal.Header closeButton className="px-4">
				<h2>event</h2>
			</Modal.Header>
			<Modal.Body className="px-4 pb-4">
				{showEdit ? (
					<EventEdit
						event={props.event}
						closeEdit={handleCloseEdit}
						sendReload={handleUpdate}
					/>
				) : (
					<EventDetails
						event={props.event}
						deleteEvent={props.deleteEvent}
						onClose={onClose}
						showEdit={handleShowEdit}
					/>
				)}
			</Modal.Body>
		</Modal>
	);
};

// event details popup content
const EventDetails = ({ event, deleteEvent, showEdit, onClose }) => {
	return (
		<Row>
			<Col md="4">
				<img
					src={event.cover_image}
					alt="cover_image"
					className="rounded img-fluid mb-2"
				/>
				<Stack gap={1}>
					<Button variant="success" onClick={showEdit}>
						Edit
					</Button>
					<Button
						variant="danger"
						onClick={() => {
							deleteEvent(event._id);
							onClose(); // close the modal after deleting
						}}
					>
						Delete
					</Button>
				</Stack>
			</Col>
			<Col md="8">
				<Stack gap={1}>
					<h2>{event.name}</h2>
					<p>Date: {event.date}</p>
					<p>Time: {event.start_time + " - " + event.end_time}</p>
					<p>Description: {event.description}</p>
					<p>Location: {event.location}</p>
				</Stack>
			</Col>
		</Row>
	);
};

// event edit form pop up content
const EventEdit = ({ event, closeEdit, sendReload }) => {
	const [form, setForm] = useState({
		name: "",
		date: "",
		start_time: "",
		end_time: "",
		description: "",
		location: "",
		cover_image: "",
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
					cover_image: base64Image,
				}));
			});
		}
		if (isValidCoverImage(form.cover_image)) {
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

	async function updateEvent(e, id, sendReload) {
		e.preventDefault();
		const formElement = e.currentTarget;
		setValidated(true);

		// Attach the base64-encoded image data to the form
		if (uploadedFiles.length === 1) {
			const base64Image = await convertImageToBase64(uploadedFiles[0]);
			setForm((prevForm) => ({ ...prevForm, cover_image: base64Image }));
		}

		if (formElement.checkValidity() && isValidCoverImage(form.cover_image)) {
			const newUpdate = { ...form };

			// retrieve token from session storage
			const token = sessionStorage.getItem("token");

			try {
				const response = await fetch(`http://localhost:3050/event/${id}`, {
					method: "PATCH",
					headers: {
						Authorization: token ? token : "",
						"Content-Type": "application/json",
					},
					body: JSON.stringify(newUpdate),
				});

				if (response.ok) {
					// Reset the drop zone
					setResetDropzone(true);
					// reset form
					setForm({
						name: "",
						date: "",
						start_time: "",
						end_time: "",
						description: "",
						location: "",
						cover_image: "",
					});
					setFileError(false);
					setUploadedFiles([]);

					// Trigger the callback function passed from EventModal
					sendReload();

					// Show success notification
					toast.success(`event updated successfully.`, {
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
							`Failed to update event.
						${res.error}, details: ${res.details}`
						);
					} else {
						// show unsuccessful notification
						toast.error(`Failed to update event. Try again later.`, {
							position: toast.POSITION.TOP_RIGHT,
						});
						console.log(
							`Failed to submit join request.
						${res.error}, details: ${res.details}`
						);
					}
				}
			} catch (error) {
				toast.error(`Failed to update event. Try again later.`, {
					position: toast.POSITION.TOP_RIGHT,
				});
				console.error("Error updating event:", error);
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

	const isValidName = (name) =>
		isValidInput(name, (value) => value.trim() !== "");

	const isValidDate = (date) =>
		isValidInput(
			date,
			(value) =>
				/^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(new Date(value).getTime()) //date format (YYYY-MM-DD)
		);

	const isValidTime = (time) =>
		isValidInput(
			time,
			(value) =>
				/^([01]\d|2[0-3]):([0-5]\d)$/.test(value) && isValidTimeRange(value) //time format (HH:MM)
		);

	const isValidTimeRange = (time) => {
		const [hours, minutes] = time.split(":");
		return (
			parseInt(hours, 10) >= 0 &&
			parseInt(hours, 10) <= 23 &&
			parseInt(minutes, 10) >= 0 &&
			parseInt(minutes, 10) <= 59
		);
	};

	const isValidDescription = (description) =>
		isValidInput(
			description,
			(value) => value.length >= 50 && value.length <= 600
		);

	const isValidCoverImage = (cover_image) =>
		isValidInput(cover_image, (value) =>
			/^data:image\/(jpeg|jpg|png);base64,/.test(value)
		);
	// #endregion

	return (
		<Row>
			<Col md="3">
				<Stack gap={1}>
					<img
						src={event.cover_image}
						alt="cover_image"
						className="rounded img-fluid mb-2"
					/>
				</Stack>
			</Col>
			<Col md="9">
				<Form
					noValidate
					validated={validated}
					onSubmit={(e) => updateEvent(e, event._id, sendReload)}
				>
					<Row className="mb-3">
						<Form.Group as={Col} md="12" controlId="file-dropzone">
							<Form.Label>Cover image:</Form.Label>
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
						<Form.Group as={Col} md="12" controlId="name">
							<Form.Label>Event name:</Form.Label>
							<Form.Control
								type="text"
								placeholder={event.name}
								isInvalid={!isValidName(form.name)}
								isValid={isValidName(form.name)}
								value={form.name}
								onChange={(e) => updateForm({ name: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Event name is required.
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
					</Row>
					<Row className="mb-3">
						<Form.Group as={Col} md="" controlId="date">
							<Form.Label>Date:</Form.Label>
							<Form.Control
								type="date"
								placeholder={event.date}
								isInvalid={!isValidDate(form.date)}
								isValid={isValidDate(form.date)}
								value={form.date}
								onChange={(e) => updateForm({ date: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Please input a valid date(YYYY-MM-DD).
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} md="" controlId="start_time">
							<Form.Label>Start:</Form.Label>
							<Form.Control
								type="time"
								defaultValue={event.start_time}
								isInvalid={!isValidTime(form.start_time)}
								isValid={isValidTime(form.start_time)}
								vvalue={form.start_time && event.start_time}
								onChange={(e) => updateForm({ start_time: e.target.value })}
							/>

							<Form.Control.Feedback type="invalid">
								Please input a valid start time(HH:MM).
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} md="" controlId="end_time">
							<Form.Label>End:</Form.Label>
							<Form.Control
								type="time"
								defaultValue={event.end_time}
								isInvalid={!isValidTime(form.end_time)}
								isValid={isValidTime(form.end_time)}
								vvalue={form.end_time && event.end_time}
								onChange={(e) => updateForm({ end_time: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Please input a valid end time(HH:MM).
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
					</Row>
					<Row className="mb-3">
						<Form.Group as={Col} md="12" controlId="description">
							<Form.Label>Description:</Form.Label>
							<Form.Control
								type="textfield"
								placeholder={event.description}
								isInvalid={!isValidDescription(form.description)}
								isValid={isValidDescription(form.description)}
								value={form.description}
								onChange={(e) => updateForm({ description: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Please input a valid description(50-600 chatacters).
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

// add event form modal
const EventForm = ({ onClose, updateTrigger }) => {
	const [form, setForm] = useState({
		name: "",
		date: "",
		start_time: "",
		end_time: "",
		description: "",
		location: "",
		cover_image: "",
	});

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
					cover_image: base64Image,
				}));
			});
		}
		if (isValidCoverImage(form.cover_image)) {
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
	}

	const sendReload = () => {
		// Call the callback function to trigger the useEffect in Members
		updateTrigger((prev) => !prev);
	};

	async function addEvent(e, sendReload) {
		e.preventDefault();
		const formElement = e.currentTarget;

		// Attach the base64-encoded image data to the form
		if (uploadedFiles.length === 1) {
			const base64Image = await convertImageToBase64(uploadedFiles[0]);
			setForm((prevForm) => ({ ...prevForm, cover_image: base64Image }));
		}

		if (formElement.checkValidity() && isValidCoverImage(form.cover_image)) {
			const newEvent = { ...form };
			// retrieve token from session storage
			const token = sessionStorage.getItem("token");
			try {
				const response = await fetch(`http://localhost:3050/event`, {
					method: "POST",
					headers: {
						Authorization: token ? token : "",
						"Content-Type": "application/json",
					},
					body: JSON.stringify(newEvent),
				});

				if (response.ok) {
					// Reset the drop zone
					setResetDropzone(true);
					// reset form
					setForm({
						name: "",
						date: "",
						start_time: "",
						end_time: "",
						description: "",
						location: "",
						cover_image: "",
					});
					setFileError(false);
					setUploadedFiles([]);

					// Trigger the callback function passed from EventModal
					sendReload();

					// Show success notification
					toast.success(`Event added successfully.`, {
						position: toast.POSITION.TOP_RIGHT,
					});
				} else {
					const res = await response.json();

					if (res.error === "Event name already registered, try another.") {
						// show unsuccessful notification
						toast.error(`${res.error}.`, {
							position: toast.POSITION.TOP_RIGHT,
						});
						console.log(
							`Failed to add event.
						${res.error}, details: ${res.details}`
						);
					} else {
						// show unsuccessful notification
						toast.error(`Failed to add event. Try again later.`, {
							position: toast.POSITION.TOP_RIGHT,
						});
						console.log(
							`Failed to add event.
						${res.error}, details: ${res.details}`
						);
					}
				}
			} catch (error) {
				toast.error(`Failed to add event. Try again later.`, {
					position: toast.POSITION.TOP_RIGHT,
				});
				console.error("Error adding event:", error);
			}
		} else {
			toast.error(`All fields required!`, {
				position: toast.POSITION.TOP_RIGHT,
			});
		}
	}

	// #region Custom form validations
	function isValidInput(value, validationCondition) {
		const isValid = validationCondition(value);
		return isValid;
	}

	const isValidName = (name) =>
		isValidInput(name, (value) => value.trim() !== "");

	const isValidDate = (date) =>
		isValidInput(
			date,
			(value) =>
				/^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(new Date(value).getTime()) //date format (YYYY-MM-DD)
		);

	const isValidTime = (time) =>
		isValidInput(
			time,
			(value) =>
				/^([01]\d|2[0-3]):([0-5]\d)$/.test(value) && isValidTimeRange(value) //time format (HH:MM)
		);

	const isValidTimeRange = (time) => {
		const [hours, minutes] = time.split(":");
		return (
			parseInt(hours, 10) >= 0 &&
			parseInt(hours, 10) <= 23 &&
			parseInt(minutes, 10) >= 0 &&
			parseInt(minutes, 10) <= 59
		);
	};

	const isValidDescription = (description) =>
		isValidInput(
			description,
			(value) => value.length >= 50 && value.length <= 600
		);

	const isValidCoverImage = (cover_image) =>
		isValidInput(cover_image, (value) =>
			/^data:image\/(jpeg|jpg|png);base64,/.test(value)
		);

	const isValidLocation = (location) =>
		isValidInput(location, (value) => value.trim() !== "");
	// #endregion

	return (
		<Modal show={true} onHide={onClose} size="lg">
			<Modal.Header closeButton className="px-4">
				<h2>Add event</h2>
			</Modal.Header>
			<Modal.Body className="px-4 pb-4">
				<Form noValidate onSubmit={(e) => addEvent(e, sendReload)}>
					<Row className="mb-3">
						<Form.Group as={Col} md="12" controlId="file-dropzone">
							<Form.Label>Cover image:</Form.Label>
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
						<Form.Group as={Col} md="12" controlId="name">
							<Form.Label>Event name:</Form.Label>
							<Form.Control
								type="text"
								placeholder="python quick start"
								required
								isInvalid={!isValidName(form.name)}
								isValid={isValidName(form.name)}
								value={form.name}
								onChange={(e) => updateForm({ name: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Event name is required.
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
					</Row>
					<Row className="mb-3">
						<Form.Group as={Col} md="4" controlId="date">
							<Form.Label>Date:</Form.Label>
							<Form.Control
								type="date"
								placeholder="YYYY-MM-DD"
								required
								isInvalid={!isValidDate(form.date)}
								isValid={isValidDate(form.date)}
								value={form.date}
								onChange={(e) => updateForm({ date: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Please input a valid date(YYYY-MM-DD).
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} md="4" controlId="start">
							<Form.Label>Start:</Form.Label>
							<Form.Control
								type="time"
								placeholder="HH:MM"
								required
								isInvalid={!isValidTime(form.start_time)}
								isValid={isValidTime(form.start_time)}
								value={form.start_time}
								onChange={(e) => updateForm({ start_time: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Please input a valid start time(HH:MM).
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} md="4" controlId="end">
							<Form.Label>End:</Form.Label>
							<Form.Control
								type="time"
								placeholder="HH:MM"
								required
								isInvalid={!isValidTime(form.end_time)}
								isValid={isValidTime(form.end_time)}
								value={form.end_time}
								onChange={(e) => updateForm({ end_time: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Please input a valid end time(HH:MM).
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
					</Row>
					<Row className="mb-3">
						<Form.Group as={Col} md="12" controlId="description">
							<Form.Label>Description:</Form.Label>
							<Form.Control
								type="textfield"
								placeholder="Enter detail..."
								required
								isInvalid={!isValidDescription(form.description)}
								isValid={isValidDescription(form.description)}
								value={form.description}
								onChange={(e) => updateForm({ description: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Please input a valid description(50-600 chatacters).
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
					</Row>
					<Row className="mb-3">
						<Form.Group as={Col} md="12" controlId="location">
							<Form.Label>Location:</Form.Label>
							<Form.Control
								type="textfield"
								placeholder="Enter location..."
								required
								isInvalid={!isValidLocation(form.location)}
								isValid={isValidLocation(form.location)}
								value={form.location}
								onChange={(e) => updateForm({ location: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Please input a valid description(50-600 chatacters).
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
					</Row>
					<Button type="submit">Send request</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

const Events = ({ relaod, count }) => {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [updateTrigger, setUpdateTrigger] = useState(false);
	const [showEventForm, setShowEventForm] = useState(false);

	const handleShowEventForm = () => {
		setShowEventForm(true);
	};

	const handleCloseEventForm = () => {
		setShowEventForm(false);
	};

	// Fetch all join requests from the database
	useEffect(() => {
		async function getAllEvents() {
			// retrieve token from session storage
			const token = sessionStorage.getItem("token");
			try {
				const response = await fetch("http://localhost:3050/event", {
					method: "GET",
					headers: {
						Authorization: token ? token : "",
					},
				});
				if (response.ok) {
					const eventsData = (await response.json()).data;
					setEvents(eventsData);
				} else {
					const res = await response.json();

					// show unsuccessful notification
					toast.error(`Failed to get events. Try again later.`, {
						position: toast.POSITION.TOP_RIGHT,
					});
					console.log(
						`Failed to get events.
						${res.error}, details: ${res.details}`
					);
					setError(`Failed to get events. Try again later.`);
				}
			} catch (error) {
				toast.error(`Failed to get events. Try again later.`, {
					position: toast.POSITION.TOP_RIGHT,
				});
				console.error("Error getting events:", error);
				setError(`Failed to get events. Try again later.`);
			} finally {
				// Set loading to false once data is fetched (whether successful or not)
				setLoading(false);
			}
		}

		getAllEvents();
	}, [updateTrigger, relaod]);

	// Remove event from database
	async function deleteEvent(id) {
		// retrieve token from session storage
		const token = sessionStorage.getItem("token");
		try {
			const response = await fetch(`http://localhost:3050/event/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: token ? token : "",
				},
			});

			if (response.ok) {
				const newEvents = events.filter((el) => el._id !== id);
				setEvents(newEvents);

				// Show success notification
				toast.success(`event deleted`, {
					position: toast.POSITION.TOP_RIGHT,
				});
			} else {
				const res = await response.json();

				// show unsuccessful notification
				toast.error(`Failed to delete event. Try again later.`, {
					position: toast.POSITION.TOP_RIGHT,
				});
				console.log(
					`Failed to delete event.
				${res.error}, details: ${res.details}`
				);
			}
		} catch (error) {
			toast.error(`Failed to  delete event. Try again later.`, {
				position: toast.POSITION.TOP_RIGHT,
			});
			console.error("Error deleting event:", error);
		}
	}

	// Map out the specified number of events
	function eventsList(updateTriggerSetter, numberOfEvents) {
		return events.slice(0, numberOfEvents).map((event) => {
			return (
				<EventCard
					event={event}
					deleteEvent={() => {
						deleteEvent(event._id);
					}}
					key={event._id}
					updateTrigger={updateTriggerSetter}
				/>
			);
		});
	}

	// Display the event cards in rows
	return (
		<div id="events" className="my-5">
			<Container>
				<Stack direction="horizontal" gap={3}>
					<h2 className="text-start">Events</h2>
					<Button
						className="btn btn-primary btn-circle p-1"
						onClick={handleShowEventForm}
					>
						<i className="fas fa-plus"></i>
					</Button>
				</Stack>
				{loading ? (
					<p>
						<i className="fas fa-spinner fa-pulse"></i> Loading...
					</p>
				) : error ? (
					<p>{error}</p>
				) : events.length === 0 ? (
					<p>There is currently no event</p>
				) : (
					<Row>{eventsList(setUpdateTrigger, count)}</Row>
				)}
			</Container>
			{showEventForm && (
				<EventForm
					onClose={handleCloseEventForm}
					updateTrigger={setUpdateTrigger}
				/>
			)}
			<ToastContainer />
		</div>
	);
};

export default Events;
