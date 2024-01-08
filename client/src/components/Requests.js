import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

const Requests = () => {
	return (
		<div id="requests" className="my-5">
			<Container>
				<h2 className="text-start">Join requests</h2>
				<Row>
					<Col>
						<Card style={{ width: "11rem" }}>
							<Card.Img variant="top" src="holder.js/100px180" />
							<Card.Body>
								<Card.Title>Name</Card.Title>
								<Stack gap={1}>
									<Button variant="success">Accept</Button>
									<Button variant="warning">Reject</Button>
								</Stack>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card style={{ width: "11rem" }}>
							<Card.Img variant="top" src="holder.js/100px180" />
							<Card.Body>
								<Card.Title>Name</Card.Title>
								<Stack gap={1}>
									<Button variant="success">Accept</Button>
									<Button variant="warning">Reject</Button>
								</Stack>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card style={{ width: "11rem" }}>
							<Card.Img variant="top" src="holder.js/100px180" />
							<Card.Body>
								<Card.Title>Name</Card.Title>
								<Stack gap={1}>
									<Button variant="success">Accept</Button>
									<Button variant="warning">Reject</Button>
								</Stack>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card style={{ width: "11rem" }}>
							<Card.Img variant="top" src="holder.js/100px180" />
							<Card.Body>
								<Card.Title>Name</Card.Title>
								<Stack gap={1}>
									<Button variant="success">Accept</Button>
									<Button variant="warning">Reject</Button>
								</Stack>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card style={{ width: "11rem" }}>
							<Card.Img variant="top" src="holder.js/100px180" />
							<Card.Body>
								<Card.Title>Name</Card.Title>
								<Stack gap={1}>
									<Button variant="success">Accept</Button>
									<Button variant="warning">Reject</Button>
								</Stack>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card style={{ width: "11rem" }}>
							<Card.Img variant="top" src="holder.js/100px180" />
							<Card.Body>
								<Card.Title>Name</Card.Title>
								<Stack gap={1}>
									<Button variant="success">Accept</Button>
									<Button variant="warning">Reject</Button>
								</Stack>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Requests;
