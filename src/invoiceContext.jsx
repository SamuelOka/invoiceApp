import { createContext, useContext, useState } from "react";

const STORAGE_KEY = "invoices_data";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupted data — start fresh
  }
  return [];
}

function saveToStorage(invoices) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  } catch {
    console.warn("Could not save invoices to localStorage.");
  }
}

function generateId() {
  const letters = Math.random().toString(36).substring(2, 4).toUpperCase();
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `${letters}${numbers}`;
}

const InvoiceContext = createContext(null);

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState(() => loadFromStorage());

  // Always use the functional updater form so we never read stale state
  function persist(updaterFn) {
    setInvoices((prev) => {
      const updated = updaterFn(prev);
      saveToStorage(updated);
      return updated;
    });
  }

  function addInvoice(formData) {
    const days = parseInt(formData.paymentTerms) || 30;
    const invoiceDate = formData.invoiceDate
      ? new Date(formData.invoiceDate)
      : new Date();
    const paymentDue = new Date(invoiceDate);
    paymentDue.setDate(paymentDue.getDate() + days);

    const invoice = {
      id: generateId(),
      project: formData.project,
      sender: {
        name: "",
        address: {
          street: formData.senderStreet,
          city: formData.senderCity,
          postcode: formData.senderPostcode,
          country: formData.senderCountry,
        },
      },
      client: {
        name: formData.clientName,
        email: formData.clientEmail,
        address: {
          street: formData.clientStreet,
          city: formData.clientCity,
          postcode: formData.clientPostcode,
          country: formData.clientCountry,
        },
      },
      dates: {
        invoiceDate: invoiceDate.toISOString().split("T")[0],
        paymentDue: paymentDue.toISOString().split("T")[0],
      },
      items: formData.items,
      amountDue: formData.items.reduce((sum, item) => sum + item.total, 0),
      status: formData.status,
    };

    persist((prev) => [invoice, ...prev]);
    return invoice;
  }

  function updateInvoice(id, changes) {
    persist((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...changes } : inv)),
    );
  }

  function updateInvoiceStatus(id, status) {
    persist((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)),
    );
  }

  function deleteInvoice(id) {
    persist((prev) => prev.filter((inv) => inv.id !== id));
  }

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        addInvoice,
        updateInvoice,
        updateInvoiceStatus,
        deleteInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error("useInvoices must be inside <InvoiceProvider>");
  return ctx;
}
