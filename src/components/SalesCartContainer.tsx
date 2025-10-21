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

// domain types + pricing math
import type { Discount } from "../types/discount";
import { computeMonthly, computeOneTime } from "../utils/pricing";

// dialogs (type-only imports avoid runtime export errors)
import AddDiscountDialog from "./AddDiscountDialog";
import type { AddDiscountPayload } from "./AddDiscountDialog";
import EditDiscountDialog from "./EditDiscountDialog";
import type { EditDiscountPayload } from "./EditDiscountDialog";
import DeleteDiscountDialog from "./DeleteDiscountDialog";
import { useMemo, useState } from "react";

/** base prices for the product already in the side cart (in paise/cents) */
const BASE_ONE_TIME = 10000000; // ₹100,000.00
const BASE_MONTHLY = 1000000; // ₹10,000.00 / month

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});
const money = (cents: number) => inr.format(cents / 100);

const SalesCartContainer = () => {
  /** discounts list */
  const [discounts, setDiscounts] = useState<Discount[]>([
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
  const handleAdd = (p: AddDiscountPayload) => {
    const newItem: Discount = {
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
  const [editing, setEditing] = useState<Discount | null>(null);
  const openEdit = (id: string) => {
    const d = discounts.find((x) => x.id === id);
    if (d) setEditing(d);
  };
  const closeEdit = () => setEditing(null);
  const handleSaveEdit = (p: EditDiscountPayload) => {
    if (!editing) return;
    setDiscounts((ds) =>
      ds.map((x) =>
        x.id === editing.id
          ? {
              ...x,
              name: p.name,
              scope: p.scope,
              kind: p.kind,
              value: p.value,
              durationMonths: p.scope === "monthly" ? p.duration : undefined,
              description: p.description,
            }
          : x
      )
    );
    setEditing(null);
  };

  /** delete dialog state */
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const openDelete = (id: string) => setDeleteId(id);
  const closeDelete = () => setDeleteId(null);
  const confirmDelete = () => {
    if (!deleteId) return;
    setDiscounts((ds) => ds.filter((d) => d.id !== deleteId));
    setDeleteId(null);
  };

  /** row actions */
  const toggleEnable = (id: string, enabled: boolean) => {
    setDiscounts((d) => d.map((x) => (x.id === id ? { ...x, enabled } : x)));
  };

  /** derived pricing for side cart */
  const oneTimeTotals = useMemo(
    () => computeOneTime(BASE_ONE_TIME, discounts),
    [discounts]
  );

  const monthlyTotals = useMemo(
    () => computeMonthly(BASE_MONTHLY, discounts, 12),
    [discounts]
  );

  /** helpers for table labeling */
  const detailLabel = (d: Discount) => {
    const valueText =
      d.kind === "amount" ? `- ${money(d.value)}` : `- ${d.value}%`;
    const scopeText =
      d.scope === "one-time"
        ? "one time"
        : d.durationMonths
        ? `monthly (first ${d.durationMonths} months)`
        : "monthly";
    return `${valueText} ${scopeText}`;
  };

  return (
    <div className="salescart-container">
      <Container maxWidth={false} disableGutters className="page-container">
        {/* Responsive two-column grid via CSS (no MUI Grid typings) */}
        <Box className="grid">
          {/* LEFT: Discounts list */}
          <Box className="grid-left">
            <Paper className="section-paper" elevation={0}>
              {/* LEFT header */}
              <div className="section-header bar">
                <Typography>Discounts</Typography>
                <Button variant="text" color="inherit" onClick={openAdd}>
                  ADD MANUAL DISCOUNT
                </Button>
              </div>

              <table className="discounts-table">
                <thead>
                  <tr>
                    <th>Discount name</th>
                    <th>Details</th>
                    <th className="col-enable">Enable</th>
                  </tr>
                </thead>
                <tbody>
                  {discounts.map((d) => (
                    <tr key={d.id} className="discounts-row">
                      <td>
                        <Typography>{d.name}</Typography>
                      </td>
                      <td>
                        <Typography color="text.secondary">
                          {detailLabel(d)}
                        </Typography>
                      </td>
                      <td className="col-enable">
                        <div className="discount-actions">
                          <Switch
                            checked={d.enabled}
                            onChange={(_, v) => toggleEnable(d.id, v)}
                            inputProps={{ "aria-label": "toggle discount" }}
                          />
                          <IconButton
                            size="small"
                            aria-label="edit"
                            onClick={() => openEdit(d.id)}
                          >
                            <EditOutlined fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            aria-label="delete"
                            onClick={() => openDelete(d.id)}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Divider />
              <div className="section-footer">
                <Button variant="contained">Next</Button>
              </div>
            </Paper>
          </Box>

          {/* RIGHT: Side cart / Overview */}
          <Box className="grid-right">
            <Paper className="section-paper" elevation={0}>
              {/* RIGHT header */}
              <div className="section-header bar">
                <Typography>Overview</Typography>
              </div>

              <div className="overview-body">
                {/* Monthly block with split */}
                <div>
                  <Typography color="text.secondary">Monthly price</Typography>
                  {monthlyTotals.firstMonths > 0 ? (
                    <>
                      <Typography>
                        First {monthlyTotals.firstMonths} months:{" "}
                        <b>{money(monthlyTotals.firstPrice)}</b>/mo
                      </Typography>
                      <Typography>
                        After that ({monthlyTotals.restMonths} months):{" "}
                        <b>{money(monthlyTotals.restPrice)}</b>/mo
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="h6">
                      {money(monthlyTotals.restPrice)}/mo
                    </Typography>
                  )}
                </div>

                {/* List active monthly discounts */}
                {discounts
                  .filter((d) => d.enabled && d.scope === "monthly")
                  .map((d) => (
                    <div key={d.id} className="overview-row">
                      <Typography color="text.secondary">
                        {d.name}
                        {d.durationMonths
                          ? ` (first ${d.durationMonths} months)`
                          : ""}
                      </Typography>
                      <Typography color="text.secondary">
                        {d.kind === "amount"
                          ? `- ${money(d.value)}`
                          : `- ${d.value}%`}
                        /mo
                      </Typography>
                    </div>
                  ))}

                <Divider />

                {/* One-time block with line items */}
                <div className="overview-row">
                  <Typography>Subtotal onetime costs</Typography>
                  <Typography>{money(oneTimeTotals.base)}</Typography>
                </div>

                {oneTimeTotals.active.map((d, i) => (
                  <div key={`${d.kind}-${i}`} className="overview-row">
                    <Typography color="text.secondary">
                      {d.kind === "amount"
                        ? "Amount discount"
                        : "Percent discount"}
                    </Typography>
                    <Typography color="text.secondary">
                      {d.kind === "amount"
                        ? `- ${money(d.value)}`
                        : `- ${d.value}%`}
                    </Typography>
                  </div>
                ))}

                <div className="overview-row">
                  <Typography fontWeight={600}>Onetime costs</Typography>
                  <Typography fontWeight={600}>
                    {money(oneTimeTotals.total)}
                  </Typography>
                </div>
              </div>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* Dialogs */}
      <AddDiscountDialog
        open={isAddOpen}
        onClose={closeAdd}
        onAdd={handleAdd}
      />

      <EditDiscountDialog
        open={!!editing}
        initial={
          editing
            ? {
                id: editing.id,
                name: editing.name,
                scope: editing.scope,
                kind: editing.kind,
                value: editing.value,
                duration: editing.durationMonths,
                description: editing.description,
              }
            : null
        }
        onClose={closeEdit}
        onSave={handleSaveEdit}
      />

      <DeleteDiscountDialog
        open={!!deleteId}
        onClose={closeDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default SalesCartContainer;
