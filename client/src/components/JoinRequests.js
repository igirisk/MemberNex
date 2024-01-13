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
					<Card.Img variant="top" src="holder.js/100px180" />
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
						<img src="" alt="profile image" />
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
							<p>Admin number:{joinRequest.admin_number}</p>
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
				}
			} catch (error) {
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
			};

			// Create new member and remove join request simultaneously
			const [memberResponse, joinRequestResponse] = await Promise.all([
				fetch("http://localhost:3050/member", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(newMember),
				}),
				fetch(`http://localhost:3050/joinRequest/${joinRequest._id}`, {
					method: "DELETE",
				}),
			]);

			if (memberResponse.ok && joinRequestResponse.ok) {
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
				const [memberRes, joinRequestRes] = await Promise.all([
					memberResponse.json(),
					joinRequestResponse.json(),
				]);

				// show unsuccessful notification
				toast.error(`Failed to accept join request. Try again later.`, {
					position: toast.POSITION.TOP_RIGHT,
				});
				console.log(
					`Failed to accept join request. 
					Member Error: ${memberRes.error}, details: ${memberRes.details} 
					Join Request Error: ${joinRequestRes.error}, details: ${joinRequestRes.details}`
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
					<p>Loading...</p>
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
