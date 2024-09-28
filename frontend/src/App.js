import React, { useState, useEffect } from "react";
import "./App.css";
import PdfTemplate from "./Components/PdfTemplate";
import InvoiceList from "./Components/InvoiceList"; // Import InvoiceList
import ChallanTemplate from "./Components/ChallanTemplate"; // Make sure this import exists

function App() {
  const [InvoiceNumber, setInvoiceNumber] = useState("");
  const [CompanyName, setCompanyName] = useState("");
  const [CareOf, setCareOf] = useState("");
  const [Contact, setContact] = useState("");
  const [Dates, setDates] = useState("");
  const [view, setView] = useState(true);
  const [challanView, setChallanView] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceList, setInvoiceList] = useState([]); // State to hold list of invoices
  const [showInvoiceList, setShowInvoiceList] = useState(false); // State to show invoice list

  useEffect(() => {
    const current = new Date();
    const date = `${current.getDate()}/${
      current.getMonth() + 1
    }/${current.getFullYear()}`;
    console.log(`Date is ${date}`);
    setDates(date);
  }, []);

  const createInvoice = () => {
    setView(false);
  };

  const createChallan = () => {
    setChallanView(true);
  };

  const handleSelectInvoice = (invoice) => {
    setInvoiceNumber(invoice.InvoiceNumber);
    setCompanyName(invoice.CompanyName);
    setCareOf(invoice.CareOf);
    setContact(invoice.Contact);
    setDates(invoice.date.split("T")[0]); // Adjust date format if needed
    setView(false); // Open the PDF view
    setChallanView(false);
    setShowInvoiceList(false); // Close invoice list when an invoice is selected
  };

  const handleViewInvoices = () => {
    setShowInvoiceList(true);
    setView(false);
    setChallanView(false);
  };

  return (
    <>
      {showInvoiceList ? (
        <InvoiceList onSelectInvoice={handleSelectInvoice} />
      ) : view && !challanView ? (
        <div className="flex items-center justify-center min-h-screen ">
          <div className="p-4 flex flex-col items-center bg-white shadow-md rounded-lg w-full max-w-md">
            <div className="text-center mb-6 bg-sky-900">
              <h1
                className="mt-4 text-7xl font-bold "
                style={{ color: "#325aa8" }}
              >
                <strong style={{ color: "#ff6600" }}>FH </strong>
                <span style={{ color: "#97c723" }}>Advertisers</span>
              </h1>

              <div style={{ color: "#b0a9ab", fontSize: "18px" }}>
                <span>We play with </span>
                <span style={{ color: "#ffcc00" }}>c</span>
                <span style={{ color: "#ff3300" }}>o</span>
                <span style={{ color: "#66cc00" }}>l</span>
                <span style={{ color: "#0099ff" }}>o</span>
                <span style={{ color: "#cc33ff" }}>u</span>
                <span style={{ color: "#ff6699" }}>r</span>
                <span style={{ color: "#00cc99" }}>s</span>
              </div>
              <p className="text-5xl font-bold mb-2">Invoice Generator</p>
              <h3 className="text-xl text-gray-900">
                Welcome <br /> Farzand Ali Tahir
              </h3>
            </div>
            <div className="justify-center text-center mb-4 flex flex-col">
              <input
                type="text"
                placeholder="Invoice ID"
                value={InvoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-4 py-2 border text-black border-gray-900 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Company"
                value={CompanyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 border text-black border-gray-900 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="C/O"
                value={CareOf}
                onChange={(e) => setCareOf(e.target.value)}
                className="w-full px-4 py-2 border text-black border-gray-900 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Contact"
                value={Contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-4 py-2 border text-black border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-center text-center space-x-4 ">
              <button
                onClick={createInvoice}
                className="bg-blue-500 text-black py-2 px-4 rounded-lg transition duration-200"
              >
                Generate Challan ➡️
              </button>
              <button
                onClick={createChallan}
                className="bg-green-500 text-black py-2 px-4 rounded-lg transition duration-200 ms-5"
              >
                Generate Invoice ➡️
              </button>
              <button
                onClick={handleViewInvoices}
                className="bg-yellow-500 text-black py-2 px-4 rounded-lg transition duration-200 ms-5"
              >
                View Invoices ➡️
              </button>
            </div>
          </div>
        </div>
      ) : view ? (
        <PdfTemplate
          InvoiceNumber={InvoiceNumber}
          CompanyName={CompanyName}
          CareOf={CareOf}
          Contact={Contact}
          Dates={Dates}
          setView={setView}
        />
      ) : (
        <ChallanTemplate
          InvoiceNumber={InvoiceNumber}
          CompanyName={CompanyName}
          CareOf={CareOf}
          Contact={Contact}
          Dates={Dates}
          setView={setView}
          setChallanView={setChallanView}
        />
      )}
    </>
  );
}

export default App;