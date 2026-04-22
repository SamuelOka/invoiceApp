import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInvoices } from "./InvoiceContext.jsx";
import NewInvoiceDrawer from "./NewInvoiceDrawer.jsx";
import noInvoiceImage from "./assets/noInvoiceImage.png";
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
        src={noInvoiceImage}
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
  const { invoices, addInvoice } = useInvoices();
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

      {drawerOpen && (
        <NewInvoiceDrawer
          onClose={() => setDrawerOpen(false)}
          onSave={(formData) => {
            addInvoice(formData);
            setDrawerOpen(false);
          }}
        />
      )}
    </>
  );
}
