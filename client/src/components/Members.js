import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { useEffect, useState } from "react";

// // Display member in card
// const Member = (props) => {
// 	return (
// 		<Col>
// 			<Card style={{ width: "11rem" }}>
// 				<Card.Img variant="top" src="holder.js/100px180" />
// 				<Card.Body>
// 					<Card.Title>
// 						{props.member.first_name + " " + props.member.last_name}
// 					</Card.Title>
// 					<Card.Text className="text-muted">
// 						{props.member.contact_number}
// 					</Card.Text>
// 				</Card.Body>
// 			</Card>
// 		</Col>
// 	);
// };

const Members = () => {
	// const [members, setMembers] = useState([]);

	// // This method fetches the all members from the database
	// useEffect(() => {
	// 	async function getMembers() {
	// 		try {
	// 			const res = await fetch("http://localhost:3050/member");
	// 			if (!res.ok) {
	// 				throw new Error(`An error occurred: ${res.statusText}`);
	// 			}

	// 			const load = await res.json();
	// 			const membersData = load.data;
	// 			setMembers(membersData);
	// 		} catch (error) {
	// 			window.alert(error.message);
	// 		}
	// 	}

	// 	getMembers();
	// }, []);

	// // This method will map out the members
	// function membersList() {
	// 	return members.map((member) => {
	// 		return <Member member={member} key={member._id} />;
	// 	});
	// }

	// // Display loading state or a message if members is still an empty array
	// if (members.length === 0) {
	// 	return <div>Loading...</div>;
	// }

	// Display the member cards in rows
	return (
		<div id="members" className="my-5">
			<Container>
				<h2 className="text-start">Members</h2>
				comming soon
				{/* <Row>
					
					{membersList()}
				</Row> */}
			</Container>
		</div>
	);
};

export default Members;
