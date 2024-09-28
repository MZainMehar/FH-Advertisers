import ReactPrint from "react-to-print";
import { useRef, useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Close } from "@mui/icons-material";
import Barcode from "react-barcode";
// import { FaTrashAlt as DeleteIcon, FaEdit as EditIcon } from "react-icons/fa";

function PdfTemplate(props) {
  const ref = useRef();
  const [openAirPopup, setAirPopup] = useState(false);
  const [Item, setItem] = useState("");
  const [Packsize, setPacksize] = useState("");
  const [Amount, setAmount] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [List, setList] = useState([]);

  const [Gst, setGst] = useState("");
  const [Process, setProcess] = useState("");
  const [Balance, setBalance] = useState("");
  const [TotalAmount, setTotalAmount] = useState("");

  const [finishingOptions, setFinishingOptions] = useState({
    M: false,
    SP: false,
    E: false,
    P: false,
    S: false,
  });
  const [selectedFinishing, setSelectedFinishing] = useState([]);

  const [editIndex, setEditIndex] = useState(null); // State for editing item

  const saveInvoiceToDB = async () => {
    const invoiceData = {
      invoiceNumber: props.InvoiceNumber,  // Changed field to match schema
      date: new Date(props.date.split("/").reverse().join("-")),
      companyName: props.CompanyName,  // Changed field to match schema
      careOf: props.CareOf,  // Changed field to match schema
      contact: props.Contact,
      items: List,  // Assuming 'List' is structured properly
      gst: Gst,
      process: Process,
      balance: Balance,
      totalAmount: TotalAmount,
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/pdfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });
  
      if (response.ok) {
        console.log("Invoice saved to DB");
      } else {
        console.log("Failed to save invoice to DB");
      }
    } catch (error) {
      console.error("Failed to save invoice to DB", error);
    }
  };
  


  const addData = () => {
    if (editIndex !== null) {
      // Update existing item
      const updatedList = List.map((item, index) =>
        index === editIndex
          ? {
              ...item,
              product: Item,
              packsize: Packsize,
              amount: Amount,
              quantity: Quantity,
              finishing: selectedFinishing,
            }
          : item
      );
      setList(updatedList);
      setEditIndex(null); // Reset editIndex after update
    } else {
      // Add new item
      setList([
        ...List,
        {
          product: Item,
          packsize: Packsize,
          amount: Amount,
          quantity: Quantity,
          finishing: selectedFinishing,
        },
      ]);
    }

    // Clear form fields
    setItem("");
    setPacksize("");
    setAmount("");
    setQuantity("");
    setSelectedFinishing([]);
    setFinishingOptions({
      M: false,
      SP: false,
      E: false,
      P: false,
      S: false,
    });
    setAirPopup(false);
  };

  const deleteItem = (index) => {
    setList(List.filter((_, i) => i !== index));
  };

  const editItem = (index) => {
    const item = List[index];
    setItem(item.product);
    setPacksize(item.packsize);
    setAmount(item.amount);
    setQuantity(item.quantity);
    setSelectedFinishing(item.finishing);
    setEditIndex(index);
    setAirPopup(true);
  };

  const handleCheckboxChange = (option) => {
    setFinishingOptions((prev) => {
      const updatedOptions = { ...prev, [option]: !prev[option] };
      const selected = Object.keys(updatedOptions).filter(
        (key) => updatedOptions[key]
      );
      setSelectedFinishing(selected);
      return updatedOptions;
    });
  };

  useEffect(() => {
    const processAmount = parseFloat(Process) || 0;
    const balance = parseFloat(Balance) || 0;
    const gstPercentage = parseFloat(Gst) || 0;

    const totalSum =
      List.reduce(
        (acc, item) =>
          acc + parseFloat(item.amount) * parseFloat(item.quantity),
        0
      ) + processAmount;

    const gstAmount = (totalSum * gstPercentage) / 100;

    const total = totalSum + gstAmount - balance;

    setTotalAmount(total.toFixed(2));
  }, [List, Process, Gst, Balance]);

  return (
    <>
      <style>
        {`
          @media print {
            .action-column {
              display: none;
            }
          }
        `}
      </style>

      <div className="a4-container" ref={ref}>
        <div className="button-container text-center justify-center mt-1 mb-1 ">
          <ReactPrint
            trigger={() => (
              <button className="px-4 text-bold py-0 border-black text-black rounded">
                Print
              </button>
            )}
            content={() => ref.current}
            documentTitle={`INVOICE ${props.InvoiceNumber}`}
          />
          <button
            onClick={() => setAirPopup(true)}
            className="ms-2 px-4 py-0 bg-green-500 text-black rounded hover:bg-green-600 transition border-2"
          >
            Add
          </button>
          <button
            onClick={saveInvoiceToDB}
            className="ms-2 px-4 py-0 bg-blue-500 text-black rounded hover:bg-blue-600 transition border-2"
          >
            Save
          </button>
        </div>

        <div className="container">
          <div className="row">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <h1>
                <strong style={{ color: "#000000" }}>FH </strong>
                <span style={{ color: "#000000" }}>Advertisers</span>
                <div className="col-md-4 brcode">
                  <Barcode
                    value={`4n%${props.InvoiceNumber}+ut%`}
                    width={1}
                    height={40}
                    displayValue={false}
                  />
                </div>
              </h1>

              <div style={{ color: "", fontSize: "15px" }}>
                <span>fha4580@gmail.com </span>
                <br />
                <span>(+92)3340019997</span>
                <br />
                <span>(+92)3214824580</span>
              </div>
            </div>
            <div>
              <div className="col-md-12">
                <div className="row">
                  <div>
                    <p></p>
                    <span>
                      <b>Invoice ID : </b> {props.InvoiceNumber} <br />
                    </span>{" "}
                    <b>Invoice Issue Date :</b> {props.date} <br />
                    <b>Company Name : </b> {props.CompanyName}
                    <br />
                    <b>C/O : </b> {props.CareOf}
                    <br />
                    <b>Contact : </b> {props.Contact}
                  </div>
                </div>
                <br />
                <div className="heading-container">
                  <h2 className="invoice-heading">INVOICE </h2>
                </div>
                <div>
                  <table className="table bordered-table ">
                    <thead>
                      <tr>
                        <th>
                          <h6>Sr.#</h6>
                        </th>
                        <th>
                          <h6>PRODUCTS</h6>
                        </th>
                        <th>
                          <h6>FINISHING</h6>
                        </th>
                        <th>
                          <h6>PACK SIZE</h6>
                        </th>
                        <th>
                          <h6>UC. QTY</h6>
                        </th>
                        <th>
                          <h6>RATE</h6>
                        </th>
                        <th>
                          <h6>AMOUNT</h6>
                        </th>
                        <th className="action-column">
                          <h6>Action</h6>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {List.length
                        ? List.map((items, index) => {
                            const total = items.amount * items.quantity;
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="">{items.product}</td>
                                <td className="">
                                  {items.finishing.join(", ")}
                                </td>
                                <td className="">{items.packsize}</td>
                                <td className="">{items.quantity}</td>
                                <td className="">
                                  <i
                                    className="fas fa-rupee-sign"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  {items.amount}
                                </td>
                                <td className="">
                                  <i
                                    className="fas fa-rupee-sign"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  {total}
                                </td>
                                <td className="action-column">
                                  <button
                                    onClick={() => editItem(index)}
                                    className="relative flex items-center justify-center px-1 py-1"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteItem(index)}
                                    className="relative flex items-center justify-center px-1 py-1 ms-2"
                                  >
                                    Dlete
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        : null}
                    </tbody>
                  </table>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginRight: "5px",
                  }}
                >
                  <div className="flex justify-between">
                    {/* <!-- Details Section --> */}
                    <div className="flex flex-col " style={{ lineHeight: "0" }}>
                      <p>
                        <b>Total :</b>{" "}
                        <span>
                          <i className="fas fa-rupee-sign"></i>{" "}
                          {List.reduce(
                            (acc, item) =>
                              acc +
                              parseFloat(item.amount) *
                                parseFloat(item.quantity),
                            0
                          ).toFixed(2)}
                        </span>
                      </p>
                      <hr />
                      <p>
                        <b>Process :</b>{" "}
                        <span>
                          <i className="fas fa-rupee-sign"></i> {Process}
                        </span>
                      </p>
                      <hr />
                      <p>
                        <b>G. Sale's Tax % :</b>{" "}
                        <span>
                          <i className="fas fa-rupee-sign"></i> {Gst}
                        </span>
                      </p>

                      <hr />
                      <p>
                        <b>Advance :</b>{" "}
                        <span>
                          <i className="fas fa-rupee-sign"></i> {Balance}
                        </span>
                      </p>
                      <hr />
                      <p>
                        <b>Total Amount :</b>{" "}
                        <span>
                          <i className="fas fa-rupee-sign"></i> {TotalAmount}
                        </span>
                      </p>
                      <hr />
                    </div>
                  </div>
                </div>
                {/* <!-- Signature Section --> */}
                <div className="flex flex-col justify-start w-1/2">
                  <p className="font-bold">
                    Signature : ________________________
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* <p className="border-b text-center justify-center border-black">
            Digitally produced slip
          </p> */}
          <p className="border-b text-center justify-center border-black">
            Note: The <span className="font-bold">Total Amount</span> reflects
            the remaining balance after deducting the advance payment.
          </p>
        </div>
        <Dialog open={openAirPopup}>
          <DialogTitle>
            <div className="title">
              <div className="icon-cross" onClick={() => setAirPopup(false)}>
                <Close />
              </div>
              <div className="hed">New product</div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="container">
              <div className="forms">
                <label className="form-label ">PRODUCT</label>
                <input
                  type="text"
                  value={Item}
                  onChange={(e) => setItem(e.target.value)}
                  placeholder="Product Name"
                />
                <label className="form-label">PACK SIZE</label>
                <input
                  type="text"
                  value={Packsize}
                  onChange={(e) => setPacksize(e.target.value)}
                  placeholder="Pack Size"
                />
                <label className="form-label ms-3"> UC. QTY</label>
                <input
                  type="number"
                  value={Quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="UC.Qty  "
                />
                <label className="form-label ms-4">RATE</label>
                <input
                  type="number"
                  value={Amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Rate"
                />
              </div>

              <div className="mt-3 mb-3 ">
                <h5>Finishing Options</h5>
                <div className="finishing-checkboxes ">
                  {Object.keys(finishingOptions).map((option) => (
                    <label key={option} className="finishing-checkbox-label ">
                      <input
                        type="checkbox"
                        className="finishing-checkbox "
                        checked={finishingOptions[option]}
                        onChange={() => handleCheckboxChange(option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-2 text-center">
                <button onClick={addData}>Add Product</button>
              </div>
              <hr></hr>
              <DialogTitle>
                <div className="title">
                  <div className="hed">Amount Section</div>
                </div>
              </DialogTitle>
              <div className="forms">
                <label className="form-label">G. SAlE's TAX</label>
                <input
                  type="text"
                  value={Gst}
                  onChange={(e) => setGst(e.target.value)}
                  placeholder="G.Sale's tax %"
                />
                <label className="form-label">PROCESS</label>
                <input
                  type="text"
                  value={Process}
                  onChange={(e) => setProcess(e.target.value)}
                  placeholder="Process fee"
                />
                <label className="form-label">BALANCE ADVANCE</label>
                <input
                  type="text"
                  value={Balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="Balance"
                />
                <div className="justify-center text-center">
                  <button className="" onClick={() => setAirPopup(false)}>
                    OK
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default PdfTemplate;
