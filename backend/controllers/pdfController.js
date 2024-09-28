// controllers/pdfController.js
import { PdfModel } from '../models/PdfModel.js';

export const createPdf = async (req, res) => {
    try {
      console.log(req.body);  // Log request body to check the data
      const pdfData = new PdfModel(req.body);
      const savedPdf = await pdfData.save();
      res.status(201).json(savedPdf);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

export const getAllPdfs = async (req, res) => {
  try {
    const pdfs = await PdfModel.find();
    res.status(200).json(pdfs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPdfById = async (req, res) => {
  try {
    const pdf = await PdfModel.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }
    res.status(200).json(pdf);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePdf = async (req, res) => {
  try {
    const pdf = await PdfModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }
    res.status(200).json(pdf);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePdf = async (req, res) => {
  try {
    const pdf = await PdfModel.findByIdAndDelete(req.params.id);
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }
    res.status(204).json({ message: 'PDF deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
