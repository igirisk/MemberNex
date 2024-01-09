import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

const JoinRequest = (props) => {
	return (
		<Col>
			<Card style={{ width: "11rem" }}>
				<Card.Img variant="top" src="holder.js/100px180" />
				<Card.Body>
					<Card.Title>
						{props.joinRequest.first_name + " " + props.joinRequest.last_name}
					</Card.Title>
					<Stack gap={1}>
						<Button variant="success">Accept</Button>
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
	);
};

const JoinRequests = () => {
	const [joinRequests, setJoinRequest] = useState([]);

	// Fetch all join requests from the database
	useEffect(() => {
		async function getAllJoinRequests() {
			try {
				const res = await fetch("http://localhost:3050/joinRequest");
				if (!res.ok) {
					throw new Error(`An error occurred: ${res.statusText}`);
				}

				const load = await res.json();
				const joinRequestData = load.data;
				setJoinRequest(joinRequestData);
			} catch (error) {
				window.alert(error.message);
			}
		}

		getAllJoinRequests();
	}, [joinRequests.length]);

	// Remove join request from database
	async function rejectJoinRequest(id) {
		await fetch(`http://localhost:3050/joinRequest/${id}`, {
			method: "DELETE",
		});

		const newJoinRequest = joinRequests.filter((el) => el._id !== id);
		setJoinRequest(newJoinRequest);
	}

	// Map out the joinRequests
	function joinRequestList() {
		return joinRequests.map((joinRequest) => {
			return (
				<JoinRequest
					joinRequest={joinRequest}
					rejectJoinRequest={() => {
						rejectJoinRequest(joinRequest._id);
					}}
					key={joinRequest._id}
				/>
			);
		});
	}

	// Display loading state or a message if joinRequests is still an empty array
	if (joinRequests.length === 0) {
		return <div>Loading...</div>;
	}
	return (
		<div id="joinRequests" className="my-5">
			<Container>
				<h2 className="text-start">Join requests</h2>
				<Row>{joinRequestList()}</Row>
			</Container>
		</div>
	);
};

export default JoinRequests;
