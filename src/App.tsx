import { useState } from "react";
import Editor from "./components/Editor";
import Preview from "./components/Preview";

type Field = {
  id: number;
  name: string;
  value: string;
  inline: boolean;
};

type ModalType = "json" | "code" | null;

function App() {
  const [content, setContent] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#5865F2");

  const [author, setAuthor] = useState("");
  const [authorIcon, setAuthorIcon] = useState("");

  const [thumbnail, setThumbnail] = useState("");
  const [image, setImage] = useState("");

  const [fields, setFields] = useState<Field[]>([]);

  const [footerText, setFooterText] = useState("");
  const [footerIcon, setFooterIcon] = useState("");
  const [showTimestamp, setShowTimestamp] = useState(false);

  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookUsername, setWebhookUsername] = useState("");
  const [webhookAvatar, setWebhookAvatar] = useState("");
  const [webhookStatus, setWebhookStatus] = useState("");

  const [copied, setCopied] = useState("");
  const [modal, setModal] = useState<ModalType>(null);

  const addField = () => {
    setFields((currentFields) => [
      ...currentFields,
      {
        id: Date.now(),
        name: "",
        value: "",
        inline: false,
      },
    ]);
  };

  const updateField = (
    id: number,
    property: "name" | "value" | "inline",
    value: string | boolean
  ) => {
    setFields((currentFields) =>
      currentFields.map((field) =>
        field.id === id
          ? {
              ...field,
              [property]: value,
            }
          : field
      )
    );
  };

  const removeField = (id: number) => {
    setFields((currentFields) =>
      currentFields.filter((field) => field.id !== id)
    );
  };

  const buildEmbed = () => {
    const embed: Record<string, unknown> = {};

    if (title.trim()) {
      embed.title = title;
    }

    if (description.trim()) {
      embed.description = description;
    }

    if (color) {
      embed.color = Number.parseInt(
        color.replace("#", ""),
        16
      );
    }

    if (author.trim()) {
      embed.author = {
        name: author,
        ...(authorIcon.trim() && {
          icon_url: authorIcon,
        }),
      };
    }

    if (thumbnail.trim()) {
      embed.thumbnail = {
        url: thumbnail,
      };
    }

    if (image.trim()) {
      embed.image = {
        url: image,
      };
    }

    const validFields = fields.filter(
      (field) =>
        field.name.trim() || field.value.trim()
    );

    if (validFields.length > 0) {
      embed.fields = validFields.map((field) => ({
        name: field.name || "Field Name",
        value: field.value || "\u200B",
        inline: field.inline,
      }));
    }

    if (footerText.trim()) {
      embed.footer = {
        text: footerText,
        ...(footerIcon.trim() && {
          icon_url: footerIcon,
        }),
      };
    }

    if (showTimestamp) {
      embed.timestamp = new Date().toISOString();
    }

    return embed;
  };

  const buildPayload = () => {
    const payload: Record<string, unknown> = {
      embeds: [buildEmbed()],
    };

    if (content.trim()) {
      payload.content = content;
    }

    return payload;
  };

  const buildJSON = () => {
    return JSON.stringify(
      buildPayload(),
      null,
      2
    );
  };

  const buildDiscordJS = () => {
    const embed = buildEmbed();
    const lines: string[] = [];

    lines.push(
      "const { EmbedBuilder } = require('discord.js');"
    );
    lines.push("");

    if (content.trim()) {
      lines.push(
        `const content = ${JSON.stringify(
          content
        )};`
      );
      lines.push("");
    }

    lines.push(
      "const embed = new EmbedBuilder()"
    );

    if (embed.title) {
      lines.push(
        `  .setTitle(${JSON.stringify(
          embed.title
        )})`
      );
    }

    if (embed.description) {
      lines.push(
        `  .setDescription(${JSON.stringify(
          embed.description
        )})`
      );
    }

    if (embed.color) {
      lines.push(
        `  .setColor(${JSON.stringify(color)})`
      );
    }

    if (embed.author) {
      const authorData = embed.author as {
        name: string;
        icon_url?: string;
      };

      lines.push("  .setAuthor({");

      lines.push(
        `    name: ${JSON.stringify(
          authorData.name
        )},`
      );

      if (authorData.icon_url) {
        lines.push(
          `    iconURL: ${JSON.stringify(
            authorData.icon_url
          )},`
        );
      }

      lines.push("  })");
    }

    if (embed.thumbnail) {
      const thumbnailData = embed.thumbnail as {
        url: string;
      };

      lines.push(
        `  .setThumbnail(${JSON.stringify(
          thumbnailData.url
        )})`
      );
    }

    if (embed.image) {
      const imageData = embed.image as {
        url: string;
      };

      lines.push(
        `  .setImage(${JSON.stringify(
          imageData.url
        )})`
      );
    }

    if (embed.fields) {
      const embedFields = embed.fields as {
        name: string;
        value: string;
        inline: boolean;
      }[];

      lines.push("  .addFields(");

      embedFields.forEach((field, index) => {
        lines.push("    {");

        lines.push(
          `      name: ${JSON.stringify(
            field.name
          )},`
        );

        lines.push(
          `      value: ${JSON.stringify(
            field.value
          )},`
        );

        lines.push(
          `      inline: ${field.inline},`
        );

        lines.push(
          index === embedFields.length - 1
            ? "    }"
            : "    },"
        );
      });

      lines.push("  )");
    }

    if (embed.footer) {
      const footerData = embed.footer as {
        text: string;
        icon_url?: string;
      };

      lines.push("  .setFooter({");

      lines.push(
        `    text: ${JSON.stringify(
          footerData.text
        )},`
      );

      if (footerData.icon_url) {
        lines.push(
          `    iconURL: ${JSON.stringify(
            footerData.icon_url
          )},`
        );
      }

      lines.push("  })");
    }

    if (embed.timestamp) {
      lines.push("  .setTimestamp();");
    } else {
      lines[lines.length - 1] += ";";
    }

    lines.push("");

    if (content.trim()) {
      lines.push(
        "channel.send({ content, embeds: [embed] });"
      );
    } else {
      lines.push(
        "channel.send({ embeds: [embed] });"
      );
    }

    return lines.join("\n");
  };

  const copyToClipboard = async (
    text: string,
    type: string
  ) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(type);

      setTimeout(() => {
        setCopied("");
      }, 2000);
    } catch {
      setCopied("");
    }
  };

  const validateWebhook = () => {
    const isValid =
      /^https:\/\/discord(?:app)?\.com\/api\/webhooks\/\d+\/.+$/i.test(
        webhookUrl.trim()
      );

    if (!webhookUrl.trim()) {
      setWebhookStatus(
        "⚠️ Webhook URL is empty."
      );
      return;
    }

    if (!isValid) {
      setWebhookStatus(
        "❌ Invalid Discord webhook URL."
      );
      return;
    }

    setWebhookStatus(
      "✓ Webhook URL format looks valid."
    );
  };

  const sendWebhook = async () => {
    if (!webhookUrl.trim()) {
      setWebhookStatus(
        "⚠️ Please enter a webhook URL."
      );
      return;
    }

    const isValid =
      /^https:\/\/discord(?:app)?\.com\/api\/webhooks\/\d+\/.+$/i.test(
        webhookUrl.trim()
      );

    if (!isValid) {
      setWebhookStatus(
        "❌ Invalid Discord webhook URL."
      );
      return;
    }

    const embed = buildEmbed();

    if (
      !content.trim() &&
      !embed.title &&
      !embed.description &&
      !embed.fields &&
      !embed.image &&
      !embed.thumbnail &&
      !embed.author &&
      !embed.footer
    ) {
      setWebhookStatus(
        "⚠️ Please add a message or embed content first."
      );
      return;
    }

    setWebhookStatus("⏳ Sending...");

    try {
      const response = await fetch(
        "http://localhost:3001/api/webhook",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            webhookUrl: webhookUrl.trim(),
            embed,
            content: content.trim(),
            username: webhookUsername.trim(),
            avatarUrl: webhookAvatar.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Webhook failed."
        );
      }

      setWebhookStatus(
        "✅ Message sent successfully!"
      );
    } catch (error) {
      console.error(error);

      setWebhookStatus(
        "❌ Failed to send message. Is the webhook server running?"
      );
    }
  };

  const modalContent =
    modal === "json"
      ? buildJSON()
      : buildDiscordJS();

  return (
    <div className="min-h-screen bg-[#313338] text-white">
      <header className="flex items-center justify-between border-b border-[#3f4147] px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">
            🎨 Embed Studio
          </h1>

          <p className="text-sm text-gray-400">
            Build beautiful Discord embeds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setModal("json")}
            className="rounded-lg border border-[#4f545c] px-3 py-2 text-sm transition hover:bg-[#3f4147]"
          >
            👁 JSON
          </button>

          <button
            onClick={() =>
              copyToClipboard(
                buildJSON(),
                "json"
              )
            }
            className="rounded-lg border border-[#4f545c] px-3 py-2 text-sm transition hover:bg-[#3f4147]"
          >
            {copied === "json"
              ? "✓ Copied"
              : "📋 Copy JSON"}
          </button>

          <button
            onClick={() => setModal("code")}
            className="rounded-lg border border-[#4f545c] px-3 py-2 text-sm transition hover:bg-[#3f4147]"
          >
            👁 Code
          </button>

          <button
            onClick={() =>
              copyToClipboard(
                buildDiscordJS(),
                "code"
              )
            }
            className="rounded-lg bg-[#5865F2] px-3 py-2 text-sm font-semibold transition hover:bg-[#4752C4]"
          >
            {copied === "code"
              ? "✓ Copied"
              : "</> Copy Code"}
          </button>
        </div>
      </header>

      <main className="grid min-h-[calc(100vh-81px)] grid-cols-2 gap-4 p-4">
        <Editor
          content={content}
          title={title}
          description={description}
          color={color}
          author={author}
          authorIcon={authorIcon}
          thumbnail={thumbnail}
          image={image}
          fields={fields}
          footerText={footerText}
          footerIcon={footerIcon}
          showTimestamp={showTimestamp}
          onContentChange={setContent}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onColorChange={setColor}
          onAuthorChange={setAuthor}
          onAuthorIconChange={setAuthorIcon}
          onThumbnailChange={setThumbnail}
          onImageChange={setImage}
          onAddField={addField}
          onUpdateField={updateField}
          onRemoveField={removeField}
          onFooterTextChange={setFooterText}
          onFooterIconChange={setFooterIcon}
          onShowTimestampChange={
            setShowTimestamp
          }
        />

        <div className="flex h-full flex-col gap-4">
          <div className="min-h-0 flex-1">
            <Preview
              content={content}
              botName={
                webhookUsername ||
                "Embed Studio"
              }
              botAvatar={webhookAvatar}
              showBotBadge={true}
              title={title}
              description={description}
              color={color}
              author={author}
              authorIcon={authorIcon}
              thumbnail={thumbnail}
              image={image}
              fields={fields}
              footerText={footerText}
              footerIcon={footerIcon}
              showTimestamp={showTimestamp}
            />
          </div>

          <div className="rounded-xl border border-[#3f4147] bg-[#2b2d31] p-5">
            <div className="mb-4">
              <h2 className="text-base font-semibold">
                🚀 Discord Webhook
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Configure how your message appears when sent to Discord.
              </p>
            </div>

            <input
              type="password"
              value={webhookUrl}
              onChange={(event) => {
                setWebhookUrl(
                  event.target.value
                );
                setWebhookStatus("");
              }}
              placeholder="https://discord.com/api/webhooks/..."
              className="w-full rounded-lg border border-[#3f4147] bg-[#1e1f22] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#5865F2]"
            />

            <div className="mt-3 grid grid-cols-2 gap-2">
              <input
                type="text"
                value={webhookUsername}
                onChange={(event) =>
                  setWebhookUsername(
                    event.target.value
                  )
                }
                placeholder="Webhook Username"
                className="rounded-lg border border-[#3f4147] bg-[#1e1f22] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#5865F2]"
              />

              <input
                type="url"
                value={webhookAvatar}
                onChange={(event) =>
                  setWebhookAvatar(
                    event.target.value
                  )
                }
                placeholder="Avatar URL"
                className="rounded-lg border border-[#3f4147] bg-[#1e1f22] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#5865F2]"
              />
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={validateWebhook}
                className="flex-1 rounded-lg border border-[#4f545c] px-4 py-2.5 text-sm transition hover:bg-[#3f4147]"
              >
                Check Webhook
              </button>

              <button
                onClick={sendWebhook}
                disabled={!webhookUrl.trim()}
                className="flex-1 rounded-lg bg-[#5865F2] px-4 py-2.5 text-sm font-semibold transition hover:bg-[#4752C4] disabled:cursor-not-allowed disabled:opacity-50"
              >
                🚀 Send to Discord
              </button>
            </div>

            {webhookStatus && (
              <p className="mt-3 text-center text-sm text-gray-300">
                {webhookStatus}
              </p>
            )}
          </div>
        </div>
      </main>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-4xl overflow-hidden rounded-xl border border-[#4f545c] bg-[#2b2d31] shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-center justify-between border-b border-[#3f4147] px-5 py-4">
              <div>
                <h2 className="font-semibold">
                  {modal === "json"
                    ? "📋 JSON Output"
                    : "</> Discord.js Code"}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {modal === "json"
                    ? "Your generated Discord message payload."
                    : "Generated code for discord.js."}
                </p>
              </div>

              <button
                onClick={() => setModal(null)}
                className="rounded-lg px-3 py-2 text-gray-400 transition hover:bg-[#3f4147] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[65vh] overflow-auto p-5">
              <pre className="rounded-lg border border-[#3f4147] bg-[#1e1f22] p-5 text-sm leading-6 text-gray-200">
                <code>{modalContent}</code>
              </pre>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#3f4147] px-5 py-4">
              <button
                onClick={() => setModal(null)}
                className="rounded-lg border border-[#4f545c] px-4 py-2 text-sm transition hover:bg-[#3f4147]"
              >
                Close
              </button>

              <button
                onClick={() =>
                  copyToClipboard(
                    modalContent,
                    modal === "json"
                      ? "modal-json"
                      : "modal-code"
                  )
                }
                className="rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-semibold transition hover:bg-[#4752C4]"
              >
                {copied ===
                (modal === "json"
                  ? "modal-json"
                  : "modal-code")
                  ? "✓ Copied!"
                  : "📋 Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;