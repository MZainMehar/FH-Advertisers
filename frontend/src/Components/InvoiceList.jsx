// Components/InvoiceList.js
import React, { useEffect, useState } from "react";

const InvoiceList = ({ onSelectInvoice }) => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pdfs");
        if (!response.ok) throw new Error("Failed to fetch invoices");
        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">List of Invoices</h2>
      <ul className="w-full max-w-md">
        {invoices.map((invoice) => (
          <li
            key={invoice._id}
            className="flex justify-between items-center p-2 border-b cursor-pointer hover:bg-gray-100"
            onClick={() => onSelectInvoice(invoice)}
          >
            <span>{invoice.InvoiceNumber}</span>
            <span>{invoice.date.split("T")[0]}</span> {/* Format date */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvoiceList;
