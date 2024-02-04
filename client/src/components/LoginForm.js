import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const LoginForm = () => {
	const navigate = useNavigate();

	const [form, setForm] = useState({
		admin_number: "",
		password: "",
		otp: "",
	});

	function updateForm(value) {
		setForm((prev) => ({ ...prev, ...value }));
	}

	async function login(e) {
		e.preventDefault();
		const formElement = e.currentTarget;

		if (formElement.checkValidity()) {
			const loginInfo = { ...form };

			try {
				const response = await fetch("http://localhost:3050/account/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(loginInfo),
				});

				if (response.ok) {
					// reset form
					setForm({
						admin_number: "".trim(),
						password: "",
						otp: "",
					});

					const res = await response.json();
					sessionStorage.setItem("token", res.data.token);
					sessionStorage.setItem("loginId", res.data.loginId);

					// Show success notification
					toast.success(`Login successfully`, {
						position: toast.POSITION.TOP_RIGHT,
					});

					// Redirect to a different URL upon successful login
					navigate("/home");
				} else {
					const res = await response.json();

					// show unsuccessful notification
					toast.error(`${res.error}`, {
						position: toast.POSITION.TOP_RIGHT,
					});
					console.log(
						`Failed to login.
						${res.error}, details: ${res.details}`
					);
				}
			} catch (error) {
				toast.error(`Failed to login. Try again later.`, {
					position: toast.POSITION.TOP_RIGHT,
				});
				console.error("Error logging in:", error);
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

	const isValidAdminNumber = (admin_number) =>
		// 7 digit before a alphabet
		isValidInput(admin_number, (value) => /^\d{7}[A-Za-z]$/.test(value));
	// #endregion

	return (
		<div id="loginForm" className="my-5">
			<Container className="border border-secondary rounded p-5 w-50">
				<div
					id="logos"
					className="d-flex flex-row justify-content-center justify-content-between"
				>
					<div id="logo" className="d-flex align-items-center">
						<img src="./imgs/logo.png" width="70%" alt="app logo" />
					</div>
					<img src="./imgs/iitscXtp.png" width="40%" alt="iitsc and tp" />
				</div>
				<h2>Login</h2>
				<p className="muted">
					Login to MemberNex is for IITSC management only.
				</p>
				<Form noValidate onSubmit={login}>
					<Row className="mb-3">
						<Form.Group as={Col} md="12" controlId="admin_number">
							<Form.Label>Admin number:</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter admin number"
								required
								isInvalid={!isValidAdminNumber(form.admin_number)}
								isValid={isValidAdminNumber(form.admin_number)}
								value={form.admin_number}
								onChange={(e) => updateForm({ admin_number: e.target.value })}
							/>
							<Form.Control.Feedback type="invalid">
								Please provide a valid Admin number.
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
					</Row>
					<Row className="mb-3">
						<Form.Group as={Col} md="12" controlId="adminNumber">
							<Form.Label>Password:</Form.Label>
							<Form.Control
								type="password"
								placeholder="Enter password"
								required
								value={form.password}
								onChange={(e) => updateForm({ password: e.target.value })}
							/>
						</Form.Group>
					</Row>
					<Row className="mb-3">
						<Form.Group as={Col} md="12" controlId="2faVerification">
							<Form.Label>2 step Verification:</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter code"
								required
								value={form.otp}
								onChange={(e) => updateForm({ otp: e.target.value })}
							/>
						</Form.Group>
					</Row>
					<Row className="px-2 pb-3">
						<Button type="submit" className="btn-block">
							Login
						</Button>
					</Row>
					<Row className="text-center">
						<p>
							Want to join IITSC? Click{" "}
							<Link to="/">
								<b>
									<u>here</u>
								</b>
							</Link>
						</p>
					</Row>
				</Form>
			</Container>
			<ToastContainer />
		</div>
	);
};

export default LoginForm;
