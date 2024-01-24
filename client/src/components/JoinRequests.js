import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import Modal from "react-bootstrap/Modal";

const JoinRequestCard = (props) => {
	const [showDetails, setShowDetails] = useState(false);

	const handleShowDetails = () => {
		setShowDetails(true);
	};

	const handleCloseDetails = () => {
		setShowDetails(false);
	};

	return (
		<>
			<Col>
				<Card style={{ width: "11rem" }} onClick={handleShowDetails}>
					<Card.Img variant="top" src={props.joinRequest.profile_image} />
					<Card.Body>
						<Card.Title>
							{props.joinRequest.first_name + " " + props.joinRequest.last_name}
						</Card.Title>
						<Stack gap={1}>
							<Button
								variant="success"
								onClick={() => {
									props.acceptJoinRequest(props.joinRequest);
								}}
							>
								Accept
							</Button>
							<Button
								variant="danger"
								onClick={() => {
									props.rejectJoinRequest(props.joinRequest._id);
								}}
							>
								Reject
							</Button>
						</Stack>
					</Card.Body>
				</Card>
			</Col>
			{showDetails && (
				<JoinRequestDetails
					joinRequest={props.joinRequest}
					acceptJoinRequest={props.acceptJoinRequest}
					rejectJoinRequest={props.rejectJoinRequest}
					profile_image={props.joinRequest.profile_image}
					onClose={handleCloseDetails}
				/>
			)}
		</>
	);
};

const JoinRequestDetails = ({
	joinRequest,
	acceptJoinRequest,
	rejectJoinRequest,
	profile_image,
	onClose,
}) => {
	return (
		<Modal show={true} onHide={onClose}>
			<Modal.Header closeButton className="px-4">
				<h2>Join Request</h2>
			</Modal.Header>
			<Modal.Body className="px-4">
				<Row>
					<Col md="4">
						<img
							src={profile_image}
							alt="profile image"
							className="rounded img-fluid mb-2"
						/>

						<Stack gap={1}>
							<Button
								variant="success"
								onClick={() => {
									acceptJoinRequest(joinRequest);
									onClose(); // close the modal after accepting
								}}
							>
								Accept
							</Button>
							<Button
								variant="danger"
								onClick={() => {
									rejectJoinRequest(joinRequest._id);
									onClose(); // close the modal after rejecting
								}}
							>
								Reject
							</Button>
						</Stack>
					</Col>
					<Col md="8">
						<Stack gap={1}>
							<h2>{joinRequest.first_name + " " + joinRequest.last_name}</h2>
							<p>Email: {joinRequest.email}</p>
							<p>Contact number: {joinRequest.contact_number}</p>
							<p>Admin number: {joinRequest.admin_number}</p>
							<p>Year of study: {joinRequest.study_year}</p>
							<p>Activeness: {joinRequest.activeness}</p>
						</Stack>
					</Col>
				</Row>
			</Modal.Body>
		</Modal>
	);
};

