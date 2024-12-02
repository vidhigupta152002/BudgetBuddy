const mongoose = require("mongoose");

const accountsSchema = new mongoose.Schema(
	{
		userid: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: [true, "type is required"],
		},
		category: {
			type: String,
			required: [true, "category is required"],
		},
		via: {
			type: String,
			required: [true, "via is required"],
		},
		date: {
			type: Date,
			required: [true, "date is required"],
		},
		// account: {
		// 	type: String,
		// 	// required: [true, "account is required"],
		// },
		// what: {
		// 	type: String,
		// 	required: [true, "what is required"],
		// },
		amount: {
			type: Number,
			required: [true, "amount is required"],
		},
		// refrence: {
		// 	type: String,
		// },
		description: {
			type: String,
			required: [true, "description is required"],
		},
	},
	{ timestamps: true }
);

const accountsModel = mongoose.model("accounts", accountsSchema);

module.exports = accountsModel;
