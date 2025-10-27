import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  Typography,
} from "@mui/material";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import type { SelectChangeEvent } from "@mui/material/Select";
import "../style/AddDiscountDialog.css";

export type AddDiscountPayload = {
  name: string;
  scope: "one-time" | "monthly";
  kind: "percent" | "amount";
  value: number;
  duration?: number;
  description?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (payload: AddDiscountPayload) => void;
};

export default function AddDiscountDialog({ open, onClose, onAdd }: Props) {
  const [scope, setScope] = useState<"one-time" | "monthly">("monthly");
  const [kind, setKind] = useState<"percent" | "amount">("percent");
  const [name, setName] = useState("Manual Discount");
  const [valueInput, setValueInput] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
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

  const handleKindChange = (e: SelectChangeEvent) => {
    const v = e.target.value as "percent" | "amount";
    setKind(v);
    setValueInput("");
  };

  const handleAdd = () => {
    const parsed = Number(valueInput);
    if (Number.isNaN(parsed) || parsed <= 0) return;

    const payload: AddDiscountPayload = {
      name: name.trim() || "Manual Discount",
      scope,
      kind,
      value:
        kind === "percent"
          ? Math.min(100, Math.round(parsed))
          : Math.round(parsed * 100), // euros -> cents
      description: description.trim() || undefined,
      duration:
        scope === "monthly" && duration
          ? Math.max(1, Math.round(Number(duration)))
          : undefined,
    };
    onAdd(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="adddisc-title">Add manual discount</DialogTitle>

      <DialogContent className="adddisc-content">
        <Typography className="adddisc-label">
          For which price do you calculate the discount?
        </Typography>

        <ToggleButtonGroup
          exclusive
          value={scope}
          onChange={(_, val) => val && setScope(val)}
          className="adddisc-scope"
        >
          <ToggleButton value="one-time" className="pill">
            <span>One time price</span>
            {scope === "one-time" && (
              <CheckCircleOutline fontSize="small" className="pill-check" />
            )}
          </ToggleButton>

          <ToggleButton value="monthly" className="pill">
            <span>Monthly price</span>
            {scope === "monthly" && (
              <CheckCircleOutline fontSize="small" className="pill-check" />
            )}
          </ToggleButton>
        </ToggleButtonGroup>

        <div className="adddisc-row">
          <FormControl className="adddisc-type">
            <InputLabel id="disc-type-label">Type</InputLabel>
            <Select
              labelId="disc-type-label"
              label="Type"
              value={kind}
              onChange={handleKindChange}
            >
              <MenuItem value="percent">% Percentage</MenuItem>
              <MenuItem value="amount">€ Euro</MenuItem>
            </Select>
          </FormControl>

          <TextField
            className="adddisc-value"
            label={kind === "percent" ? "Discount (%)" : "Discount (€)"}
            type="number"
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
            inputProps={{ min: 0, step: "1" }}
          />
        </div>

        {scope === "monthly" && (
          <TextField
            label="Duration"
            placeholder="Number of months"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="adddisc-field"
            inputProps={{ min: 1, step: "1" }}
          />
        )}

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="adddisc-field"
        />

        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="adddisc-field"
        />
      </DialogContent>

      <DialogActions className="adddisc-actions">
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button onClick={handleAdd} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
