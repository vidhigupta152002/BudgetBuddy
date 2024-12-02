const express = require("express");
const { setBudget, checkBudget } = require("../controllers/budgetController");
const router = express.Router();


router.post("/set", setBudget);
router.get("/check", checkBudget);

module.exports = router;
