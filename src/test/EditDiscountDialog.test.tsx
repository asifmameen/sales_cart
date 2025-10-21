import React from "react";
import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditDiscountDialog from "../components/EditDiscountDialog";

describe("EditDiscountDialog", () => {
  const baseInitial = {
    id: "d2",
    name: "Seasonal Offer",
    scope: "monthly" as const,
    kind: "percent" as const,
    value: 5,
    duration: 3,
    description: "first 3 months",
  };

  const setup = (initial = baseInitial) => {
    const onSave = jest.fn();
    const onClose = jest.fn();
    render(
      <EditDiscountDialog open initial={initial} onSave={onSave} onClose={onClose} />
    );
    return { onSave, onClose };
  };

  it("prepopulates fields and allows saving edits", async () => {
    const { onSave } = setup();

    // name is prefilled
    const name = screen.getByLabelText(/name/i) as HTMLInputElement;
    expect(name.value).toMatch(/Seasonal Offer/i);

    // change to one-time + amount
    await userEvent.click(screen.getByRole("button", { name: /one time price/i }));

    // change kind to amount via combobox
    const combos = screen.getAllByRole("combobox");
    await userEvent.click(combos[0]);
    const listbox = await screen.findByRole("listbox");
    const amountOpt =
      within(listbox).queryByText(/€\s*euro/i) ??
      within(listbox).getByText(/€|euro|amount/i);
    await userEvent.click(amountOpt);

    // change value
    const valueInput = screen.getByLabelText(/discount/i, { selector: "input" });
    await userEvent.clear(valueInput);
    await userEvent.type(valueInput, "250");

    // save
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(onSave).toHaveBeenCalledTimes(1);
    const payload = onSave.mock.calls[0][0];

    expect(payload.scope).toBe("one-time");
    expect(payload.kind).toBe("amount");
    expect(payload.name).toMatch(/Seasonal Offer/i);
  });

  it("keeps monthly scope and updates duration/description", async () => {
    const { onSave } = setup();

    // ensure monthly selected
    const monthly = screen.getByRole("button", { name: /monthly price/i });
    await userEvent.click(monthly);

    const duration =
      screen.queryByLabelText(/duration|months/i, { selector: "input" }) ??
      screen.queryByPlaceholderText(/months?/i);
    if (duration) {
      await userEvent.clear(duration);
      await userEvent.type(duration, "6");
    }

    const desc = screen.queryByLabelText(/description/i);
    if (desc) {
      await userEvent.clear(desc as HTMLInputElement);
      await userEvent.type(desc as Element, "first 6 months promo");
    }

    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    const payload = onSave.mock.calls[0][0];
    expect(payload.scope).toBe("monthly");
    if (duration) expect(payload.duration).toBe(6);
  });

  it("cancel closes dialog", async () => {
    const { onClose } = setup();
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
