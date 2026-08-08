import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/webhook", async (req, res) => {
  try {
    const {
      webhookUrl,
      embed,
      content,
      username,
      avatarUrl,
    } = req.body;

    if (!webhookUrl) {
      return res.status(400).json({
        success: false,
        message: "Webhook URL is required.",
      });
    }

    const isValidWebhook =
      /^https:\/\/discord(?:app)?\.com\/api\/webhooks\/\d+\/.+$/i.test(
        webhookUrl
      );

    if (!isValidWebhook) {
      return res.status(400).json({
        success: false,
        message: "Invalid Discord webhook URL.",
      });
    }

    const payload: {
      content?: string;
      embeds?: unknown[];
      username?: string;
      avatar_url?: string;
      allowed_mentions?: {
        parse: string[];
      };
    } = {};

    // Normal message
    if (content?.trim()) {
      payload.content = content.trim();
    }

    // Embed
    if (embed && Object.keys(embed).length > 0) {
      payload.embeds = [embed];
    }

    // Webhook username
    if (username?.trim()) {
      payload.username = username.trim();
    }

    // Webhook avatar
    if (avatarUrl?.trim()) {
      payload.avatar_url = avatarUrl.trim();
    }

    // Allow Discord mentions
    payload.allowed_mentions = {
      parse: ["everyone", "users", "roles"],
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Discord error:",
        errorText
      );

      return res.status(response.status).json({
        success: false,
        message:
          errorText ||
          "Discord rejected the webhook.",
      });
    }

    console.log(
      "Webhook sent successfully."
    );

    return res.json({
      success: true,
      message:
        "Message sent successfully!",
    });
  } catch (error) {
    console.error(
      "Webhook server error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to send webhook.",
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `Webhook server running on http://localhost:${PORT}`
  );
});