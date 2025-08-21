import { sql } from "../config/db.js";

export async function getTransactionsByUserID(req, res) {
    try {
        const { userID } = req.params;
        const transactions = await sql`
            SELECT * FROM Transactions WHERE user_id = ${userID} ORDER BY created_at DESC
        `;
        res.status(200).json(transactions);
    } catch (error) {
        console.log('Error getting transactions:', error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export async function createTransaction(req, res) {

        try {
           const{title, amount, category, user_id} = req.body;
           if (!title || amount===undefined || !category || !user_id) {
                return res.status(400).json({ message: "All fields are required." });
            }

            const transaction = await sql`
            INSERT INTO Transactions (user_id, title, amount, category)
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
            `;

            console.log(transaction);
            res.status(201).json(transaction[0]);

        } catch (error) {
            console.log('Error creating transaction:', error);
            res.status(500).json({ message: "Internal server error." });
        }
    }

    export async function deleteTransaction(req, res) {

            try {
                const { id } = req.params;

                if(isNaN(parseInt(id))) {
                    return res.status(400).json({ message: "Invalid transaction ID." });
                }

                const result = await sql`
                DELETE FROM Transactions WHERE id = ${id} RETURNING *`;

                if (result.length === 0) {
                    return res.status(404).json({ message: "Transaction not found." });
                }

                res.status(200).json({ message: "Transaction deleted successfully." });
            } catch (error) {
                console.log('Error deleting transaction:', error);
                res.status(500).json({ message: "Internal server error." });
            }
        }

export async function getTransactionSummary(req, res) {

    try {
        const { userID } = req.params;

        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS Balance FROM Transactions WHERE user_id = ${userID}
        `;
        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS Income FROM Transactions WHERE user_id = ${userID} AND amount > 0
        `;
        const expensesResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS Expenses FROM Transactions WHERE user_id = ${userID} AND amount < 0
        `;

        res.status(200).json({
            Balance: balanceResult,
            Income: incomeResult,
            Expenses: expensesResult
        })

    } catch (error) {
        console.log('Error getting transaction summary:', error);
        res.status(500).json({ message: "Internal server error." });
    }
}