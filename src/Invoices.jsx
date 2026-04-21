import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInvoices } from "./InvoiceContext";
import NewInvoiceDrawer from "./NewInvoiceDrawer";

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
  Paid: "bg-[#f3fcf9] text-[#33d69f]",
  Pending: "bg-[#fff8f0] text-[#ff8f00]",
  Draft: "bg-[#f4f4f8] text-[#373b53]",
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
      className="flex items-center bg-white rounded-lg px-6 py-4 border border-transparent hover:border-[#7c5dfa] transition-colors shadow-[0_2px_8px_rgba(72,84,159,0.04)] no-underline"
    >
      <span className="text-sm font-bold text-[#0c0e16] w-20">
        <span className="text-[#7e88c3]">#</span>
        {invoice.id}
      </span>
      <span className="text-sm text-[#7e88c3] w-28">
        Due {fmtDate(invoice.dates.paymentDue)}
      </span>
      <span className="text-sm text-[#858bb2] flex-1">
        {invoice.client.name}
      </span>
      <span className="text-[15px] font-bold text-[#0c0e16] w-28 text-right">
        {fmtGBP(invoice.amountDue)}
      </span>
      <div className="w-28 flex justify-center">
        <StatusBadge status={invoice.status} />
      </div>
      <span className="text-[#7c5dfa] font-bold ml-3">›</span>
    </Link>
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
      <div className="flex-1 px-12 py-10 max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#0c0e16] tracking-tight">
              Invoices
            </h1>
            <p className="text-sm text-[#888eb0] mt-1">
              There are {filtered.length} total invoice
              {filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className="flex items-center gap-2 text-sm font-bold text-[#0c0e16] cursor-pointer bg-transparent border-none"
              >
                Filter by status
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
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl p-4 flex flex-col gap-3 w-36 z-10">
                  {["Paid", "Pending", "Draft"].map((s) => (
                    <label
                      key={s}
                      className="flex items-center gap-3 cursor-pointer text-sm font-bold text-[#0c0e16]"
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

            {/* New Invoice */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-3 bg-[#7c5dfa] hover:bg-[#9277ff] transition-colors text-white font-bold text-sm rounded-full pl-2 pr-4 py-2"
            >
              <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#7c5dfa] font-bold text-xl leading-none">
                +
              </span>
              New Invoice
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <p className="text-center py-12 text-sm text-[#888eb0]">
              No {activeFilter.toLowerCase()} invoices found.
            </p>
          ) : (
            filtered.map((inv) => <InvoiceCard key={inv.id} invoice={inv} />)
          )}
        </div>
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
