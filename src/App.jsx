import { useState, useEffect } from "react";
import logo from "./assets/logo.png";
import profilePic from "./assets/profilePic.png";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import Invoices from "./invoices";
import InvoiceDetail from "./invoiceDetails";

const THEME_KEY = "invoice_theme";

function App() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem(THEME_KEY, "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem(THEME_KEY, "light");
    }
  }, [isDark]);

  const MoonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke="#7E88C3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const SunIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" stroke="#858BB2" strokeWidth="2" />
      <path
        d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke="#858BB2"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f8fb] dark:bg-[#141625] transition-colors duration-300">
      {/* ── Mobile: horizontal top bar ── */}
      <header className="md:hidden flex items-center justify-between bg-[#373B53] dark:bg-[#1e2139] h-[72px] px-0 sticky top-0 z-30">
        {/* Logo block */}
        <div className="w-[72px] h-[72px] bg-[#7c5dfa] rounded-br-2xl flex items-center justify-center flex-shrink-0">
          <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
        </div>

        {/* Right controls */}
        <div className="flex items-center">
          <button
            onClick={() => setIsDark((d) => !d)}
            className="bg-transparent border-none cursor-pointer p-4"
            aria-label="Toggle dark mode"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <div className="w-px h-8 bg-[#494E6E]" />
          <img
            src={profilePic}
            alt="profile"
            className="w-8 h-8 rounded-full object-cover mx-4"
          />
        </div>
      </header>

      {/* ── Tablet/Desktop: vertical sidebar ── */}
      <aside className="hidden md:flex w-[72px] flex-col items-center bg-[#373B53] dark:bg-[#1e2139] rounded-tr-[20px] rounded-br-[20px] flex-shrink-0 sticky top-0 h-screen z-30">
        <div className="w-[72px] h-[72px] bg-[#7c5dfa] rounded-tr-[20px] flex items-center justify-center flex-shrink-0">
          <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
        </div>
        <div className="flex flex-col items-center mt-auto">
          <button
            onClick={() => setIsDark((d) => !d)}
            className="bg-transparent border-none cursor-pointer p-0 mb-6 flex items-center justify-center"
            aria-label="Toggle dark mode"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <hr className="w-full border-[#494E6E]" />
          <img
            src={profilePic}
            alt="profile"
            className="my-6 w-8 h-8 rounded-full object-cover"
          />
        </div>
      </aside>

      {/* Page content */}
      <div className="flex-1 min-w-0">
        <Routes>
          <Route path="/" element={<Invoices />} />
          <Route path="/invoice/:id" element={<InvoiceDetail />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
