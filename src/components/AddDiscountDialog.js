import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/AddDiscountDialog.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, ToggleButton, ToggleButtonGroup, FormControl, InputLabel, Select, Typography, } from "@mui/material";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import "../style/AddDiscountDialog.css";
export default function AddDiscountDialog({ open, onClose, onAdd }) {
    const [scope, setScope] = useState("monthly");
    const [kind, setKind] = useState("percent");
    const [name, setName] = useState("Manual Discount");
    const [valueInput, setValueInput] = useState("");
    const [duration, setDuration] = useState("");
    const [description, setDescription] = useState("");
    useEffect(() => {
        if (!open) {
            setScope("monthly");
            setKind("percent");
            setName("Manual Discount");
            setValueInput("");
            setDuration("");
            setDescription("");
        }
    }, [open]);
    const handleKindChange = (e) => {
        const v = e.target.value;
        setKind(v);
        setValueInput(""); // reset to avoid unit confusion
    };
    const handleAdd = () => {
        const parsed = Number(valueInput);
        if (Number.isNaN(parsed) || parsed <= 0)
            return;
        const payload = {
            name: name.trim() || "Manual Discount",
            scope,
            kind,
            value: kind === "percent"
                ? Math.min(100, Math.round(parsed))
                : Math.round(parsed * 100), // euros -> cents
            description: description.trim() || undefined,
            duration: scope === "monthly" && duration
                ? Math.max(1, Math.round(Number(duration)))
                : undefined,
        };
        onAdd(payload);
    };
    return (_jsxs(Dialog, { open: open, onClose: onClose, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { className: "adddisc-title", children: "Add manual discount" }), _jsxs(DialogContent, { className: "adddisc-content", children: [_jsx(Typography, { className: "adddisc-label", children: "For which price do you calculate the discount?" }), _jsxs(ToggleButtonGroup, { exclusive: true, value: scope, onChange: (_, val) => val && setScope(val), className: "adddisc-scope", children: [_jsxs(ToggleButton, { value: "one-time", className: "pill", children: [_jsx("span", { children: "One time price" }), scope === "one-time" && (_jsx(CheckCircleOutline, { fontSize: "small", className: "pill-check" }))] }), _jsxs(ToggleButton, { value: "monthly", className: "pill", children: [_jsx("span", { children: "Monthly price" }), scope === "monthly" && (_jsx(CheckCircleOutline, { fontSize: "small", className: "pill-check" }))] })] }), _jsxs("div", { className: "adddisc-row", children: [_jsxs(FormControl, { className: "adddisc-type", children: [_jsx(InputLabel, { id: "disc-type-label", children: "Type" }), _jsxs(Select, { labelId: "disc-type-label", label: "Type", value: kind, onChange: handleKindChange, children: [_jsx(MenuItem, { value: "percent", children: "% Percentage" }), _jsx(MenuItem, { value: "amount", children: "\u20AC Euro" })] })] }), _jsx(TextField, { className: "adddisc-value", label: kind === "percent" ? "Discount (%)" : "Discount (€)", type: "number", value: valueInput, onChange: (e) => setValueInput(e.target.value), inputProps: { min: 0, step: "1" } })] }), scope === "monthly" && (_jsx(TextField, { label: "Duration", placeholder: "Number of months", type: "number", value: duration, onChange: (e) => setDuration(e.target.value), className: "adddisc-field", inputProps: { min: 1, step: "1" } })), _jsx(TextField, { label: "Description", value: description, onChange: (e) => setDescription(e.target.value), className: "adddisc-field" }), _jsx(TextField, { label: "Name", value: name, onChange: (e) => setName(e.target.value), className: "adddisc-field" })] }), _jsxs(DialogActions, { className: "adddisc-actions", children: [_jsx(Button, { onClick: onClose, variant: "text", children: "Cancel" }), _jsx(Button, { onClick: handleAdd, variant: "contained", children: "Add" })] })] }));
}