const JoinRequests = ({ setReload }) => {
	const [joinRequests, setJoinRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const handleUpdate = () => {
		// Call the callback function to trigger the useEffect in Members
		setReload((prev) => !prev);
	};

	// Fetch all join requests from the database
	useEffect(() => {
		async function getAllJoinRequests() {
			try {
				const response = await fetch("http://localhost:3050/joinRequest");
				if (response.ok) {
					const joinRequestData = (await response.json()).data;
					setJoinRequests(joinRequestData);
				} else {
					const res = await response.json();

					// show unsuccessful notification
					toast.error(`Failed to get join requests. Try again later.`, {
						position: toast.POSITION.TOP_RIGHT,
					});
					console.log(
						`Failed to get join requests.
						${res.error}, details: ${res.details}`
					);
					setError(`Failed to get join requests. Try again later.`);
				}
			} catch (error) {
				setError(`Failed to get join requests. Try again later.`);
				toast.error(`Failed to get join requests. Try again later.`, {
					position: toast.POSITION.TOP_RIGHT,
				});
				console.error("Error getting join requests:", error);
			} finally {
				// Set loading to false once data is fetched (whether successful or not)
				setLoading(false);
			}
		}

		getAllJoinRequests();
	}, []);

	// Remove join request from database
	async function rejectJoinRequest(id) {
		try {
			const response = await fetch(`http://localhost:3050/joinRequest/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				const newJoinRequests = joinRequests.filter((el) => el._id !== id);
				setJoinRequests(newJoinRequests);

				// Show success notification
				toast.success(`Join request rejected`, {
					position: toast.POSITION.TOP_RIGHT,
				});
			} else {
				const res = await response.json();

				// show unsuccessful notification
				toast.error(`Failed to reject join request. Try again later.`, {
					position: toast.POSITION.TOP_RIGHT,
				});
				console.log(
					`Failed to reject join request.
					${res.error}, details: ${res.details}`
				);
			}
		} catch (error) {
			toast.error(`Failed to reject join request. Try again later.`, {
				position: toast.POSITION.TOP_RIGHT,
			});
			console.error("Error rejecting join request:", error);
		}
	}

	// Remove join request and create member
	async function acceptJoinRequest(joinRequest) {
		try {
			const newMember = {
				first_name: joinRequest.first_name,
				last_name: joinRequest.last_name,
				email: joinRequest.email,
				contact_number: joinRequest.contact_number,
				admin_number: joinRequest.admin_number,
				study_year: joinRequest.study_year,
				activeness: joinRequest.activeness,
				profile_image: joinRequest.profile_image,
			};

			// Create new member
			const memberResponse = await fetch("http://localhost:3050/member", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newMember),
			});

			// Check if member creation is successful
			if (memberResponse.ok) {
				// Remove join request if member creation is successful
				const joinRequestResponse = await fetch(
					`http://localhost:3050/joinRequest/${joinRequest._id}`,
					{
						method: "DELETE",
					}
				);

				if (joinRequestResponse.ok) {
					// Trigger the update of Members component
					handleUpdate();

					// Show success notification
					toast.success(`Join request accepted`, {
						position: toast.POSITION.TOP_RIGHT,
					});

					// Update the state
					const newJoinRequest = joinRequests.filter(
						(el) => el._id !== joinRequest._id
					);
					setJoinRequests(newJoinRequest);
				} else {
					const res = await joinRequestResponse.json();

					// Show unsuccessful notification
					toast.error(`Failed to accept join request. Try again later.`, {
						position: toast.POSITION.TOP_RIGHT,
					});
					console.log(
						`Failed to accept join request.
			${res.error}, details: ${res.details}`
					);
				}
			} else {
				const res = await memberResponse.json();

				// Show unsuccessful notification
				toast.error(`Failed to accept join request. Try again later.`, {
					position: toast.POSITION.TOP_RIGHT,
				});
				console.log(
					`Failed to accept join request. 
		  Member Error: ${res.error}, details: ${res.details}`
				);
			}
		} catch (error) {
			toast.error(`Failed to accept join request. Try again later.`, {
				position: toast.POSITION.TOP_RIGHT,
			});
			console.error("Error accepting join request:", error);
		}
	}

	// Map out the joinRequests
	function joinRequestsList() {
		return joinRequests.map((joinRequest) => {
			return (
				<JoinRequestCard
					joinRequest={joinRequest}
					acceptJoinRequest={() => {
						acceptJoinRequest(joinRequest);
					}}
					rejectJoinRequest={() => {
						rejectJoinRequest(joinRequest._id);
					}}
					key={joinRequest._id}
				/>
			);
		});
	}

	return (
		<div id="joinRequests" className="my-5">
			<Container>
				<h2 className="text-start">Join requests</h2>
				{loading ? (
					<p>
						<i class="fas fa-spinner fa-pulse"></i> Loading...
					</p>
				) : error ? (
					<p>{error}</p>
				) : joinRequests.length === 0 ? (
					<p>There is currently no join request</p>
				) : (
					<Row>{joinRequestsList()}</Row>
				)}
			</Container>
			<ToastContainer />
		</div>
	);
};

export default JoinRequests;
