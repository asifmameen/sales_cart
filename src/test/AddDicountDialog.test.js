import { jsx as _jsx } from "react/jsx-runtime";
import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddDiscountDialog from "../components/AddDiscountDialog";
describe("AddDiscountDialog", () => {
    const setup = () => {
        const onAdd = jest.fn();
        const onClose = jest.fn();
        render(_jsx(AddDiscountDialog, { open: true, onAdd: onAdd, onClose: onClose }));
        return { onAdd, onClose };
    };
    it("renders and allows switching scope pills", async () => {
        setup();
        // two scope pills exist
        const oneTime = screen.getByRole("button", { name: /one time price/i });
        const monthly = screen.getByRole("button", { name: /monthly price/i });
        expect(oneTime).toBeInTheDocument();
        expect(monthly).toBeInTheDocument();
        // switch to one-time and back to monthly
        await userEvent.click(oneTime);
        await userEvent.click(monthly);
    });
    it("adds a percentage monthly discount with duration + description", async () => {
        const { onAdd } = setup();
        // scope: Monthly (already selected in your dialog defaults; if not, click)
        const monthly = screen.getByRole("button", { name: /monthly price/i });
        if (monthly)
            await userEvent.click(monthly);
        // choose % in the kind dropdown (first combobox)
        const combos = screen.getAllByRole("combobox");
        if (combos.length) {
            await userEvent.click(combos[0]);
            const listbox = await screen.findByRole("listbox");
            // pick either "% Percentage" or "%" option label depending on your menu text
            const pct = within(listbox).queryByText(/%(\s*percentage)?/i) ??
                within(listbox).getByText(/%/);
            await userEvent.click(pct);
        }
        // value
        const valueInput = screen.getByLabelText(/discount/i, { selector: "input" });
        await userEvent.clear(valueInput);
        await userEvent.type(valueInput, "5");
        // duration (months) for monthly
        const duration = screen.queryByLabelText(/duration|months/i, { selector: "input" }) ??
            screen.queryByPlaceholderText(/months?/i);
        if (duration) {
            await userEvent.clear(duration);
            await userEvent.type(duration, "3");
        }
        // description (optional)
        const desc = screen.queryByLabelText(/description/i);
        if (desc) {
            await userEvent.type(desc, "Seasonal 5% for first 3 months");
        }
        // Add
        await userEvent.click(screen.getByRole("button", { name: /^add$/i }));
        expect(onAdd).toHaveBeenCalledTimes(1);
        // payload shape sanity (kind/ scope/ value/ duration)
        const payload = onAdd.mock.calls[0][0];
        expect(payload.kind).toMatch(/percent/i);
        expect(payload.scope).toMatch(/monthly/i);
        expect(payload.value).toBe(5);
        if (duration)
            expect(payload.duration).toBe(3);
    });
    it("adds a one-time amount discount (€)", async () => {
        const { onAdd } = setup();
        // switch to one time
        await userEvent.click(screen.getByRole("button", { name: /one time price/i }));
        // select Euro/Amount in combobox
        const combos = screen.getAllByRole("combobox");
        if (combos.length) {
            await userEvent.click(combos[0]);
            const listbox = await screen.findByRole("listbox");
            const eur = within(listbox).queryByText(/€\s*euro/i) ??
                within(listbox).getByText(/€|euro|amount/i);
            await userEvent.click(eur);
        }
        // ₹ value (in paise in your code)
        const valueInput = screen.getByLabelText(/discount/i, { selector: "input" });
        await userEvent.clear(valueInput);
        await userEvent.type(valueInput, "250");
        await userEvent.click(screen.getByRole("button", { name: /^add$/i }));
        expect(onAdd).toHaveBeenCalledTimes(1);
        const payload = onAdd.mock.calls[0][0];
        expect(payload.kind).toMatch(/amount/i);
        expect(payload.scope).toMatch(/one/i);
    });
    it("cancel closes dialog", async () => {
        const { onClose } = setup();
        const cancel = screen.getByRole("button", { name: /cancel/i });
        await userEvent.click(cancel);
        expect(onClose).toHaveBeenCalled();
    });
});
