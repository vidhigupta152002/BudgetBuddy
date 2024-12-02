const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
	{
		userid: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		budget: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

const budgetModel = mongoose.model("Budget", BudgetSchema);
module.exports = budgetModel;
