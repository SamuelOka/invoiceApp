# Invoice App

A responsive invoice management app built with React, React Router v6, and Tailwind CSS v4.

---

## Setup

```bash
npm install
npm install tailwindcss @tailwindcss/vite
npm run dev
```

Add to `vite.config.js`:

```js
import tailwindcss from "@tailwindcss/vite";

plugins: [react(), tailwindcss()];
```

Replace `src/index.css` with:

```css
@import "tailwindcss";
@variant dark (&:where(.dark, .dark *));
```

---

## Architecture

| Piece                   | Role                                                 |
| ----------------------- | ---------------------------------------------------- |
| `InvoiceContext.jsx`    | Global state — reads/writes invoices to localStorage |
| `App.jsx`               | Layout, dark mode toggle, routes                     |
| `Invoices.jsx`          | Invoice list with status filter                      |
| `invoiceDetails.jsx`    | Invoice detail, edit, delete                         |
| `NewInvoiceDrawer.jsx`  | Create invoice form                                  |
| `EditInvoiceDrawer.jsx` | Edit invoice form                                    |

Routing is handled by React Router — `/` for the list, `/invoice/:id` for detail. Filter state lives in the URL (`?status=Pending`) so it survives back-navigation.

---

## Trade-offs

- **localStorage only** — data doesn't sync across devices or survive a storage clear. A real backend would replace the context's read/write calls without touching any component.
- **No pagination** — all invoices render in one list. Fine for small datasets, would need virtual scrolling at scale.
- **Paid invoices are irreversible** — once marked Paid, Edit and Mark as Paid are disabled. Intentional to protect data integrity.

---

## Accessibility

- Icon buttons have `aria-label`
- Status badges use text + colour, not colour alone
- Disabled buttons have the `disabled` attribute
- Form labels are associated with their inputs
- **Known gaps:** the filter dropdown lacks keyboard navigation, the drawer doesn't trap focus

---

## Extras (beyond the base requirements)

- localStorage persistence — invoices survive page refresh
- Dark mode saved to localStorage — theme persists across sessions
- URL-based filter — `?status=Pending` is bookmarkable
- Paid invoices lock Edit and Mark as Paid buttons
- Auto-calculated payment due date from invoice date + payment terms
- Full mobile layout — horizontal navbar, fixed bottom action bar, full-screen forms
