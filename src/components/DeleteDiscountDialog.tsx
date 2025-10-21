import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../style/DeleteDiscountDialog.css";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteDiscountDialog = ({ open, onClose, onConfirm }: Props) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="dialog-title">
        <Typography variant="h6">Delete discount</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="dialog-close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography color="text.secondary">
          Are you sure you want to delete this discount?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Delete discount
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDiscountDialog;
