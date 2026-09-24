import { useState } from "react";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import TagPanel, { type TagTarget } from "./components/TagPanel";
import ButtonPanel from "./components/ButtonPanel";
import { isUsableButton, type LinkButton } from "./components/buttons";

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
    const [webhookStatus, setWebhookStatus] = useState<{
    kind: "info" | "success" | "error";
    text: string;
  } | null>(null);

  const [tagNames, setTagNames] = useState<Record<string, string>>({});

  const [buttons, setButtons] = useState<LinkButton[]>([]);

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

  const insertTag = (target: TagTarget, tag: string) => {
    const addTo = (old: string) =>
      old && !/\s$/.test(old) ? `${old} ${tag}` : `${old}${tag}`;

    if (target === "content") {
      setContent(addTo);
    } else {
      setDescription(addTo);
    }
  };

  const setTagName = (tag: string, name: string) => {
    setTagNames((current) => ({ ...current, [tag]: name }));
  };

  const addButton = () => {
    setButtons((current) => [
      ...current,
      { id: Date.now(), label: "", url: "" },
    ]);
  };

  const updateButton = (
    id: number,
    property: "label" | "url",
    value: string
  ) => {
    setButtons((current) =>
      current.map((button) =>
        button.id === id ? { ...button, [property]: value } : button
      )
    );
  };

  const removeButton = (id: number) => {
    setButtons((current) =>
      current.filter((button) => button.id !== id)
    );
  };

  const buildComponents = () => {
    const usable = buttons.filter(isUsableButton);

    if (usable.length === 0) {
      return [];
    }

    return [
      {
        type: 1,
        components: usable.map((button) => ({
          type: 2,
          style: 5,
          label: button.label.trim(),
          url: button.url.trim(),
        })),
      },
    ];
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

    const components = buildComponents();

    if (components.length > 0) {
      payload.components = components;
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
    const usableButtons = buttons.filter(isUsableButton);
    const lines: string[] = [];

    lines.push(
      usableButtons.length > 0
        ? "const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');"
        : "const { EmbedBuilder } = require('discord.js');"
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

    if (usableButtons.length > 0) {
      lines.push(
        "const row = new ActionRowBuilder().addComponents("
      );

      usableButtons.forEach((button, index) => {
        lines.push("  new ButtonBuilder()");
        lines.push(
          `    .setLabel(${JSON.stringify(button.label.trim())})`
        );
        lines.push(
          `    .setURL(${JSON.stringify(button.url.trim())})`
        );
        lines.push(
          index === usableButtons.length - 1
            ? "    .setStyle(ButtonStyle.Link)"
            : "    .setStyle(ButtonStyle.Link),"
        );
      });

      lines.push(");");
      lines.push("");
    }

    const sendParts = [
      ...(content.trim() ? ["content"] : []),
      "embeds: [embed]",
      ...(usableButtons.length > 0 ? ["components: [row]"] : []),
    ];

    lines.push(`channel.send({ ${sendParts.join(", ")} });`);

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

    const isValidWebhookUrl = (url: string) =>
    /^https:\/\/discord(?:app)?\.com\/api\/webhooks\/\d+\/.+$/i.test(
      url.trim()
    );

  const validateWebhook = () => {
    if (!webhookUrl.trim()) {
      setWebhookStatus({
        kind: "error",
        text: "Enter a webhook URL.",
      });
      return;
    }

    if (!isValidWebhookUrl(webhookUrl)) {
      setWebhookStatus({
        kind: "error",
        text: "Invalid Discord webhook URL.",
      });
      return;
    }

    setWebhookStatus({
      kind: "success",
      text: "Webhook URL format is valid.",
    });
  };

  const sendWebhook = async () => {
    if (!webhookUrl.trim()) {
      setWebhookStatus({
        kind: "error",
        text: "Enter a webhook URL.",
      });
      return;
    }

    if (!isValidWebhookUrl(webhookUrl)) {
      setWebhookStatus({
        kind: "error",
        text: "Invalid Discord webhook URL.",
      });
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
      setWebhookStatus({
        kind: "error",
        text: "Add a message or embed content first.",
      });
      return;
    }

    setWebhookStatus({
      kind: "info",
      text: "Sending...",
    });

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
            components: buildComponents(),
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

      setWebhookStatus({
        kind: "success",
        text: "Message sent.",
      });
    } catch (error) {
      console.error(error);

      setWebhookStatus({
        kind: "error",
        text: "Could not send the message. Check that the webhook server is running.",
      });
    }
  };

  const modalContent =
    modal === "json"
      ? buildJSON()
      : buildDiscordJS();

  const modalCopyKey =
    modal === "json" ? "modal-json" : "modal-code";

  /* Ortak stiller */
  const inputClass =
    "w-full rounded-md border border-line bg-field px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-accent";

  const secondaryButton =
    "rounded-md border border-line-strong px-3 py-2 text-sm text-subtle transition-colors hover:bg-line hover:text-ink";

  const primaryButton =
    "rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50";

  const statusColor = {
    info: "text-subtle",
    success: "text-green-400",
    error: "text-danger",
  };

  return (
    <div className="flex h-screen flex-col bg-canvas text-ink">
      <header className="flex shrink-0 items-center justify-between border-b border-line bg-panel px-6 py-3">
        <h1 className="text-base font-semibold">
          Embed Studio
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setModal("json")}
            className={secondaryButton}
          >
            View JSON
          </button>

          <button
            onClick={() =>
              copyToClipboard(buildJSON(), "json")
            }
            className={secondaryButton}
          >
            {copied === "json" ? "Copied" : "Copy JSON"}
          </button>

          <div className="mx-1 h-5 w-px bg-line" />

          <button
            onClick={() => setModal("code")}
            className={secondaryButton}
          >
            View code
          </button>

          <button
            onClick={() =>
              copyToClipboard(buildDiscordJS(), "code")
            }
            className={primaryButton}
          >
            {copied === "code" ? "Copied" : "Copy code"}
          </button>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-2 gap-4 p-4">
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
          onShowTimestampChange={setShowTimestamp}
        />

        <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto">
          <div className="sticky top-0 z-10 flex max-h-[55vh] min-h-[240px] shrink-0 flex-col bg-canvas pb-4 [&>div]:grow">
            <Preview
              content={content}
              botName={webhookUsername || "Embed Studio"}
              botAvatar={webhookAvatar}
              tagNames={tagNames}
              buttons={buttons}
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

          <section className="shrink-0 rounded-lg border border-line bg-panel p-5">
            <h2 className="text-sm font-semibold">
              Tags
            </h2>

            <p className="mt-1 mb-4 text-xs text-muted">
              Mention a user, role or channel by ID.
            </p>

            <TagPanel onInsert={insertTag} onName={setTagName} />
          </section>

          <section className="shrink-0 rounded-lg border border-line bg-panel p-5">
            <h2 className="text-sm font-semibold">
              Buttons
            </h2>

            <p className="mt-1 mb-4 text-xs text-muted">
              Add link buttons under the embed.
            </p>

            <ButtonPanel
              buttons={buttons}
              onAdd={addButton}
              onUpdate={updateButton}
              onRemove={removeButton}
            />
          </section>

          <section className="shrink-0 rounded-lg border border-line bg-panel p-5">
            <h2 className="text-sm font-semibold">
              Webhook
            </h2>

            <p className="mt-1 mb-4 text-xs text-muted">
              Send this message to a Discord channel.
            </p>

            <input
              type="password"
              value={webhookUrl}
              onChange={(event) => {
                setWebhookUrl(event.target.value);
                setWebhookStatus(null);
              }}
              placeholder="https://discord.com/api/webhooks/..."
              aria-label="Webhook URL"
              className={inputClass}
            />

            <div className="mt-3 grid grid-cols-2 gap-2">
              <input
                type="text"
                value={webhookUsername}
                onChange={(event) =>
                  setWebhookUsername(event.target.value)
                }
                placeholder="Username"
                aria-label="Webhook username"
                className={inputClass}
              />

              <input
                type="url"
                value={webhookAvatar}
                onChange={(event) =>
                  setWebhookAvatar(event.target.value)
                }
                placeholder="Avatar URL"
                aria-label="Webhook avatar URL"
                className={inputClass}
              />
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={validateWebhook}
                className={`${secondaryButton} flex-1`}
              >
                Check webhook
              </button>

              <button
                onClick={sendWebhook}
                disabled={!webhookUrl.trim()}
                className={`${primaryButton} flex-1`}
              >
                Send to Discord
              </button>
            </div>

            {webhookStatus && (
              <p
                className={`mt-3 text-sm ${statusColor[webhookStatus.kind]}`}
              >
                {webhookStatus.text}
              </p>
            )}
          </section>
        </div>
      </main>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-4xl overflow-hidden rounded-lg border border-line-strong bg-panel shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-line px-5 py-4">
              <h2 className="text-sm font-semibold">
                {modal === "json"
                  ? "JSON"
                  : "discord.js code"}
              </h2>

              <p className="mt-1 text-xs text-muted">
                {modal === "json"
                  ? "The message payload sent to Discord."
                  : "Ready-to-use code for discord.js."}
              </p>
            </div>

            <div className="max-h-[65vh] overflow-auto p-5">
              <pre className="rounded-md border border-line bg-field p-4 font-mono text-sm leading-6 text-subtle">
                <code>{modalContent}</code>
              </pre>
            </div>

            <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
              <button
                onClick={() => setModal(null)}
                className={secondaryButton}
              >
                Close
              </button>

              <button
                onClick={() =>
                  copyToClipboard(modalContent, modalCopyKey)
                }
                className={primaryButton}
              >
                {copied === modalCopyKey ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;