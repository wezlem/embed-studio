import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files if dist folder exists
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

app.post("/api/webhook", async (req, res) => {
  try {
    const {
      webhookUrl,
      embed,
      content,
      components,
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
      components?: unknown[];
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

    // Link buttons
    const hasButtons =
      Array.isArray(components) && components.length > 0;

    if (hasButtons) {
      payload.components = components;
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

    // Discord only accepts buttons from a plain webhook with this option
    const targetUrl = new URL(webhookUrl);

    if (hasButtons) {
      targetUrl.searchParams.set("with_components", "true");
    }

    const response = await fetch(targetUrl.toString(), {
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

// Fallback for React Router / SPA
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  const indexPath = path.join(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.status(404).send("Frontend not built. Run 'npm run build' first.");
});

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});
