const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const toolCallList = req.body?.message?.toolCallList;
  if (!toolCallList || !toolCallList.length) {
    return res.status(400).json({ error: "No tool call found" });
  }

  const toolCall = toolCallList[0];
  if (toolCall.function.name.toLowerCase() !== "calculateproposal") {
    return res.status(400).json({ error: "Unexpected tool name" });
  }

  const args = toolCall.function.arguments || {};
  const { accountId, debtAmount, monthlyIncome, amount } = args;

  // Validation des paramètres
  if (!accountId) {
    return res.status(400).json({ error: "Missing accountId" });
  }
  if (debtAmount === undefined || isNaN(debtAmount) || debtAmount < 0) {
    return res.status(400).json({ error: "Missing or invalid debtAmount" });
  }
  if (monthlyIncome === undefined || isNaN(monthlyIncome)) {
    return res.status(400).json({ error: "Missing or invalid monthlyIncome" });
  }
  if (amount === undefined || isNaN(amount) || amount < 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  let baseProposal;
  if (monthlyIncome <= 0) {
    baseProposal = Math.ceil(debtAmount * 0.3);
  } else if (monthlyIncome < debtAmount * 0.2) {
    baseProposal = Math.ceil(debtAmount * 0.6);
  } else {
    baseProposal = Math.ceil(debtAmount * 0.9);
  }

  const calculatedAmount = Math.ceil((baseProposal + Number(amount)) / 2);

  const message = `We understand your offer. Considering your financial situation, we suggest €${calculatedAmount}.`;

  res.json({
    results: [
      {
        toolCallId: toolCall.id,
        result: {
          calculatedAmount,
          message,
        },
      },
    ],
  });
});

module.exports = router;