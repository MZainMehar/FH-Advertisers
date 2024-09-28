import ReactPrint from "react-to-print";
import { useRef, useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Close } from "@mui/icons-material";
import Barcode from "react-barcode";

function ChallanTemplate(props) {
  const ref = useRef();
  const [openAirPopup, setAirPopup] = useState(false);

  const [Item, setItem] = useState("");
  const [Packsize, setPacksize] = useState("");
  const [Amount, setAmount] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [Label, setLabel] = useState("");
  const [GMS, setGMS] = useState(""); // New state for GMS

  const [Tables, setTables] = useState([[]]); // List of tables, each containing a list of products

  const addData = () => {
    // Add new product to the current table
    setTables((prevTables) => {
      const updatedTables = [...prevTables];
      updatedTables[updatedTables.length - 1] = [
        ...updatedTables[updatedTables.length - 1],
        {
          product: Item,
          packsize: Packsize,
          amount: Amount,
          quantity: Quantity,
          label: Label,
          gms: GMS, // Add GMS to the product data
        },
      ];
      setItem("");
      setPacksize("");
      setAmount("");
      setQuantity("");
      setLabel("");
      setGMS(""); // Reset GMS
      setAirPopup(false);
      return updatedTables;
    });
  };

  const startNewTable = () => {
    // Add a new table to the list
    setTables((prevTables) => [...prevTables, []]);
  };

  const deleteItem = (tableIndex, itemIndex) => {
    setTables((prevTables) => {
      const updatedTables = [...prevTables];
      updatedTables[tableIndex] = updatedTables[tableIndex].filter(
        (_, i) => i !== itemIndex
      );
      return updatedTables;
    });
  };

  const calculateTotals = (table) => {
    const totalCarton = table.reduce(
      (acc, item) => acc + parseFloat(item.amount || 0),
      0
    );
    const totalUCQty = table.reduce(
      (acc, item) => acc + parseFloat(item.quantity || 0),
      0
    );
    const totalLabels = table.reduce(
      (acc, item) => acc + parseFloat(item.label || 0),
      0
    );
    const totalUCQtyCarton = table.reduce(
      (acc, item) => acc + parseFloat(item.amount) * parseFloat(item.quantity),
      0
    );
    return { totalCarton, totalUCQty, totalLabels, totalUCQtyCarton };
  };

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
        <div className="button-container text-center">
          <ReactPrint
            trigger={() => (
              <button className="px-4 text-bold py-2 border-black text-black rounded">
                Print
              </button>
            )}
            content={() => ref.current}
            documentTitle={`CHALLAN ${props.InvoiceNumber}`}
          />
          <button
            onClick={() => setAirPopup(true)}
            className="ms-2 px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600 transition"
          >
            Add Product
          </button>
          <button
            onClick={startNewTable}
            className="ms-2 px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 transition"
          >
            New Table
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
              <div style={{ color: "#000000", fontSize: "15px" }}>
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
                    <p>
                      <span>
                        <b>Challan ID :</b> {props.InvoiceNumber}
                      </span>{" "}
                    </p>
                    <b> Challan Issue Date :</b> {props.date} <br />
                    <b>Company Name : </b> {props.CompanyName}
                    <br />
                    <b>C/O : </b> {props.CareOf}
                    <br />
                    <b>Contact : </b> {props.Contact}
                  </div>
                </div>
                <br />
                <div className="heading-container">
                  <h2 className="invoice-heading">DELIVERY CHALLAN</h2>
                </div>
                {Tables.map((table, tableIndex) => (
                  <div key={tableIndex} className="table-container">
                    <table className="table bordered-table">
                      <thead className="">
                        <tr>
                          <th>
                            <h6>Sr.#</h6>
                          </th>
                          <th>
                            <h6>GMS</h6> {/* Add GMS column header */}
                          </th>
                          <th>
                            <h6>PRODUCTS</h6>
                          </th>
                          <th>
                            <h6>PACK SIZE</h6>
                          </th>
                          <th>
                            <h6>UC. QTY</h6>
                          </th>
                          <th>
                            <h6>CARTON</h6>
                          </th>
                          <th>
                            <h6>UC QTY.</h6>
                          </th>
                          <th>
                            <h6>LABELS</h6>
                          </th>
                          <th className="action-column">
                            <h6>Action</h6>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="justify-center text-center">
                        {table.length
                          ? table.map((items, index) => {
                              const total =
                                parseFloat(items.amount) *
                                parseFloat(items.quantity);
                              return (
                                <tr key={index} className="text-center">
                                  <td>{index + 1}</td>
                                  <td>{items.gms}</td> {/* Display GMS data */}
                                  <td>{items.product}</td>
                                  <td>{items.packsize}</td>
                                  <td>{items.quantity}</td>
                                  <td>
                                    <i
                                      className="fas fa-rupee-sign"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    {items.amount}
                                  </td>
                                  <td>
                                    <i
                                      className="fas fa-rupee-sign"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    {total}
                                  </td>
                                  <td>{items.label}</td>
                                  <td className="action-column">
                                    <button
                                      onClick={() =>
                                        deleteItem(tableIndex, index)
                                      }
                                      className="relative flex items-center justify-center px-1 py-1"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          : null}
                        {table.length ? (
                          <tr className="text-center">
                            <td colSpan="3" className="text-center">
                              <strong>Total:</strong>
                            </td>
                            <td>
                              <i
                                className="fas fa-rupee-sign"
                                aria-hidden="true"
                              ></i>
                              {/* {totalUCQty} */}
                            </td>
                            <td>
                              <i
                                className="fas fa-rupee-sign"
                                aria-hidden="true"
                              ></i>
                              {/* {totalLabels} */}
                            </td>
                            <td>
                              <i
                                className="fas fa-rupee-sign"
                                aria-hidden="true"
                              ></i>{" "}
                              <strong>
                                {calculateTotals(table).totalCarton}
                              </strong>
                            </td>
                            <td>
                              <i
                                className="fas fa-rupee-sign"
                                aria-hidden="true"
                              ></i>{" "}
                              <strong>
                                {calculateTotals(table).totalUCQtyCarton}
                              </strong>
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={openAirPopup}>
        <DialogTitle>
          <div className="title">
            <div className="hed">New product</div>
            <div className="icon-cross" onClick={() => setAirPopup(false)}>
              <Close />
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="container">
            <div className="forms">
              <input
                type="text"
                value={Item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="Product Name"
              />
              <input
                type="text"
                value={Packsize}
                onChange={(e) => setPacksize(e.target.value)}
                placeholder="Pack Size"
              />
              <input
                type="number"
                value={Quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="UC QTY."
              />
              <input
                type="number"
                value={Amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Carton"
              />
              <input
                type="number"
                value={Label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Label"
              />
              <input
                type="text"
                value={GMS}
                onChange={(e) => setGMS(e.target.value)}
                placeholder="GMS"
              />{" "}
              {/* Add input for GMS */}
            </div>
            <div className="mt-2 text-center">
              <button onClick={addData}>Add Product</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ChallanTemplate;
