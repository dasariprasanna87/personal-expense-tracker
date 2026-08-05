import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Toast from "./Tost";

describe("Toast Notification Component Unit Tests", () => {
  test("Step 1 (Arrange & Assert): Should display the correct alert text label on screen", () => {
    // 🛠️ ARRANGE: Put our Toast component on the virtual testing screen
    render(<Toast message="EXPENSE ADDED!" onClose={() => {}} />);

    // 🔍 ACT: Search the virtual screen for our text
    const textElement = screen.getByText(/EXPENSE ADDED!/i);

    // 📊 ASSERT: Verify it is physically present in the DOM
    expect(textElement).toBeInTheDocument();
  });

  test("Step 2 (Mocking Actions): Should execute the onClose function when the ✕ button is clicked", async () => {
    // 🛠️ ARRANGE: Create a fake mock function to spy on the button click
    const fakeCloseFunction = vi.fn();
    render(<Toast message="SUCCESS" onClose={fakeCloseFunction} />);

    // 🔍 ACT: Locate the '✕' close button and simulate a real mouse click
    const closeButton = screen.getByRole("button", { name: /✕/i });
    await userEvent.click(closeButton); // Automated click simulation

    // 📊 ASSERT: Verify that our mock tracker caught the click and ran exactly 1 time
    expect(fakeCloseFunction).toHaveBeenCalledTimes(1);
  });
});
