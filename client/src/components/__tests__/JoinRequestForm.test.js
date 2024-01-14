// JoinRequestForm.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import JoinRequestForm from "client/src/components/JoinRequestForm.js"; // Adjust the path accordingly

// Mock the fetch function
global.fetch = jest.fn(() =>
	Promise.resolve({
		ok: true,
		json: () => Promise.resolve({}),
	})
);

describe("JoinRequestForm", () => {
	test("renders form and submits it successfully", async () => {
		render(<JoinRequestForm />);

		// Simulate user input
		fireEvent.change(screen.getByLabelText(/first name/i), {
			target: { value: "John" },
		});
		fireEvent.change(screen.getByLabelText(/last name/i), {
			target: { value: "Doe" },
		});
		// Simulate other form inputs...

		// Submit the form
		fireEvent.click(screen.getByText(/send request/i));

		// Wait for the asynchronous function to complete
		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith(
				"http://localhost:3050/joinRequest",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: expect.any(String),
				}
			);
		});

		// Ensure success notification is displayed
		expect(
			screen.getByText(/join request sent successfully/i)
		).toBeInTheDocument();
	});

	// Add more tests for form validation, error scenarios, etc.
});
