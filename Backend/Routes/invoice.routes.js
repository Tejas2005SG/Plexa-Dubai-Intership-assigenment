import express from "express";
import { fetchInvoices } from "../Controller/invoice.controller.js";
// import { protect } from "../middleware/authMiddleware.js";  // Assuming a JWT auth middleware

const router = express.Router();

router.get("/all", fetchInvoices); // Route to fetch all invoices for logged-in user

export default router;
