const express = require("express");
const router = express.Router();
const { sendEmail } = require("../services/email");

router.post("/", async (req, res) => {
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const toolCallList = req.body?.message?.toolCallList;
  if (!toolCallList || !Array.isArray(toolCallList) || toolCallList.length === 0) {
    console.log("Error: toolCallList missing or empty");
    return res.status(400).json({ error: "No tool call found" });
  }

  const toolCall = toolCallList[0];
  console.log("toolCall:", JSON.stringify(toolCall, null, 2));

  if (!toolCall?.function || !toolCall?.function?.name) {
    console.log("Error: toolCall.function or toolCall.function.name missing");
    return res.status(400).json({ error: "Invalid tool call structure" });
  }

  console.log("Received tool name:", toolCall.function.name);

  if (toolCall.function.name.toLowerCase() !== "sendoutcome") {
    console.log("Error: Unexpected tool name:", toolCall.function.name);
    return res.status(400).json({ error: "Unexpected tool name" });
  }

  const outcome = toolCall?.function?.arguments?.outcome;
  if (!["success", "failure", "neutral"].includes(outcome)) {
    console.log("Error: invalid outcome:", outcome);
    return res.status(400).json({ error: "Invalid outcome" });
  }

  try {
    await sendEmail(outcome);
    res.json({
      results: [
        {
          toolCallId: toolCall.id,
          result: { status: "recorded", outcome }
        }
      ]
    });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({
      results: [
        {
          toolCallId: toolCall.id,
          result: { status: "error", error: "Failed to send email" }
        }
      ]
    });
  }
});

module.exports = router;