import { Link, useParams, useNavigate } from "react-router-dom";
import { useInvoices } from "./InvoiceContext";

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
  Paid: "bg-[#f3fcf9] text-[#33d69f]",
  Pending: "bg-[#fff8f0] text-[#ff8f00]",
  Draft: "bg-[#f4f4f8] text-[#373b53]",
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

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, updateInvoiceStatus, deleteInvoice } = useInvoices();
  const invoice = invoices.find((inv) => inv.id === id);

  if (!invoice) {
    return (
      <div className="p-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-bold text-[#0c0e16] hover:text-[#7c5dfa] w-fit"
        >
          <span className="text-[#7c5dfa] text-lg">‹</span> Go back
        </Link>
        <p className="mt-6 text-sm text-[#888eb0]">Invoice #{id} not found.</p>
      </div>
    );
  }

  function handleToggleStatus() {
    updateInvoiceStatus(id, invoice.status === "Paid" ? "Pending" : "Paid");
  }

  function handleDelete() {
    deleteInvoice(id);
    navigate("/");
  }

  return (
    <div className="flex-1 px-10 py-7 flex flex-col gap-4 max-w-3xl mx-auto w-full">
      <Link
        to="/"
        className="flex items-center gap-2.5 text-sm font-bold text-[#0c0e16] hover:text-[#7c5dfa] w-fit transition-colors"
      >
        <span className="text-[#7c5dfa] text-lg leading-none">‹</span>
        Go back
      </Link>

      {/* Status bar */}
      <div className="flex items-center justify-between bg-white rounded-lg px-6 py-5 shadow-[0_2px_8px_rgba(72,84,159,0.06)]">
        <div className="flex items-center gap-4 text-sm text-[#858bb2]">
          <span>Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="flex gap-2">
          <button className="px-5 py-3.5 rounded-full text-sm font-bold bg-[#f9fafe] text-[#7e88c3] hover:bg-[#dfe3fa] transition-colors cursor-pointer border-none">
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-3.5 rounded-full text-sm font-bold bg-[#ec5757] hover:bg-[#ff9797] text-white transition-colors cursor-pointer border-none"
          >
            Delete
          </button>
          <button
            onClick={handleToggleStatus}
            className="px-5 py-3.5 rounded-full text-sm font-bold bg-[#7c5dfa] hover:bg-[#9277ff] text-white transition-colors cursor-pointer border-none"
          >
            {invoice.status === "Paid" ? "Mark as Pending" : "Mark as Paid"}
          </button>
        </div>
      </div>

      {/* Detail card */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(72,84,159,0.06)] overflow-hidden">
        <div className="p-10">
          <div className="flex justify-between mb-8">
            <div>
              <p className="text-[15px] font-bold text-[#0c0e16]">
                <span className="text-[#7e88c3]">#</span>
                {invoice.id}
              </p>
              <p className="text-sm text-[#7e88c3] mt-1.5">{invoice.project}</p>
            </div>
            <div className="text-xs text-[#7e88c3] leading-loose text-right">
              <p>{invoice.sender.address.street}</p>
              <p>{invoice.sender.address.city}</p>
              <p>{invoice.sender.address.postcode}</p>
              <p>{invoice.sender.address.country}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs text-[#7e88c3] mb-2.5">Invoice Date</p>
                <p className="text-sm font-bold text-[#0c0e16]">
                  {fmtDate(invoice.dates.invoiceDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#7e88c3] mb-2.5">Payment Due</p>
                <p className="text-sm font-bold text-[#0c0e16]">
                  {fmtDate(invoice.dates.paymentDue)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-[#7e88c3] mb-2.5">Bill To</p>
              <p className="text-sm font-bold text-[#0c0e16] mb-1">
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
            <div>
              <p className="text-xs text-[#7e88c3] mb-2.5">Sent to</p>
              <p className="text-sm font-bold text-[#0c0e16]">
                {invoice.client.email}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#f9fafe] rounded-t-lg mx-6 overflow-hidden">
          <div className="px-8 pt-7">
            <div className="grid grid-cols-[1fr_60px_110px_90px] text-xs text-[#7e88c3] pb-5">
              <span>Item Name</span>
              <span className="text-right">QTY.</span>
              <span className="text-right">Price</span>
              <span className="text-right">Total</span>
            </div>
            <div className="flex flex-col gap-4 pb-6">
              {invoice.items.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_60px_110px_90px] items-center"
                >
                  <span className="text-sm font-bold text-[#0c0e16]">
                    {item.itemName}
                  </span>
                  <span className="text-sm font-bold text-[#7e88c3] text-right">
                    {item.quantity}
                  </span>
                  <span className="text-sm font-bold text-[#7e88c3] text-right">
                    {fmtGBP(item.price)}
                  </span>
                  <span className="text-sm font-bold text-[#0c0e16] text-right">
                    {fmtGBP(item.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#373b53] flex items-center justify-between px-8 py-6">
            <span className="text-xs text-[#dfe3fa]">Amount Due</span>
            <span className="text-[22px] font-bold text-white tracking-tight">
              {fmtGBP(invoice.amountDue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
