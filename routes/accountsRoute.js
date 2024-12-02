const express = require("express");
const {
	addAccounts,
	getAllAccounts,
	editAccounts,
	deleteAccounts,
	exportTransactionsToCSV,
	getTransactions,
	getTransactionsByDate,
	getCategoryWiseSpending,
	getBankBalances,
} = require("../controllers/accountsController");

const router = express.Router();

router.post("/add-accounts", addAccounts);

router.post("/edit-accounts", editAccounts);

router.post("/delete-accounts", deleteAccounts);

router.post("/get-accounts", getAllAccounts);

router.get("/export", exportTransactionsToCSV);

router.get("/transfer", getTransactions);

router.get("/date", getTransactionsByDate);

router.get("/category-wise", getCategoryWiseSpending);

router.get("/bank-balances", getBankBalances);

module.exports = router;
