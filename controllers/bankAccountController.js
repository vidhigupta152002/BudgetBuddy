const bankAccount = require("../models/bankAccountModel");
const accountsModel = require("../models/accounts");

// Add a new bank account
const addBankAccount = async (req, res) => {
	// try {
	// 	const { name, accountNumber } = req.body;
	// 	const newAccount = new bankAccount({ name, accountNumber });
	// 	await newAccount.save();
	// 	res
	// 		.status(201)
	// 		.json({ message: "Bank account added successfully", newAccount });
	// } catch (error) {
	// 	res.status(500).json({ message: "Error adding bank account", error });
	// }
	try {
		const newAccounts = new bankAccount(req.body);
		await newAccounts.save();
		res.status(201).send("Bank Account Added");
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

// Get all bank accounts
const getBankAccounts = async (req, res) => {
	// try {
	// 	const accounts = await bankAccount.find();
	// 	res.status(200).json(accounts);
	// } catch (error) {
	// 	res.status(500).json({ message: "Error fetching bank accounts", error });
	// }
	try {
		const { userid } = req.query;
		const accounts = await bankAccount.find(
			{ userid }
			// 	{
			// 	userid: req.body.userid,
			// }
		);
		res.status(200).json(accounts);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

const transferMoney = async (req, res) => {
	try {
		const { userid, fromAccount, toAccount, amount } = req.body;

		if (!userid || !fromAccount || !toAccount || !amount) {
			return res.status(400).json({ message: "Invalid input" });
		}

		const sourceAccount = await bankAccount.findOne({
			userid,
			accountNumber: fromAccount,
		});
		const targetAccount = await bankAccount.findOne({
			userid,
			accountNumber: toAccount,
		});

		if (!sourceAccount || !targetAccount) {
			return res.status(404).json({ message: "Account not found" });
		}




		// const transactions = await accountsModel.find({
		// 	via: fromAccount,
		// });
		// const totalIncome = transactions
		// 	.filter((t) => t.category === "income")
		// 	.reduce((sum, t) => sum + t.amount, 0);

		// const totalExpense = transactions
		// 	.filter((t) => t.category === "expense")
		// 	.reduce((sum, t) => sum + t.amount, 0);

		// const currentBalance = sourceAccount.balance + totalIncome - totalExpense;
		// console.log(currentBalance);

		// // Check if the balance is sufficient
		// if (Number(currentBalance) < Number(amount)) {
		// 	return res
		// 		.status(400)
		// 		.json({ message: "Insufficient balance in source account" });
		// }



		if (sourceAccount.balance < amount) {
			return res
				.status(400)
				.json({ message: "Insufficient balance in source account" });
		}

		sourceAccount.balance -= amount;
		targetAccount.balance += amount;

		const fromTransaction = new accountsModel({
			userid,
			type: "expense",
			category: "Bank Transfer",
			via: fromAccount,
			date: new Date(),
			amount,
			description: `Transfer to ${targetAccount.name} (${targetAccount.accountNumber})`,
		});

		const toTransaction = new accountsModel({
			userid,
			type: "income",
			category: "Bank Transfer",
			via: toAccount,
			date: new Date(),
			amount,
			description: `Transfer from ${sourceAccount.name} (${sourceAccount.accountNumber})`,
		});

		await fromTransaction.save();
		await toTransaction.save();
		await sourceAccount.save();
		await targetAccount.save();

		res.status(200).json({ message: "Transfer successful" });
	} catch (error) {
		console.error("Error during transfer:", error);
		res.status(500).json({ message: "Transfer failed" });
	}
};

module.exports = { addBankAccount, getBankAccounts, transferMoney };
