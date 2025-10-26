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
import type { SelectChangeEvent } from "@mui/material/Select";
import "../style/AddDiscountDialog.css";
import { CheckCircleOutline } from "@mui/icons-material";

export type EditDiscountPayload = {
  name: string;
  scope: "one-time" | "monthly";
  kind: "percent" | "amount";
  value: number;
  duration?: number;
  description?: string;
};

export type EditDiscountInitial = {
  id: string;
  name: string;
  scope: "one-time" | "monthly";
  kind: "percent" | "amount";
  value: number;
  duration?: number;
  description?: string;
};

type Props = {
  open: boolean;
  initial: EditDiscountInitial | null;
  onClose: () => void;
  onSave: (payload: EditDiscountPayload) => void;
};

export default function EditDiscountDialog({
  open,
  initial,
  onClose,
  onSave,
}: Props) {
  const [scope, setScope] = useState<"one-time" | "monthly">("monthly");
  const [kind, setKind] = useState<"percent" | "amount">("percent");
  const [name, setName] = useState("Manual Discount");
  const [valueInput, setValueInput] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [description, setDescription] = useState("");

  // Populate dialog when opened with existing discount
  useEffect(() => {
    if (open && initial) {
      setScope(initial.scope);
      setKind(initial.kind);
      setName(initial.name);
      setValueInput(
        initial.kind === "percent"
          ? String(initial.value)
          : String(initial.value / 100)
      );
      setDuration(initial.duration ? String(initial.duration) : "");
      setDescription(initial.description ?? "");
    }
  }, [open, initial]);

  const handleKindChange = (e: SelectChangeEvent) => {
    const v = e.target.value as "percent" | "amount";
    const numeric = Number(valueInput) || 0;
    setKind(v);
    setValueInput(numeric ? String(numeric) : "");
  };

  const handleSave = () => {
    const parsed = Number(valueInput);
    if (Number.isNaN(parsed) || parsed <= 0) return;

    const payload: EditDiscountPayload = {
      name: name.trim() || "Manual Discount",
      scope,
      kind,
      value:
        kind === "percent"
          ? Math.min(100, Math.round(parsed))
          : Math.round(parsed * 100),
      description: description.trim() || undefined,
      duration:
        scope === "monthly" && duration
          ? Math.max(1, Math.round(Number(duration)))
          : undefined,
    };
    onSave(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="adddisc-title">Edit discount</DialogTitle>

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
            <InputLabel id="edit-disc-type-label">Type</InputLabel>
            <Select
              labelId="edit-disc-type-label"
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
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
