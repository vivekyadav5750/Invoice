"use client";
import React, { useState } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

interface Invoice {
  id: number;
  qty: number;
  price: number;
  discountPercent: number;
  discount: number;
  taxPercent: number;
  tax: number;
  total: number;
}

export default function InvoiceApp() {
  const [form, setForm] = useState({
    qty: 0,
    price: 0,
    discountPercent: 0,
    discount: 0,
    taxPercent: 0,
    tax: 0,
    total: 0
  });

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [editId, setEditId] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = value === "" ? 0 : Number(value);

    const newForm = { ...form, [name]: newValue };

    const subtotal = newForm.qty * newForm.price;

    if (name === "discount") {
      newForm.discountPercent =
        subtotal > 0 ? (newForm.discount / subtotal) * 100 : 0;
    } else {
      newForm.discount = (subtotal * newForm.discountPercent) / 100;
    }

    const afterDiscount = subtotal - newForm.discount;
    if (name === "tax") {
      newForm.taxPercent =
        afterDiscount > 0 ? (newForm.tax / afterDiscount) * 100 : 0;
    } else {
      newForm.tax = (afterDiscount * newForm.taxPercent) / 100;
    }

    newForm.total = afterDiscount + newForm.tax;

    setForm(newForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editId !== null) {
      // Update existing invoice
      setInvoices(
        invoices.map((inv) =>
          inv.id === editId ? { ...form, id: editId } : inv
        )
      );
      setEditId(null);
    } else {
      // Add new invoice
      setInvoices([...invoices, { ...form, id: Date.now() }]);
    }

    // Reset form
    setForm({
      qty: 0,
      price: 0,
      discountPercent: 0,
      discount: 0,
      taxPercent: 0,
      tax: 0,
      total: 0
    });
  };

  const startEditing = (invoice: Invoice) => {
    setForm(invoice);
    setEditId(invoice.id);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{editId !== null ? "Edit Invoice" : "New Invoice"}</h2>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Quantity"
          name="qty"
          value={form.qty}
          onChange={handleInputChange}
          type="number"
          style={{ margin: 8 }}
        />
        <TextField
          label="Price"
          name="price"
          value={form.price}
          onChange={handleInputChange}
          type="number"
          style={{ margin: 8 }}
        />
        <TextField
          label="Discount %"
          name="discountPercent"
          value={form.discountPercent}
          onChange={handleInputChange}
          type="number"
          style={{ margin: 8 }}
        />
        <TextField
          label="Discount Amount"
          name="discount"
          value={form.discount}
          onChange={handleInputChange}
          type="number"
          style={{ margin: 8 }}
        />
        <TextField
          label="Tax %"
          name="taxPercent"
          value={form.taxPercent}
          onChange={handleInputChange}
          type="number"
          style={{ margin: 8 }}
        />
        <TextField
          label="Tax Amount"
          name="tax"
          value={form.tax}
          onChange={handleInputChange}
          type="number"
          style={{ margin: 8 }}
        />
        <TextField
          label="Total"
          value={form.total.toFixed(2)}
          type="number"
          style={{ margin: 8 }}
          disabled
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ margin: 8 }}
        >
          {editId !== null ? "Update" : "Save"}
        </Button>
      </form>

      <Paper style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Qty</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Disc %</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Tax %</TableCell>
              <TableCell>Tax</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.qty}</TableCell>
                <TableCell>{invoice.price}</TableCell>
                <TableCell>{invoice.discountPercent}</TableCell>
                <TableCell>{invoice.discount.toFixed(2)}</TableCell>
                <TableCell>{invoice.taxPercent}</TableCell>
                <TableCell>{invoice.tax.toFixed(2)}</TableCell>
                <TableCell>{invoice.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Button onClick={() => startEditing(invoice)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
