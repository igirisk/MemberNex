import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { useState } from "react";

const Event = (props) => (
	<Col>
		<Card style={{ width: "18rem" }}>
			<Card.Img variant="top" src="holder.js/100px180" />
			<Card.Body>
				<Card.Title>{props.event.name}</Card.Title>
				<Card.Text className="text-muted">role</Card.Text>
			</Card.Body>
		</Card>
	</Col>
);

const Events = () => {
	const [events, setEvents] = useState([]);

	return (
		<div id="evnets" className="my-5">
			<Container>
				<h2 className="text-start">Upcoming Events</h2>
				<Row>
					<Col>
						<Card style={{ width: "18rem" }}>
							<Card.Img variant="top" src="holder.js/100px180" />
							<Card.Body>
								<Card.Title>Name</Card.Title>
								<Card.Text className="text-muted">role</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card style={{ width: "18rem" }}>
							<Card.Img variant="top" src="holder.js/100px180" />
							<Card.Body>
								<Card.Title>Name</Card.Title>
								<Card.Text className="text-muted">role</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card style={{ width: "18rem" }}>
							<Card.Img variant="top" src="holder.js/100px180" />
							<Card.Body>
								<Card.Title>Name</Card.Title>
								<Card.Text className="text-muted">role</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card style={{ width: "18rem" }}>
							<Card.Img variant="top" src="holder.js/100px180" />
							<Card.Body>
								<Card.Title>Name</Card.Title>
								<Card.Text className="text-muted">role</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Events;
