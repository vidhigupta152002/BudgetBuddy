const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//login callback
const loginController = async (req, res) => {
	try {
		let token;
		const { email, password } = req.body;
		const user = await userModel.findOne({ email: email });

		if (user) {
			const isMatch = await bcrypt.compare(password, user.password);

			token = await user.generateAuthToken();
			console.log(token);
			//res.cookie (cookie name, cookie value)
			res.cookie("jwtoken", token, {
				//when user login+259200000ms-> token expires after 3 days (we wote time in ms since we get time using
				//now() in ms)
				expires: new Date(Date.now() + 259200000),
				//since abhi secure ni h i.e. https so we want ki http p bhi kaam kre
				httpOnly: true,
			});

			if (!isMatch) {
				return res.status(404).send("Invalid Credentials pass");
			}
			res.status(200).json({
				success: true,
				user,
			});
		} else {
			return res.status(404).send("Invalid Credentials");
		}
	} catch (error) {
		res.status(400).json({
			success: false,
			error,
		});
	}
};

//register callback
const registerController = async (req, res) => {
	try {
		if (req.body.password != req.body.cpassword) {
			return res.status(422).json({ success: false, error });
		} else {
			const newUser = new userModel(req.body);
			await newUser.save();
			res.status(201).json({
				success: true,
				newUser,
			});
		}
	} catch (error) {
		res.status(400).json({
			success: false,
			error,
		});
	}
};

module.exports = { loginController, registerController };
