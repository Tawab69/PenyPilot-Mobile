import express from 'express';
import {createTransaction, deleteTransaction, getTransactionsByUserID, getTransactionSummary} from '../controllers/transactionsController.js';

const router = express.Router();

// Routes for transaction management
router.get("/:userID", getTransactionsByUserID);

// Create a new transaction
router.post("/", createTransaction);

// Delete an existing transaction
router.delete("/:id", deleteTransaction);

// Get transaction summary for a user
router.get("/summary/:userID", getTransactionSummary);

export default router;