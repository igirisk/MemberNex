import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import Modal from "react-bootstrap/Modal";

// Display member in card
const MemberCard = (props) => {
	return (
		<Col>
			<Card style={{ width: "11rem" }}>
				<Card.Img variant="top" src="holder.js/100px180" />
				<Card.Body>
					<Card.Title>
						{props.member.first_name + " " + props.member.last_name}
					</Card.Title>
					<Card.Text className="text-muted">{props.member.role}</Card.Text>
				</Card.Body>
			</Card>
		</Col>
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
					// acceptJoinRequest={() => {
					// 	acceptJoinRequest(member);
					// }}
					// rejectJoinRequest={() => {
					// 	rejectJoinRequest(member._id);
					// }}
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
