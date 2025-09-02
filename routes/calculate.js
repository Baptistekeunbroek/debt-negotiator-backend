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
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const toolCallList = req.body?.message?.toolCallList;
  if (!toolCallList || !Array.isArray(toolCallList) || toolCallList.length === 0) {
    return res.status(400).json({ error: "No tool call found" });
  }

  const toolCall = toolCallList[0];
  if (!toolCall?.function?.name || toolCall.function.name.toLowerCase() !== "calculateproposal") {
    return res.status(400).json({ error: "Unexpected tool name" });
  }

  const args = toolCall?.function?.arguments || {};
  const accountId = args.accountId;
  const counterAmount = args.counterAmount ?? args.amount;
  

  if (!accountId) {
    return res.status(400).json({ error: "accountId is required" });
  }

  // 🔗 on récupère l’utilisateur
  const user = users.find((u) => u.accountId.toLowerCase() === accountId.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // 💡 logique intelligente
  const disposableIncome = user.monthlyIncome - user.expenses;
  const debt = user.debtAmount;

  let baseProposal;
  if (disposableIncome <= 0) {
    // il ne peut pas payer → proposition minimale
    baseProposal = Math.ceil(debt * 0.3);
  } else if (disposableIncome < debt * 0.2) {
    baseProposal = Math.ceil(debt * 0.6);
  } else {
    baseProposal = Math.ceil(debt * 0.9);
  }

  let calculatedAmount;
  let message;

  if (counterAmount === undefined) {
    calculatedAmount = baseProposal;
    message = `Given your income and expenses, we can propose a settlement of €${calculatedAmount} on your debt of €${debt}.`;
  } else {
    if (isNaN(counterAmount) || counterAmount < 0) {
      return res.status(400).json({ error: "Invalid counterAmount" });
    }
    // compromis entre base et contre-proposition
    calculatedAmount = Math.ceil((baseProposal + Number(counterAmount)) / 2);
    message = `We understand your offer. As a compromise, we suggest €${calculatedAmount}, considering your financial situation.`;
  }

  res.json({
    results: [
      {
        toolCallId: toolCall.id,
        result: {
          calculatedAmount,
          message,
          userContext: {
            accountId: user.accountId,
            debt: user.debtAmount,
            disposableIncome,
          },
        },
      },
    ],
  });
});

module.exports = router;
