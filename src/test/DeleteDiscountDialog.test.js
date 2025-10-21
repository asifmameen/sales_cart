import { jsx as _jsx } from "react/jsx-runtime";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteDiscountDialog from "../components/DeleteDiscountDialog";
describe("DeleteDiscountDialog", () => {
    it("confirms delete", async () => {
        const onConfirm = jest.fn();
        const onClose = jest.fn();
        render(_jsx(DeleteDiscountDialog, { open: true, onConfirm: onConfirm, onClose: onClose }));
        await userEvent.click(screen.getByRole("button", { name: /delete discount/i }));
        expect(onConfirm).toHaveBeenCalled();
    });
    it("cancels delete", async () => {
        const onConfirm = jest.fn();
        const onClose = jest.fn();
        render(_jsx(DeleteDiscountDialog, { open: true, onConfirm: onConfirm, onClose: onClose }));
        await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
        expect(onClose).toHaveBeenCalled();
    });
});
