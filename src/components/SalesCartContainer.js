import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import "../style/SalesCartContainer.css";
import { computeMonthly, computeOneTime } from "../utils/pricing";
// dialogs (type-only imports avoid runtime export errors)
import AddDiscountDialog from "./AddDiscountDialog";
import EditDiscountDialog from "./EditDiscountDialog";
import DeleteDiscountDialog from "./DeleteDiscountDialog";
import { useMemo, useState } from "react";
/** base prices for the product already in the side cart (in paise/cents) */
const BASE_ONE_TIME = 10000000; // ₹100,000.00
const BASE_MONTHLY = 1000000; // ₹10,000.00 / month
const inr = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
});
const money = (cents) => inr.format(cents / 100);
const SalesCartContainer = () => {
    /** discounts list */
    const [discounts, setDiscounts] = useState([
        {
            id: "d1",
            name: "Intro Discount",
            scope: "one-time",
            kind: "amount",
            value: 25000, // ₹250.00 off one-time
            enabled: true,
        },
        {
            id: "d2",
            name: "Seasonal Offer",
            scope: "monthly",
            kind: "percent",
            value: 5, // 5% off monthly
            enabled: true,
            durationMonths: 3, // first 3 months
        },
    ]);
    /** add dialog state */
    const [isAddOpen, setAddOpen] = useState(false);
    const openAdd = () => setAddOpen(true);
    const closeAdd = () => setAddOpen(false);
    const handleAdd = (p) => {
        const newItem = {
            id: crypto.randomUUID(),
            name: p.name,
            scope: p.scope,
            kind: p.kind,
            value: p.value, // already cents for amount, 0–100 for percent
            enabled: true,
            durationMonths: p.scope === "monthly" ? p.duration : undefined,
            description: p.description,
        };
        setDiscounts((d) => [...d, newItem]);
        setAddOpen(false);
    };
    /** edit dialog state */
    const [editing, setEditing] = useState(null);
    const openEdit = (id) => {
        const d = discounts.find((x) => x.id === id);
        if (d)
            setEditing(d);
    };
    const closeEdit = () => setEditing(null);
    const handleSaveEdit = (p) => {
        if (!editing)
            return;
        setDiscounts((ds) => ds.map((x) => x.id === editing.id
            ? {
                ...x,
                name: p.name,
                scope: p.scope,
                kind: p.kind,
                value: p.value,
                durationMonths: p.scope === "monthly" ? p.duration : undefined,
                description: p.description,
            }
            : x));
        setEditing(null);
    };
    /** delete dialog state */
    const [deleteId, setDeleteId] = useState(null);
    const openDelete = (id) => setDeleteId(id);
    const closeDelete = () => setDeleteId(null);
    const confirmDelete = () => {
        if (!deleteId)
            return;
        setDiscounts((ds) => ds.filter((d) => d.id !== deleteId));
        setDeleteId(null);
    };
    /** row actions */
    const toggleEnable = (id, enabled) => {
        setDiscounts((d) => d.map((x) => (x.id === id ? { ...x, enabled } : x)));
    };
    /** derived pricing for side cart */
    const oneTimeTotals = useMemo(() => computeOneTime(BASE_ONE_TIME, discounts), [discounts]);
    const monthlyTotals = useMemo(() => computeMonthly(BASE_MONTHLY, discounts, 12), [discounts]);
    /** helpers for table labeling */
    const detailLabel = (d) => {
        const valueText = d.kind === "amount" ? `- ${money(d.value)}` : `- ${d.value}%`;
        const scopeText = d.scope === "one-time"
            ? "one time"
            : d.durationMonths
                ? `monthly (first ${d.durationMonths} months)`
                : "monthly";
        return `${valueText} ${scopeText}`;
    };
    return (_jsxs("div", { className: "salescart-container", children: [_jsx(Container, { maxWidth: false, disableGutters: true, className: "page-container", children: _jsxs(Box, { className: "grid", children: [_jsx(Box, { className: "grid-left", children: _jsxs(Paper, { className: "section-paper", elevation: 0, children: [_jsxs("div", { className: "section-header bar", children: [_jsx(Typography, { children: "Discounts" }), _jsx(Button, { variant: "text", color: "inherit", onClick: openAdd, children: "ADD MANUAL DISCOUNT" })] }), _jsxs("table", { className: "discounts-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Discount name" }), _jsx("th", { children: "Details" }), _jsx("th", { className: "col-enable", children: "Enable" })] }) }), _jsx("tbody", { children: discounts.map((d) => (_jsxs("tr", { className: "discounts-row", children: [_jsx("td", { children: _jsx(Typography, { children: d.name }) }), _jsx("td", { children: _jsx(Typography, { color: "text.secondary", children: detailLabel(d) }) }), _jsx("td", { className: "col-enable", children: _jsxs("div", { className: "discount-actions", children: [_jsx(Switch, { checked: d.enabled, onChange: (_, v) => toggleEnable(d.id, v), inputProps: { "aria-label": "toggle discount" } }), _jsx(IconButton, { size: "small", "aria-label": "edit", onClick: () => openEdit(d.id), children: _jsx(EditOutlined, { fontSize: "small" }) }), _jsx(IconButton, { size: "small", "aria-label": "delete", onClick: () => openDelete(d.id), children: _jsx(DeleteOutline, { fontSize: "small" }) })] }) })] }, d.id))) })] }), _jsx(Divider, {}), _jsx("div", { className: "section-footer", children: _jsx(Button, { variant: "contained", children: "Next" }) })] }) }), _jsx(Box, { className: "grid-right", children: _jsxs(Paper, { className: "section-paper", elevation: 0, children: [_jsx("div", { className: "section-header bar", children: _jsx(Typography, { children: "Overview" }) }), _jsxs("div", { className: "overview-body", children: [_jsxs("div", { children: [_jsx(Typography, { color: "text.secondary", children: "Monthly price" }), monthlyTotals.firstMonths > 0 ? (_jsxs(_Fragment, { children: [_jsxs(Typography, { children: ["First ", monthlyTotals.firstMonths, " months:", " ", _jsx("b", { children: money(monthlyTotals.firstPrice) }), "/mo"] }), _jsxs(Typography, { children: ["After that (", monthlyTotals.restMonths, " months):", " ", _jsx("b", { children: money(monthlyTotals.restPrice) }), "/mo"] })] })) : (_jsxs(Typography, { variant: "h6", children: [money(monthlyTotals.restPrice), "/mo"] }))] }), discounts
                                                .filter((d) => d.enabled && d.scope === "monthly")
                                                .map((d) => (_jsxs("div", { className: "overview-row", children: [_jsxs(Typography, { color: "text.secondary", children: [d.name, d.durationMonths
                                                                ? ` (first ${d.durationMonths} months)`
                                                                : ""] }), _jsxs(Typography, { color: "text.secondary", children: [d.kind === "amount"
                                                                ? `- ${money(d.value)}`
                                                                : `- ${d.value}%`, "/mo"] })] }, d.id))), _jsx(Divider, {}), _jsxs("div", { className: "overview-row", children: [_jsx(Typography, { children: "Subtotal onetime costs" }), _jsx(Typography, { children: money(oneTimeTotals.base) })] }), oneTimeTotals.active.map((d, i) => (_jsxs("div", { className: "overview-row", children: [_jsx(Typography, { color: "text.secondary", children: d.kind === "amount"
                                                            ? "Amount discount"
                                                            : "Percent discount" }), _jsx(Typography, { color: "text.secondary", children: d.kind === "amount"
                                                            ? `- ${money(d.value)}`
                                                            : `- ${d.value}%` })] }, `${d.kind}-${i}`))), _jsxs("div", { className: "overview-row", children: [_jsx(Typography, { fontWeight: 600, children: "Onetime costs" }), _jsx(Typography, { fontWeight: 600, children: money(oneTimeTotals.total) })] })] })] }) })] }) }), _jsx(AddDiscountDialog, { open: isAddOpen, onClose: closeAdd, onAdd: handleAdd }), _jsx(EditDiscountDialog, { open: !!editing, initial: editing
                    ? {
                        id: editing.id,
                        name: editing.name,
                        scope: editing.scope,
                        kind: editing.kind,
                        value: editing.value,
                        duration: editing.durationMonths,
                        description: editing.description,
                    }
                    : null, onClose: closeEdit, onSave: handleSaveEdit }), _jsx(DeleteDiscountDialog, { open: !!deleteId, onClose: closeDelete, onConfirm: confirmDelete })] }));
};
export default SalesCartContainer;
