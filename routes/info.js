const express = require("express");
const router = express.Router();

const users = [
  {
    accountId: "USR12345",
    debtAmount: 500,
    employmentStatus: "employed",
    monthlyIncome: 1800,
    expenses: 1200,
  },
  {
    accountId: "USR67890",
    debtAmount: 1200,
    employmentStatus: "unemployed",
    monthlyIncome: 0,
    expenses: 800,
  },
];

router.post("/", (req, res) => {
  console.log("Received info request:", JSON.stringify(req.body, null, 2));

  const toolCallList = req.body?.message?.toolCallList;
  if (!toolCallList || !Array.isArray(toolCallList) || toolCallList.length === 0) {
    console.log("Error: toolCallList missing or empty");
    return res.status(400).json({ error: "No tool call found" });
  }

  const toolCall = toolCallList[0];
  console.log("Received tool name:", toolCall?.function?.name);

  if (!toolCall?.function?.name || toolCall.function.name.toLowerCase() !== "getinfo") {
    console.log("Error: Unexpected tool name:", toolCall?.function?.name);
    return res.status(400).json({ error: "Unexpected tool name" });
  }

  const args = toolCall?.function?.arguments || {};
  const accountId = args.accountId;

  if (!accountId) {
    console.log("Error: accountId is required but missing in tool arguments.");
    return res.status(400).json({ error: "accountId is required" });
  }

  const user = users.find((u) => u.accountId.toLowerCase() === accountId.toLowerCase());

  if (!user) {
    console.log(`Error: No user found for accountId: ${accountId}`);
    return res.status(404).json({ error: "User not found" });
  }

  // Log confirmation and info provided
  console.log(`AccountId confirmed: ${accountId}`);
  console.log("Providing user info to agent:", {
    debtAmount: user.debtAmount,
    employmentStatus: user.employmentStatus,
    monthlyIncome: user.monthlyIncome,
    expenses: user.expenses,
  });

  res.json({
    results: [
      {
        toolCallId: toolCall.id,
        result: {
          accountId: user.accountId,
          debtAmount: user.debtAmount,
          employmentStatus: user.employmentStatus,
          monthlyIncome: user.monthlyIncome,
          expenses: user.expenses
        }
      }
    ]
  });
  
});

module.exports = router;
