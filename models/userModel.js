const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "name is required"],
		},
		email: {
			type: String,
			required: [true, "email is required and should be unique"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "password is required"],
		},
		cpassword: {
			type: String,
			required: [true, "confirm password is required"],
		},
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
	},
	{ timestamp: true }
);

userSchema.pre("save", async function (next) {
	try {
		if (this.isModified("password")) {
			this.password = await bcrypt.hash(this.password, 12);
			this.cpassword = await bcrypt.hash(this.cpassword, 12);
		}
		next();
	} catch (error) {
		next(error);
	}
});

//.method use kia since userSchema ek instance h and to work on instance we need to use .methods
userSchema.methods.generateAuthToken = async function () {
	try {
		let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
		//this.tokens k andar hme concat krke kuch add krna h, and i.e. jo bhi tokens k andar token field h usme jo new
		//token hm generate krwa rhee h usse add kr do
		this.tokens = this.tokens.concat({ token: token });
		await this.save();
		return token;
	} catch (err) {
		console.log(err);
	}
};

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
