const mongoose = require("mongoose");
const bankAccountSchema = new mongoose.Schema(
	{
		userid: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		accountNumber: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamp: true }
);

const bankAccount = mongoose.model("BankAccount", bankAccountSchema);
module.exports = bankAccount;
