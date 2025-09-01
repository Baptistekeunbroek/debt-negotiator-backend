const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const toolCallList = req.body?.message?.toolCallList;
  if (!toolCallList || !Array.isArray(toolCallList) || toolCallList.length === 0) {
    console.log("Error: toolCallList missing or empty");
    return res.status(400).json({ error: "No tool call found" });
  }

  const toolCall = toolCallList[0];
  console.log("Received tool name:", toolCall?.function?.name);

  if (!toolCall?.function?.name || toolCall.function.name.toLowerCase() !== "calculateproposal") {
    console.log("Error: Unexpected tool name:", toolCall?.function?.name);
    return res.status(400).json({ error: "Unexpected tool name" });
  }

  const args = toolCall?.function?.arguments || {};
  const amount = args.amount;
  const counterAmount = args.counterAmount;

  if (amount === undefined || isNaN(amount) || amount < 0) {
    console.log("Error: invalid amount:", amount);
    return res.status(400).json({ error: "Invalid amount" });
  }

  let calculatedAmount, message;

  if (counterAmount === undefined) {
    calculatedAmount = Math.ceil(amount * 1.2);

    const justifications = [
      `By raising your payment to €${calculatedAmount}, we can help close your file today and avoid any future complications.`,
      `A payment of €${calculatedAmount} helps cover administrative costs and speeds up the resolution process for you.`,
      `Increasing your payment to €${calculatedAmount} allows us to finalize your case as a best effort and avoid further follow-up.`,
      `With a payment of €${calculatedAmount}, you can resolve your situation more quickly and move forward with peace of mind.`
    ];
    message = justifications[Math.floor(Math.random() * justifications.length)];
  } else {
    if (isNaN(counterAmount) || counterAmount < amount) {
      console.log("Error: invalid counterAmount:", counterAmount);
      return res.status(400).json({ error: "Invalid counterAmount" });
    }
    calculatedAmount = Math.ceil((Number(amount) + Number(counterAmount)) / 2);

    const compromiseJustifications = [
      `Let's meet in the middle: a payment of €${calculatedAmount} is a fair compromise that helps both sides move forward.`,
      `How about €${calculatedAmount}? It's halfway between your offer and our suggestion, making it a balanced solution.`,
      `A payment of €${calculatedAmount} shows your good faith and helps us resolve things together.`,
      `Splitting the difference at €${calculatedAmount} is a positive step for both of us.`
    ];
    message = compromiseJustifications[Math.floor(Math.random() * compromiseJustifications.length)];
  }

  res.json({
    results: [
      {
        toolCallId: toolCall.id,
        result: {
          calculatedAmount,
          message
        }
      }
    ]
  });
});

module.exports = router;