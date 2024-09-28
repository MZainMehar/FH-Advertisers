import express from 'express';  
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // Import the cors package
import pdfRoutes from './routes/pdfRoutes.js';

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.log(err);
});

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());
const port = 5000;

app.use('/api/pdfs', pdfRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Basic Node.js Server!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
      success: false,
      message,
      statusCode,
  });
});
