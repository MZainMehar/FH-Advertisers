// routes/pdfRoutes.js
import express from 'express';
import {
  createPdf,
  getAllPdfs,
  getPdfById,
  updatePdf,
  deletePdf,
} from '../controllers/pdfController.js';

const router = express.Router();

router.post('/', createPdf);
router.get('/', getAllPdfs);
router.get('/:id', getPdfById);
router.put('/:id', updatePdf);
router.delete('/:id', deletePdf);

export default router;
