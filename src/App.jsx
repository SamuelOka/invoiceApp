import logo from "./assets/logo.png";
import darkmode from "./assets/darkmode.png";
import profilePic from "./assets/profilePic.png";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import Invoices from "./Invoices";
import InvoiceDetail from "./invoiceDetails";

function App() {
  return (
    <div className="flex relative">
      <div className="h-[100vh] static left-0 w-fit rounded-tr-[20px] bg-[#373B53] flex flex-col justify-between">
        <img src={logo} alt="" />
        <div>
          <button className="bg-transparent w-fit mx-[40px]">
            <img src={darkmode} alt="" />
          </button>
          <hr className="my-[24px] text-[#494E6E]" />
          <img className="mb-[24px] mx-auto" src={profilePic} alt="" />
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Invoices />} />
        <Route path="/invoice/:id" element={<InvoiceDetail />} />
      </Routes>
    </div>
  );
}

export default App;
