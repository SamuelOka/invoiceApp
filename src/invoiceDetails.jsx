import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useInvoices } from "./invoiceContext.jsx";
import EditInvoiceDrawer from "./editInvoiceDrawer.jsx";

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
