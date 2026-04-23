import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useInvoices } from "./invoiceContext.jsx";

function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function fmtGBP(n) {
  return (
    "£ " +
    n.toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

const badgeClasses = {
  Paid: "bg-[#f3fcf9] text-[#33d69f] dark:bg-[#33d69f]/10",
  Pending: "bg-[#fff8f0] text-[#ff8f00] dark:bg-[#ff8f00]/10",
  Draft: "bg-[#f4f4f8] text-[#373b53] dark:bg-[#dfe3fa]/10 dark:text-[#dfe3fa]",
};

function StatusBadge({ status }) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold ${badgeClasses[status] ?? badgeClasses.Draft}`}
    >
      <span className="w-[7px] h-[7px] rounded-full bg-current" />
      {status}
    </div>
  );
}

function DeleteModal({ invoiceId, onCancel, onConfirm }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onCancel} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-[#1e2139] rounded-2xl p-8 md:p-10 w-[90vw] max-w-[480px] shadow-2xl">
        <h2 className="text-xl md:text-2xl font-bold text-[#0c0e16] dark:text-white mb-3">
          Confirm Deletion
        </h2>
        <p className="text-sm text-[#888eb0] leading-relaxed mb-8">
          Are you sure you want to delete invoice #{invoiceId}? This action
          cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-full text-sm font-bold bg-[#f9fafe] dark:bg-[#252945] text-[#7e88c3] dark:text-[#dfe3fa] hover:bg-[#dfe3fa] transition-colors border-none cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 rounded-full text-sm font-bold bg-[#ec5757] hover:bg-[#ff9797] text-white transition-colors border-none cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, updateInvoiceStatus, deleteInvoice } = useInvoices();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const invoice = invoices.find((inv) => inv.id === id);

  if (!invoice) {
    return (
      <div className="p-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-bold text-[#0c0e16] dark:text-white hover:text-[#7c5dfa] w-fit mb-6"
        >
          <span className="text-[#7c5dfa] text-lg">‹</span> Go back
        </Link>
        <p className="text-sm text-[#888eb0]">Invoice #{id} not found.</p>
      </div>
    );
  }

  const isPaid = invoice.status === "Paid";
  const isDraft = invoice.status === "Draft";
  const isPending = invoice.status === "Pending";

  function handleStatusAction() {
    if (isDraft) updateInvoiceStatus(id, "Pending");
    if (isPending) updateInvoiceStatus(id, "Paid");
  }
  function handleConfirmDelete() {
    deleteInvoice(id);
    navigate("/");
  }

  // Button label and availability based on status
  const statusButtonLabel = isDraft ? "Mark as Pending" : "Mark as Paid";
  const statusButtonDisabled = isPaid; // Paid is final — no further action

  // Shared action buttons
  const ActionButtons = () => (
    <div className="flex gap-2">
      <button
        onClick={() => !isPaid && setEditOpen(true)}
        disabled={isPaid}
        className={`px-5 py-3 rounded-full text-sm font-bold transition-colors border-none ${
          isPaid
            ? "bg-[#f9fafe] dark:bg-[#252945] text-[#c4c9d4] cursor-not-allowed opacity-60"
            : "bg-[#f9fafe] dark:bg-[#252945] text-[#7e88c3] dark:text-[#dfe3fa] hover:bg-[#dfe3fa] cursor-pointer"
        }`}
      >
        Edit
      </button>
      <button
        onClick={() => setDeleteOpen(true)}
        className="px-5 py-3 rounded-full text-sm font-bold bg-[#ec5757] hover:bg-[#ff9797] text-white transition-colors cursor-pointer border-none"
      >
        Delete
      </button>
      <button
        onClick={!statusButtonDisabled ? handleStatusAction : undefined}
        disabled={statusButtonDisabled}
        className={`px-5 py-3 rounded-full text-sm font-bold transition-colors border-none ${
          statusButtonDisabled
            ? "bg-[#7c5dfa] text-white opacity-50 cursor-not-allowed"
            : "bg-[#7c5dfa] hover:bg-[#9277ff] text-white cursor-pointer"
        }`}
      >
        {statusButtonLabel}
      </button>
    </div>
  );

  return (
    <>
      {/* Extra bottom padding on mobile to clear fixed action bar */}
      <div className="flex-1 px-6 md:px-10 py-7 flex flex-col gap-4 max-w-3xl mx-auto w-full pb-32 md:pb-7">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-sm font-bold text-[#0c0e16] dark:text-white hover:text-[#7c5dfa] w-fit transition-colors"
        >
          <span className="text-[#7c5dfa] text-lg leading-none">‹</span>
          Go back
        </Link>

        {/* Status bar */}
        <div className="flex items-center justify-between bg-white dark:bg-[#1e2139] rounded-lg px-6 py-5 shadow-[0_2px_8px_rgba(72,84,159,0.06)]">
          <div className="flex items-center gap-4 text-sm text-[#858bb2]">
            <span>Status</span>
            <StatusBadge status={invoice.status} />
          </div>
          {/* Action buttons — visible on tablet+ only, hidden on mobile */}
          <div className="hidden md:block">
            <ActionButtons />
          </div>
        </div>

        {/* Detail card */}
        <div className="bg-white dark:bg-[#1e2139] rounded-lg shadow-[0_2px_8px_rgba(72,84,159,0.06)] overflow-hidden">
          <div className="p-6 md:p-10">
            {/* Top row */}
            <div className="flex flex-col md:flex-row md:justify-between mb-6 md:mb-8 gap-4">
              <div>
                <p className="text-[15px] font-bold text-[#0c0e16] dark:text-white">
                  <span className="text-[#7e88c3]">#</span>
                  {invoice.id}
                </p>
                <p className="text-sm text-[#7e88c3] mt-1.5">
                  {invoice.project}
                </p>
              </div>
              {/* Sender address — right-aligned on tablet+, left-aligned on mobile */}
              <div className="text-xs text-[#7e88c3] leading-loose md:text-right">
                <p>{invoice.sender.address.street}</p>
                <p>{invoice.sender.address.city}</p>
                <p>{invoice.sender.address.postcode}</p>
                <p>{invoice.sender.address.country}</p>
              </div>
            </div>

            {/* Meta — 2-col on mobile (dates + bill to), 3-col on tablet+ */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-4 mb-8 md:mb-10">
              {/* Dates */}
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-xs text-[#7e88c3] mb-2">Invoice Date</p>
                  <p className="text-sm font-bold text-[#0c0e16] dark:text-white">
                    {fmtDate(invoice.dates.invoiceDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7e88c3] mb-2">Payment Due</p>
                  <p className="text-sm font-bold text-[#0c0e16] dark:text-white">
                    {fmtDate(invoice.dates.paymentDue)}
                  </p>
                </div>
              </div>

              {/* Bill to */}
              <div>
                <p className="text-xs text-[#7e88c3] mb-2">Bill To</p>
                <p className="text-sm font-bold text-[#0c0e16] dark:text-white mb-1">
                  {invoice.client.name}
                </p>
                <p className="text-xs text-[#7e88c3] leading-loose">
                  {invoice.client.address.street}
                  <br />
                  {invoice.client.address.city}
                  <br />
                  {invoice.client.address.postcode}
                  <br />
                  {invoice.client.address.country}
                </p>
              </div>

              {/* Sent to — full width on mobile (col-span-2), normal on tablet+ */}
              <div className="col-span-2 md:col-span-1">
                <p className="text-xs text-[#7e88c3] mb-2">Sent to</p>
                <p className="text-sm font-bold text-[#0c0e16] dark:text-white">
                  {invoice.client.email}
                </p>
              </div>
            </div>
          </div>

          {/* Items table */}
          <div className="bg-[#f9fafe] dark:bg-[#252945] rounded-t-lg mx-4 md:mx-6 overflow-hidden">
            <div className="px-6 md:px-8 pt-6 md:pt-7">
              {/* Table header — hidden on mobile, shown on tablet+ */}
              <div className="hidden md:grid grid-cols-[1fr_60px_110px_90px] text-xs text-[#7e88c3] pb-5">
                <span>Item Name</span>
                <span className="text-right">QTY.</span>
                <span className="text-right">Price</span>
                <span className="text-right">Total</span>
              </div>

              <div className="flex flex-col gap-4 pb-6">
                {invoice.items.map((item, i) => (
                  <div key={i}>
                    {/* Mobile item row */}
                    <div className="md:hidden flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-[#0c0e16] dark:text-white">
                          {item.itemName}
                        </p>
                        <p className="text-sm text-[#7e88c3] mt-1">
                          {item.quantity} x {fmtGBP(item.price)}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-[#0c0e16] dark:text-white">
                        {fmtGBP(item.total)}
                      </p>
                    </div>
                    {/* Tablet+ item row */}
                    <div className="hidden md:grid grid-cols-[1fr_60px_110px_90px] items-center">
                      <span className="text-sm font-bold text-[#0c0e16] dark:text-white">
                        {item.itemName}
                      </span>
                      <span className="text-sm font-bold text-[#7e88c3] text-right">
                        {item.quantity}
                      </span>
                      <span className="text-sm font-bold text-[#7e88c3] text-right">
                        {fmtGBP(item.price)}
                      </span>
                      <span className="text-sm font-bold text-[#0c0e16] dark:text-white text-right">
                        {fmtGBP(item.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#373b53] dark:bg-[#0c0e16] flex items-center justify-between px-6 md:px-8 py-5 md:py-6">
              <span className="text-xs text-[#dfe3fa]">Amount Due</span>
              <span className="text-xl md:text-[22px] font-bold text-white tracking-tight">
                {fmtGBP(invoice.amountDue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile fixed bottom action bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1e2139] px-6 py-4 shadow-[0_-4px_16px_rgba(72,84,159,0.1)] z-20 flex justify-center">
        <ActionButtons />
      </div>

      {editOpen && (
        <EditInvoiceDrawer
          invoice={invoice}
          onClose={() => setEditOpen(false)}
        />
      )}
      {deleteOpen && (
        <DeleteModal
          invoiceId={invoice.id}
          onCancel={() => setDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}

// edit invoice drawer

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function inputCls(hasError) {
  return `w-full border rounded-md px-4 py-3 text-sm font-bold text-[#0c0e16] dark:text-white dark:bg-[#1e2139] outline-none transition-colors ${
    hasError
      ? "border-[#ec5757] focus:border-[#ec5757]"
      : "border-[#dfe3fa] dark:border-[#252945] focus:border-[#7c5dfa]"
  }`;
}

function Field({ label, error, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label
          className={`text-xs ${error ? "text-[#ec5757]" : "text-[#7e88c3]"}`}
        >
          {label}
        </label>
        {error && (
          <span className="text-xs text-[#ec5757] italic">{error}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function FormBody({
  form,
  set,
  errors,
  items,
  setItem,
  addItem,
  removeItem,
  calcTotal,
  submitted,
  hasErrors,
  getErrors,
}) {
  return (
    <>
      <p className="text-xs font-bold text-[#7c5dfa] mb-5">Bill From</p>
      <div className="mb-5">
        <Field label="Street Address" error={errors.senderStreet}>
          <input
            className={inputCls(!!errors.senderStreet)}
            value={form.senderStreet}
            onChange={(e) => set("senderStreet", e.target.value)}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <Field label="City" error={errors.senderCity}>
          <input
            className={inputCls(!!errors.senderCity)}
            value={form.senderCity}
            onChange={(e) => set("senderCity", e.target.value)}
          />
        </Field>
        <Field label="Post Code" error={errors.senderPostcode}>
          <input
            className={inputCls(!!errors.senderPostcode)}
            value={form.senderPostcode}
            onChange={(e) => set("senderPostcode", e.target.value)}
          />
        </Field>
        <div className="col-span-2 md:col-span-1">
          <Field label="Country" error={errors.senderCountry}>
            <input
              className={inputCls(!!errors.senderCountry)}
              value={form.senderCountry}
              onChange={(e) => set("senderCountry", e.target.value)}
            />
          </Field>
        </div>
      </div>

      <p className="text-xs font-bold text-[#7c5dfa] mb-5">Bill To</p>
      <div className="mb-5">
        <Field label="Client's Name" error={errors.clientName}>
          <input
            className={inputCls(!!errors.clientName)}
            value={form.clientName}
            onChange={(e) => set("clientName", e.target.value)}
          />
        </Field>
      </div>
      <div className="mb-5">
        <Field label="Client's Email" error={errors.clientEmail}>
          <input
            className={inputCls(!!errors.clientEmail)}
            type="email"
            value={form.clientEmail}
            onChange={(e) => set("clientEmail", e.target.value)}
          />
        </Field>
      </div>
      <div className="mb-5">
        <Field label="Street Address" error={errors.clientStreet}>
          <input
            className={inputCls(!!errors.clientStreet)}
            value={form.clientStreet}
            onChange={(e) => set("clientStreet", e.target.value)}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <Field label="City" error={errors.clientCity}>
          <input
            className={inputCls(!!errors.clientCity)}
            value={form.clientCity}
            onChange={(e) => set("clientCity", e.target.value)}
          />
        </Field>
        <Field label="Post Code" error={errors.clientPostcode}>
          <input
            className={inputCls(!!errors.clientPostcode)}
            value={form.clientPostcode}
            onChange={(e) => set("clientPostcode", e.target.value)}
          />
        </Field>
        <div className="col-span-2 md:col-span-1">
          <Field label="Country" error={errors.clientCountry}>
            <input
              className={inputCls(!!errors.clientCountry)}
              value={form.clientCountry}
              onChange={(e) => set("clientCountry", e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <Field label="Invoice Date" error={errors.invoiceDate}>
          <input
            className={inputCls(!!errors.invoiceDate)}
            type="date"
            value={form.invoiceDate}
            onChange={(e) => set("invoiceDate", e.target.value)}
          />
        </Field>
        <div>
          <label className="block text-xs text-[#7e88c3] mb-2">
            Payment Terms
          </label>
          <div className="relative">
            <select
              className="w-full border border-[#dfe3fa] dark:border-[#252945] rounded-md px-4 py-3 text-sm font-bold text-[#0c0e16] dark:text-white dark:bg-[#1e2139] outline-none focus:border-[#7c5dfa] appearance-none pr-10 transition-colors"
              value={form.paymentTerms}
              onChange={(e) => set("paymentTerms", e.target.value)}
            >
              <option>Net 1 Day</option>
              <option>Net 7 Days</option>
              <option>Net 14 Days</option>
              <option>Net 30 Days</option>
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              width="10"
              height="7"
              viewBox="0 0 10 7"
              fill="none"
            >
              <path
                d="M1 1l4 4 4-4"
                stroke="#7c5dfa"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <Field label="Project Description" error={errors.project}>
          <input
            className={inputCls(!!errors.project)}
            value={form.project}
            onChange={(e) => set("project", e.target.value)}
          />
        </Field>
      </div>

      <p className="text-base font-bold text-[#777f98] mb-5">Item List</p>
      <div className="flex flex-col gap-4 mb-4">
        <div className="grid grid-cols-[1fr_60px_100px_80px_24px] gap-3 text-xs text-[#7e88c3]">
          <span>Item Name</span>
          <span>Qty.</span>
          <span>Price</span>
          <span>Total</span>
          <span />
        </div>
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="grid grid-cols-[1fr_60px_100px_80px_24px] gap-3 items-center">
              <input
                className={inputCls(!!errors[`item_${i}_name`])}
                value={item.itemName}
                onChange={(e) => setItem(i, "itemName", e.target.value)}
              />
              <input
                className={inputCls(!!errors[`item_${i}_qty`])}
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => setItem(i, "quantity", e.target.value)}
              />
              <input
                className={inputCls(!!errors[`item_${i}_price`])}
                type="number"
                min="0"
                step="0.01"
                value={item.price}
                onChange={(e) => setItem(i, "price", e.target.value)}
              />
              <span className="text-sm font-bold text-[#888eb0]">
                {calcTotal(item).toFixed(2)}
              </span>
              <button
                onClick={() => removeItem(i)}
                className="text-[#888eb0] hover:text-[#ec5757] transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
                  <path
                    d="M11.583 3.556H8.944l-.75-1.5H4.806l-.75 1.5H1.417v1.333h.666L3 14.667h7l.917-9.778h.666V3.556zM8.583 13.333H4.417L3.75 4.889h5.5l-.667 8.444z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
            {(errors[`item_${i}_name`] ||
              errors[`item_${i}_qty`] ||
              errors[`item_${i}_price`]) && (
              <div className="grid grid-cols-[1fr_60px_100px_80px_24px] gap-3">
                <span className="text-[10px] text-[#ec5757] italic">
                  {errors[`item_${i}_name`]}
                </span>
                <span className="text-[10px] text-[#ec5757] italic">
                  {errors[`item_${i}_qty`]}
                </span>
                <span className="text-[10px] text-[#ec5757] italic">
                  {errors[`item_${i}_price`]}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="w-full py-4 rounded-full bg-[#f9fafe] dark:bg-[#252945] hover:bg-[#dfe3fa] text-sm font-bold text-[#7e88c3] transition-colors border-none cursor-pointer mb-4"
      >
        + Add New Item
      </button>

      {/* Error summary — uses props passed from parent */}
      {submitted && hasErrors && (
        <div className="flex flex-col gap-1 pt-2">
          {Object.keys(getErrors()).filter(
            (k) => !k.startsWith("item_") && k !== "noItems",
          ).length > 0 && (
            <p className="text-xs font-medium text-[#ec5757]">
              — All fields must be filled in
            </p>
          )}
          {getErrors().noItems && (
            <p className="text-xs font-medium text-[#ec5757]">
              — {getErrors().noItems}
            </p>
          )}
        </div>
      )}
    </>
  );
}

function Footer({ onClose, handleSave }) {
  return (
    <div className="flex items-center justify-end gap-3 px-6 md:px-10 py-5 md:py-6 shadow-[0_-4px_16px_rgba(72,84,159,0.1)] bg-white dark:bg-[#141625]">
      <button
        onClick={onClose}
        className="px-6 py-3 rounded-full text-sm font-bold bg-[#f9fafe] dark:bg-[#252945] text-[#7e88c3] dark:text-[#dfe3fa] hover:bg-[#dfe3fa] transition-colors border-none cursor-pointer"
      >
        Cancel
      </button>
      <button
        onClick={handleSave}
        className="px-6 py-3 rounded-full text-sm font-bold bg-[#7c5dfa] hover:bg-[#9277ff] text-white transition-colors border-none cursor-pointer"
      >
        Save Changes
      </button>
    </div>
  );
}

function EditInvoiceDrawer({ invoice, onClose }) {
  const { updateInvoice } = useInvoices();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    senderStreet: invoice.sender.address.street,
    senderCity: invoice.sender.address.city,
    senderPostcode: invoice.sender.address.postcode,
    senderCountry: invoice.sender.address.country,
    clientName: invoice.client.name,
    clientEmail: invoice.client.email,
    clientStreet: invoice.client.address.street,
    clientCity: invoice.client.address.city,
    clientPostcode: invoice.client.address.postcode,
    clientCountry: invoice.client.address.country,
    invoiceDate: invoice.dates.invoiceDate,
    paymentTerms: "Net 30 Days",
    project: invoice.project,
  });
  const [items, setItems] = useState(
    invoice.items.map((item) => ({ ...item })),
  );

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  function setItem(i, field, value) {
    setItems((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)),
    );
  }
  function addItem() {
    setItems((prev) => [
      ...prev,
      { itemName: "", quantity: 1, price: 0, total: 0 },
    ]);
  }
  function removeItem(i) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }
  function calcTotal(item) {
    return (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0);
  }

  function getErrors() {
    const e = {};
    if (!form.senderStreet.trim()) e.senderStreet = "can't be empty";
    if (!form.senderCity.trim()) e.senderCity = "can't be empty";
    if (!form.senderPostcode.trim()) e.senderPostcode = "can't be empty";
    if (!form.senderCountry.trim()) e.senderCountry = "can't be empty";
    if (!form.clientName.trim()) e.clientName = "can't be empty";
    if (!form.clientEmail.trim()) e.clientEmail = "can't be empty";
    else if (!EMAIL_RE.test(form.clientEmail)) e.clientEmail = "invalid email";
    if (!form.clientStreet.trim()) e.clientStreet = "can't be empty";
    if (!form.clientCity.trim()) e.clientCity = "can't be empty";
    if (!form.clientPostcode.trim()) e.clientPostcode = "can't be empty";
    if (!form.clientCountry.trim()) e.clientCountry = "can't be empty";
    if (!form.invoiceDate) e.invoiceDate = "can't be empty";
    if (!form.project.trim()) e.project = "can't be empty";
    if (items.length === 0) e.noItems = "An item must be added";
    items.forEach((item, i) => {
      if (!item.itemName.trim()) e[`item_${i}_name`] = "can't be empty";
      if (!(parseFloat(item.quantity) > 0)) e[`item_${i}_qty`] = "invalid";
      if (!(parseFloat(item.price) >= 0)) e[`item_${i}_price`] = "invalid";
    });
    return e;
  }

  const errors = submitted ? getErrors() : {};
  const hasErrors = Object.keys(getErrors()).length > 0;

  function handleSave() {
    setSubmitted(true);
    // Compute errors fresh — hasErrors from render may be stale
    if (Object.keys(getErrors()).length > 0) return;
    const days = parseInt(form.paymentTerms) || 30;
    const invoiceDate = new Date(form.invoiceDate);
    const paymentDue = new Date(invoiceDate);
    paymentDue.setDate(paymentDue.getDate() + days);
    const updatedItems = items.map((item) => ({
      ...item,
      quantity: parseFloat(item.quantity) || 0,
      price: parseFloat(item.price) || 0,
      total: calcTotal(item),
    }));
    updateInvoice(invoice.id, {
      project: form.project,
      sender: {
        ...invoice.sender,
        address: {
          street: form.senderStreet,
          city: form.senderCity,
          postcode: form.senderPostcode,
          country: form.senderCountry,
        },
      },
      client: {
        name: form.clientName,
        email: form.clientEmail,
        address: {
          street: form.clientStreet,
          city: form.clientCity,
          postcode: form.clientPostcode,
          country: form.clientCountry,
        },
      },
      dates: {
        invoiceDate: form.invoiceDate,
        paymentDue: paymentDue.toISOString().split("T")[0],
      },
      items: updatedItems,
      amountDue: updatedItems.reduce((sum, item) => sum + item.total, 0),
    });
    onClose();
  }

  // Shared props passed down to FormBody so it has everything it needs
  const formBodyProps = {
    form,
    set,
    errors,
    items,
    setItem,
    addItem,
    removeItem,
    calcTotal,
    submitted,
    hasErrors,
    getErrors,
  };

  return (
    <>
      {/* ── Mobile: full-screen ── */}
      <div className="md:hidden fixed inset-0 bg-[#f8f8fb] dark:bg-[#141625] z-50 flex flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <h2 className="text-2xl font-bold text-[#0c0e16] dark:text-white mb-10">
            Edit <span className="text-[#7e88c3]">#</span>
            {invoice.id}
          </h2>
          <FormBody {...formBodyProps} />
        </div>
        <Footer onClose={onClose} handleSave={handleSave} />
      </div>

      {/* ── Tablet+: slide-in drawer ── */}
      <div className="hidden md:block">
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
        <div className="fixed top-0 left-[72px] h-full w-[620px] bg-white dark:bg-[#141625] z-50 flex flex-col rounded-r-2xl overflow-hidden shadow-2xl">
          <div className="flex-1 overflow-y-auto px-10 py-10">
            <h2 className="text-2xl font-bold text-[#0c0e16] dark:text-white mb-10">
              Edit <span className="text-[#7e88c3]">#</span>
              {invoice.id}
            </h2>
            <FormBody {...formBodyProps} />
          </div>
          <Footer onClose={onClose} handleSave={handleSave} />
        </div>
      </div>
    </>
  );
}

// editinvoice drawer
