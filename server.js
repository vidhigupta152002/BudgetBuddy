const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const path = require("path");
var nodemailer = require("nodemailer");
const connectDb = require("./config/connectDb");
const userModel = require("./models/userModel");

//config dotenv file
dotenv.config();

//database call
connectDb();

// rest object
const app = express();

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//routes
// app.get('/',(req,res)=>{
//     res.send("<h1>Hello</h1>")
// })

//user route
app.use("/api/v1/users", require("./routes/userRoute"));
//transaction routes
app.use("/api/v1/accounts", require("./routes/accountsRoute"));

app.use("/api/v1/bank-accounts", require("./routes/bankAccountRoutes"));

app.use("/api/v1/budgets", require("./routes/budgetRoutes"));

//static files
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (req, res) {
	res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//port
const PORT = 8080 || process.env.PORT;

//listen server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

// app.post("/forgot", (req, res) => {
// 	const { email } = req.body;
// 	userModel.findOne({ email: email }).then((user) => {
// 		if (!user) {
// 			return res.send({ Status: "User not existed" });
// 		}
// 		const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
// 			expiresIn: "1d",
// 		});
// 		var transporter = nodemailer.createTransport({
// 			service: "gmail",
// 			auth: {
// 				user: "vidhig366@gmail.com",
// 				pass: "xxaoalszgqqxwtql",
// 			},
// 		});

// 		var mailOptions = {
// 			from: "vidhig366@gmail.com",
// 			to: "vidhigupta152002@gmail.com",
// 			subject: "Reset Password Link",
// 			text: `http://localhost:3000/reset-password/${user._id}/${token}`
// 		};

// 		transporter.sendMail(mailOptions, function (error, info) {
// 			if (error) {
// 				console.log(error);
// 			} else {
// 				return res.send({ Status: "Success" });
// 			}
// 		});
// 	});
// });
