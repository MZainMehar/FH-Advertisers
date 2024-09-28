// models/PdfModel.js
import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true },
  date: { type: Date, required: true },
  companyName: { type: String, required: true },
  careOf: { type: String, required: true },
  contact: { type: String, required: true },
  items: [
    {
      product: { type: String, required: true },
      packsize: { type: String, required: true },
      amount: { type: Number, required: true },
      quantity: { type: Number, required: true },
      finishing: { type: [String], required: true },
    },
  ],
  process: { type: Number, default: 0 },
  gst: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
}, { timestamps: true });

export const PdfModel = mongoose.model('Pdf', pdfSchema);
