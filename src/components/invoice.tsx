"use client";
import React, { useState } from "react";
import { Button } from "@mui/material";

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
      setInvoices(
        invoices.map((inv) =>
          inv.id === editId ? { ...form, id: editId } : inv
        )
      );
      setEditId(null);
    } else {
      setInvoices([...invoices, { ...form, id: Date.now() }]);
    }
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">
          {editId !== null ? "Edit Invoice" : "New Invoice"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                name="qty"
                value={form.qty}
                onChange={handleInputChange}
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                name="price"
                value={form.price}
                onChange={handleInputChange}
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discount %
              </label>
              <input
                name="discountPercent"
                value={form.discountPercent}
                onChange={handleInputChange}
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discount
              </label>
              <input
                name="discount"
                value={form.discount}
                onChange={handleInputChange}
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tax %
              </label>
              <input
                name="taxPercent"
                value={form.taxPercent}
                onChange={handleInputChange}
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tax
              </label>
              <input
                name="tax"
                value={form.tax}
                onChange={handleInputChange}
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total
              </label>
              <input
                value={form.total.toFixed(2)}
                type="number"
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                variant="contained"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {editId !== null ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </form>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disc %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{invoice.qty}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.discountPercent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.discount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.taxPercent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.tax.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      onClick={() => startEditing(invoice)}
                      variant="outlined"
                      className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
