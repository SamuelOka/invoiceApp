import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInvoices } from "./invoiceContext.jsx";



function fmtGBP(n) {
  return (
    "£ " +
    n.toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}
function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const badgeStyles = {
  Paid: "bg-[#f3fcf9] text-[#33d69f] dark:bg-[#33d69f]/10",
  Pending: "bg-[#fff8f0] text-[#ff8f00] dark:bg-[#ff8f00]/10",
  Draft: "bg-[#f4f4f8] text-[#373b53] dark:bg-[#dfe3fa]/10 dark:text-[#dfe3fa]",
};

function StatusBadge({ status }) {
  return (
    <div
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold ${badgeStyles[status] ?? badgeStyles.Draft}`}
    >
      <span className="w-[7px] h-[7px] rounded-full bg-current" />
      {status}
    </div>
  );
}

function InvoiceCard({ invoice }) {
  return (
    <Link
      to={`/invoice/${invoice.id}`}
      className="block bg-white dark:bg-[#1e2139] rounded-lg border border-transparent hover:border-[#7c5dfa] transition-colors shadow-[0_2px_8px_rgba(72,84,159,0.04)] no-underline"
    >
      {/* Mobile layout */}
      <div className="md:hidden px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-[#0c0e16] dark:text-white">
            <span className="text-[#7e88c3]">#</span>
            {invoice.id}
          </span>
          <span className="text-sm text-[#858bb2]">{invoice.client.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#7e88c3] mb-1">
              Due {fmtDate(invoice.dates.paymentDue)}
            </p>
            <p className="text-base font-bold text-[#0c0e16] dark:text-white">
              {fmtGBP(invoice.amountDue)}
            </p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>
      </div>

      {/* Tablet/Desktop layout */}
      <div className="hidden md:flex items-center px-6 py-4">
        <span className="text-sm font-bold text-[#0c0e16] dark:text-white w-20">
          <span className="text-[#7e88c3]">#</span>
          {invoice.id}
        </span>
        <span className="text-sm text-[#7e88c3] w-28">
          Due {fmtDate(invoice.dates.paymentDue)}
        </span>
        <span className="text-sm text-[#858bb2] flex-1">
          {invoice.client.name}
        </span>
        <span className="text-[15px] font-bold text-[#0c0e16] dark:text-white w-28 text-right">
          {fmtGBP(invoice.amountDue)}
        </span>
        <div className="w-28 flex justify-center">
          <StatusBadge status={invoice.status} />
        </div>
        <span className="text-[#7c5dfa] font-bold ml-3">›</span>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-20 gap-8">
      <img
        src=""
        alt="No invoices illustration"
        className="w-[220px] h-[200px] object-contain"
      />
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#0c0e16] dark:text-white mb-4">
          There is nothing here
        </h2>
        <p className="text-sm text-[#888eb0] leading-relaxed">
          Create an invoice by clicking the{" "}
          <span className="font-bold text-[#0c0e16] dark:text-white">New</span>{" "}
          button and get started
        </p>
      </div>
    </div>
  );
}

export default function Invoices() {
  const { invoices } = useInvoices();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeFilter = searchParams.get("status") || "";
  const filtered = activeFilter
    ? invoices.filter((i) => i.status === activeFilter)
    : invoices;

  function toggleFilter(status) {
    setSearchParams(activeFilter === status ? {} : { status });
    setFilterOpen(false);
  }

  return (
    <>
      <div className="flex-1 px-6 md:px-12 py-8 md:py-10 max-w-3xl mx-auto w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0c0e16] dark:text-white tracking-tight">
              Invoices
            </h1>
            <p className="text-xs md:text-sm text-[#888eb0] mt-1">
              {filtered.length === 0 ? (
                "No invoices"
              ) : (
                <>
                  {/* Mobile: shorter */}
                  <span className="md:hidden">
                    {filtered.length} invoice{filtered.length !== 1 ? "s" : ""}
                  </span>
                  {/* Tablet+: full text */}
                  <span className="hidden md:inline">
                    There are {filtered.length} total invoice
                    {filtered.length !== 1 ? "s" : ""}
                  </span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className="flex items-center gap-2 text-sm font-bold text-[#0c0e16] dark:text-white cursor-pointer bg-transparent border-none"
              >
                {/* Mobile: short */}
                <span className="md:hidden">Filter</span>
                {/* Tablet+: full */}
                <span className="hidden md:inline">Filter by status</span>
                <svg
                  width="10"
                  height="7"
                  viewBox="0 0 10 7"
                  fill="none"
                  className={`transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="M1 1l4 4 4-4"
                    stroke="#7c5dfa"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {filterOpen && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-[#252945] rounded-lg shadow-xl p-4 flex flex-col gap-3 w-36 z-10">
                  {["Paid", "Pending", "Draft"].map((s) => (
                    <label
                      key={s}
                      className="flex items-center gap-3 cursor-pointer text-sm font-bold text-[#0c0e16] dark:text-white"
                    >
                      <input
                        type="checkbox"
                        checked={activeFilter === s}
                        onChange={() => toggleFilter(s)}
                        className="accent-[#7c5dfa] w-4 h-4 rounded cursor-pointer"
                      />
                      {s}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* New Invoice button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 md:gap-3 bg-[#7c5dfa] hover:bg-[#9277ff] transition-colors text-white font-bold text-sm rounded-full pl-2 pr-3 md:pr-4 py-2"
            >
              <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#7c5dfa] font-bold text-xl leading-none">
                +
              </span>
              {/* Mobile: "New", Tablet+: "New Invoice" */}
              <span className="md:hidden">New</span>
              <span className="hidden md:inline">New Invoice</span>
            </button>
          </div>
        </div>

        {/* List or empty */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-3 md:gap-4">
            {filtered.map((inv) => (
              <InvoiceCard key={inv.id} invoice={inv} />
            ))}
          </div>
        )}
      </div>

      {drawerOpen && <NewInvoiceDrawer onClose={() => setDrawerOpen(false)} />}
    </>
  );
}





// NewDrawer

const defaultItem = () => ({ itemName: "", quantity: 1, price: 0 });
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
  fieldErrors,
  hasItemErrors,
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

      {/* Error summary — all values come from props, no undefined references */}
      {submitted && hasErrors && (
        <div className="flex flex-col gap-1 pt-2">
          {fieldErrors.length > 0 && (
            <p className="text-xs font-medium text-[#ec5757]">
              — All fields must be added
            </p>
          )}
          {getErrors().noItems && (
            <p className="text-xs font-medium text-[#ec5757]">
              — {getErrors().noItems}
            </p>
          )}
          {hasItemErrors && (
            <p className="text-xs font-medium text-[#ec5757]">
              — Item fields must be valid
            </p>
          )}
        </div>
      )}
    </>
  );
}

const Footer = ({ onClose, handleSave }) => (
  <div className="flex items-center justify-between px-6 md:px-10 py-5 md:py-6 shadow-[0_-4px_16px_rgba(72,84,159,0.1)] bg-white dark:bg-[#141625]">
    <button
      onClick={onClose}
      className="px-6 py-3 rounded-full text-sm font-bold bg-[#f9fafe] dark:bg-[#252945] text-[#7e88c3] dark:text-[#dfe3fa] hover:bg-[#dfe3fa] transition-colors border-none cursor-pointer"
    >
      Discard
    </button>
    <div className="flex gap-3">
      <button
        onClick={() => handleSave("Draft")}
        className="px-6 py-3 rounded-full text-sm font-bold bg-[#373b53] hover:bg-[#0c0e16] text-[#888eb0] transition-colors border-none cursor-pointer"
      >
        Save as Draft
      </button>
      <button
        onClick={() => handleSave("Pending")}
        className="px-6 py-3 rounded-full text-sm font-bold bg-[#7c5dfa] hover:bg-[#9277ff] text-white transition-colors border-none cursor-pointer"
      >
        Save &amp; Send
      </button>
    </div>
  </div>
);

export default function NewInvoiceDrawer({ onClose }) {
  const { addInvoice } = useInvoices();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    senderStreet: "",
    senderCity: "",
    senderPostcode: "",
    senderCountry: "",
    clientName: "",
    clientEmail: "",
    clientStreet: "",
    clientCity: "",
    clientPostcode: "",
    clientCountry: "",
    invoiceDate: "",
    paymentTerms: "Net 30 Days",
    project: "",
  });
  const [items, setItems] = useState([defaultItem()]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  function setItem(i, field, value) {
    setItems((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)),
    );
  }
  function addItem() {
    setItems((prev) => [...prev, defaultItem()]);
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
  const fieldErrors = submitted
    ? Object.keys(getErrors()).filter(
        (k) => !k.startsWith("item_") && k !== "noItems",
      )
    : [];
  const hasItemErrors = submitted
    ? Object.keys(getErrors()).some((k) => k.startsWith("item_"))
    : false;

  function handleSave(status) {
    if (status !== "Draft") {
      setSubmitted(true);
      if (hasErrors) return;
    }
    addInvoice({
      ...form,
      items: items.map((item) => ({ ...item, total: calcTotal(item) })),
      status,
    });
    onClose();
  }

  // All derived values bundled and passed explicitly — no undefined references in FormBody
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
    fieldErrors,
    hasItemErrors,
    getErrors,
  };

  return (
    <>
      {/* ── Mobile: full-screen ── */}
      <div className="md:hidden fixed inset-0 bg-[#f8f8fb] dark:bg-[#141625] z-50 flex flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <h2 className="text-2xl font-bold text-[#0c0e16] dark:text-white mb-10">
            New Invoice
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
              New Invoice
            </h2>
            <FormBody {...formBodyProps} />
          </div>
          <Footer onClose={onClose} handleSave={handleSave} />
        </div>
      </div>
    </>
  );
}
