//moment is used to get dates in a format such that they can be filtered
const moment = require("moment");
const accountsModel = require("../models/accounts");
const json2csv = require("json2csv").parse;

const getAllAccounts = async (req, res) => {
	try {
		const { frequency, selectedDate, type } = req.body;
		const accounts = await accountsModel.find({
			//...frequency-> saara frequency data expect kr rhe h, and then uspe consitions check kr rhe h
			...(frequency !== "custom"
				? {
						date: {
							$gt: moment().subtract(Number(frequency), "d").toDate(),
						},
				  }
				: {
						date: {
							$gte: selectedDate[0],
							$lte: selectedDate[1],
						},
				  }),
			userid: req.body.userid,
			...(type !== "all" && { type }),
		});
		res.status(200).json(accounts);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

const editAccounts = async (req, res) => {
	try {
		await accountsModel.findOneAndUpdate(
			{ _id: req.body.transactionId },
			req.body.payload
		);
		res.status(200).send("Edit Successful");
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

const deleteAccounts = async (req, res) => {
	try {
		await accountsModel.findOneAndDelete({ _id: req.body.transactionId });
		res.status(200).send("Transaction Deleted");
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

const addAccounts = async (req, res) => {
	try {
		const newAccounts = new accountsModel(req.body);
		await newAccounts.save();
		res.status(201).send("Account Added");
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

const exportTransactionsToCSV = async (req, res) => {
	try {
		const { userid, startDate, endDate } = req.query;

		const start = moment(startDate).startOf("day"); //"start of the day" means the time portion is set to 00:00:00.000
		const end = moment(endDate).endOf("day");

		const transactions = await accountsModel.find({
			userid,
			date: { $gte: start, $lte: end },
		});

		const csv = json2csv(transactions);

		res.header("Content-Type", "text/csv");
		res.attachment("transactions.csv");
		res.send(csv);
	} catch (error) {
		console.error("Error exporting transactions:", error);
		res.status(500).json({ error: "Failed to export transactions" });
	}
};

const getTransactions = async (req, res) => {
	const { userid } = req.query;

	try {
		const transactions = await accountsModel
			.find({ userid })
			.sort({ date: -1 });
		res.status(200).json(transactions);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error fetching transactions" });
	}
};

const getTransactionsByDate = async (req, res) => {
	try {
		const { userid } = req.query;
		const transactions = await accountsModel.aggregate([
			{
				$match: { userid, type: "expense", category: { $ne: "Bank Transfer" } },
			},
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
					totalSpent: { $sum: "$amount" },
				},
			},
			{ $sort: { _id: 1 } },
		]);

		res.json(transactions);
	} catch (error) {
		res.status(500).json({ message: "Error fetching transactions", error });
	}
};

const getCategoryWiseSpending = async (req, res) => {
	try {
		const { userid } = req.query;
		const categorySpending = await accountsModel.aggregate([
			{
				$match: { userid, type: "expense", category: { $ne: "Bank Transfer" } },
			}, 
			{
				$group: {
					_id: "$category", 
					totalSpent: { $sum: "$amount" }, 
				},
			},
			{ $sort: { totalSpent: -1 } }, 
		]);

		res.json(categorySpending);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching category-wise spending", error });
	}
};

const getBankBalances = async (req, res) => {
	try {
		
		const { userid } = req.query; 
		const balances = await accountsModel.aggregate([
			{ $match: { userid } },
			{
				$group: {
					_id: "$via", 
					totalIncome: {
						$sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
					},
					totalExpense: {
						$sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
					},
				},
			},
			{
				$project: {
					_id: 0,
					bankName: "$_id",
					balance: { $subtract: ["$totalIncome", "$totalExpense"] }, 
				},
			},
		]);

		res.status(200).json(balances); 
	} catch (error) {
		console.error("Error calculating bank balances:", error);
		res.status(500).json({ message: "Failed to calculate bank balances" });
	}
};


module.exports = {
	getAllAccounts,
	addAccounts,
	editAccounts,
	deleteAccounts,
	exportTransactionsToCSV,
	getTransactions,
	getTransactionsByDate,
	getCategoryWiseSpending,
	getBankBalances,
};
