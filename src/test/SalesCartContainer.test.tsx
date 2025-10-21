import React from "react";
import "@testing-library/jest-dom";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SalesCartContainer from "../components/SalesCartContainer";

describe("SalesCartContainer", () => {
  it("can toggle a discount enable switch and update overview", async () => {
    render(<SalesCartContainer />);

    // MUI Switch has role="switch"
    const toggles = screen.getAllByRole("switch");
    expect(toggles.length).toBeGreaterThan(0);

    const toggle = toggles[0];
    expect(toggle).toBeChecked();

    await userEvent.click(toggle);
    expect(toggle).not.toBeChecked();
  });

  it("opens Add Discount dialog and adds a new discount", async () => {
    render(<SalesCartContainer />);

    await userEvent.click(
      screen.getByRole("button", { name: /add manual discount/i })
    );

    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "New Test Discount");

    // "Discount" input (works whether it's % or €)
    const valueInput = screen.getByLabelText(/discount/i, {
      selector: "input",
    });
    await userEvent.clear(valueInput);
    await userEvent.type(valueInput, "100");

    await userEvent.click(screen.getByRole("button", { name: /^add$/i }));

    // It appears at least once (table + possibly overview)
    const occurrences = await screen.findAllByText(/New Test Discount/i);
    expect(occurrences.length).toBeGreaterThanOrEqual(1);
  });

  it("opens Edit dialog and updates discount name", async () => {
    render(<SalesCartContainer />);

    const editBtns = screen.getAllByRole("button", { name: /edit/i });
    await userEvent.click(editBtns[0]);

    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Edited Discount");

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText(/Edited Discount/i)).toBeInTheDocument();
  });

  it("opens Delete dialog and removes a row", async () => {
    render(<SalesCartContainer />);

    // Count delete buttons as a proxy for number of rows
    const before = screen.getAllByRole("button", { name: /delete/i }).length;

    // Delete the first row
    const deleteBtns = screen.getAllByRole("button", { name: /delete/i });
    await userEvent.click(deleteBtns[0]);

    // Confirm delete in the dialog
    const confirmBtn = await screen.findByRole("button", {
      name: /delete discount/i,
    });
    await userEvent.click(confirmBtn);

    // Wait for the row to be gone – assert number of delete buttons decreased by 1
    await waitFor(() => {
      const after = screen.getAllByRole("button", { name: /delete/i }).length;
      expect(after).toBe(before - 1);
    });
  });
});
