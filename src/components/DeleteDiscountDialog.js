import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../style/DeleteDiscountDialog.css";
const DeleteDiscountDialog = ({ open, onClose, onConfirm }) => {
    return (_jsxs(Dialog, { open: open, onClose: onClose, maxWidth: "xs", fullWidth: true, children: [_jsxs(DialogTitle, { className: "dialog-title", children: [_jsx(Typography, { variant: "h6", children: "Delete discount" }), _jsx(IconButton, { "aria-label": "close", onClick: onClose, className: "dialog-close", children: _jsx(CloseIcon, {}) })] }), _jsx(DialogContent, { children: _jsx(Typography, { color: "text.secondary", children: "Are you sure you want to delete this discount?" }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, variant: "text", children: "Cancel" }), _jsx(Button, { onClick: onConfirm, variant: "contained", color: "error", children: "Delete discount" })] })] }));
};
export default DeleteDiscountDialog;
