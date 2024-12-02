const express = require("express");
const {
	addBankAccount,
	getBankAccounts,
	transferMoney,
} = require("../controllers/bankAccountController");
// const bankAccount = require("../models/accounts");

//router object
const router = express.Router();

router.post("/add", addBankAccount);
router.get("/list", getBankAccounts);
router.post("/transfer", transferMoney);

module.exports = router;
