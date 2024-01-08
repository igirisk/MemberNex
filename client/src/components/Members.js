import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

function Members() {
	return (
		<div id="members" className="my-5">
			<Container>
				<h2 className="text-start">Members</h2>
				<Row>
					<Col>
						<Card style={{ width: "11rem" }}>
							<Card.Img variant="top" src="holder.js/100px180" />
							<Card.Body>
								<Card.Title>Name</Card.Title>
								<Card.Text className="text-muted">role</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card style={{ width: "11rem" }}>
							<Card.Img variant="top" src="holder.js/100px180" />
							<Card.Body>
								<Card.Title>Name</Card.Title>
								<Card.Text className="text-muted">role</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card style={{ width: "11rem" }}>
							<Card.Img variant="top" src="holder.js/100px180" />
							<Card.Body>
								<Card.Title>Name</Card.Title>
								<Card.Text className="text-muted">role</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card style={{ width: "11rem" }}>
							<Card.Img variant="top" src="holder.js/100px180" />
							<Card.Body>
								<Card.Title>Name</Card.Title>
								<Card.Text className="text-muted">role</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card style={{ width: "11rem" }}>
							<Card.Img variant="top" src="holder.js/100px180" />
							<Card.Body>
								<Card.Title>Name</Card.Title>
								<Card.Text className="text-muted">role</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card style={{ width: "11rem" }}>
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
}

export default Members;
