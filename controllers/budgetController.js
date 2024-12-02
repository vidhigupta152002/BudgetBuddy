const budgetModel = require("../models/budgetModel");
const accountsModel = require("../models/accounts");

const setBudget = async (req, res) => {
	try {
		const { userid, category, budget } = req.body;
		const existingBudget = await budgetModel.findOne({ userid, category });
		if (existingBudget) {
			existingBudget.budget = budget;
			await existingBudget.save();
		} else {
			const newBudget = new budgetModel({ userid, category, budget });
			await newBudget.save();
		}
		res.status(200).json({ message: "Budget set successfully" });
	} catch (error) {
		res.status(500).json({ error: "Failed to set budget" });
	}
};

const checkBudget = async (req, res) => {
	try {
		const { userid } = req.query;
		const budgets = await budgetModel.find({ userid });
		const transactions = await accountsModel.find({ userid, type: "expense" });
		
		const results = budgets.map((budget) => {
			const totalSpent = transactions
				.filter(
					(txn) =>
						txn.category &&
						txn.category.toLowerCase() === budget.category.toLowerCase()
				)
				.reduce((sum, txn) => sum + (txn.amount || 0), 0);
				
			return {
				category: budget.category,
				budget: budget.budget,
				spent: totalSpent,
				exceeded: totalSpent > budget.budget,
			};
		});

		res.status(200).json(results);
	} catch (error) {
		res.status(500).json({ error: "Failed to check budgets" });
	}
};

module.exports = {
	setBudget,
	checkBudget
};
