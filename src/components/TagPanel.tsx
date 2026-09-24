import { useState } from "react";

export type TagTarget = "content" | "description";

type TagKind = "user" | "role" | "channel" | "everyone" | "here";

type TagPanelProps = {
  onInsert: (target: TagTarget, tag: string) => void;
  onName: (tag: string, name: string) => void;
};

const kinds: { key: TagKind; label: string }[] = [
  { key: "user", label: "User" },
  { key: "role", label: "Role" },
  { key: "channel", label: "Channel" },
  { key: "everyone", label: "@everyone" },
  { key: "here", label: "@here" },
];

const inputClass =
  "w-full rounded-md border border-line bg-field px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-accent";

const smallButton =
  "rounded-md border border-line-strong px-3 py-2 text-sm text-subtle transition-colors hover:bg-line hover:text-ink disabled:cursor-not-allowed disabled:opacity-50";

export default function TagPanel({ onInsert, onName }: TagPanelProps) {
  const [kind, setKind] = useState<TagKind>("user");
  const [id, setId] = useState("");
  const [name, setName] = useState("");

  const needsId =
    kind === "user" || kind === "role" || kind === "channel";

  const idIsValid = /^\d{17,20}$/.test(id.trim());
  const canInsert = needsId ? idIsValid : true;

  const buildTag = () => {
    const cleanId = id.trim();

    if (kind === "user") return `<@${cleanId}>`;
    if (kind === "role") return `<@&${cleanId}>`;
    if (kind === "channel") return `<#${cleanId}>`;
    if (kind === "everyone") return "@everyone";
    return "@here";
  };

  const insert = (target: TagTarget) => {
    if (!canInsert) return;

    const tag = buildTag();

    if (needsId && name.trim()) {
      onName(tag, name.trim());
    }

    onInsert(target, tag);

    setId("");
    setName("");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {kinds.map((item) => (
          <button
            key={item.key}
            onClick={() => setKind(item.key)}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
              kind === item.key
                ? "border-accent bg-accent text-white"
                : "border-line-strong text-subtle hover:bg-line hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {needsId && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="ID"
            aria-label="Tag ID"
            className={inputClass}
          />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (preview only)"
            aria-label="Tag name"
            className={inputClass}
          />
        </div>
      )}

      {needsId && id.trim() && !idIsValid && (
        <p className="mt-2 text-xs text-danger">
          An ID is 17 to 20 digits.
        </p>
      )}

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => insert("content")}
          disabled={!canInsert}
          className={`${smallButton} flex-1`}
        >
          Add to message
        </button>

        <button
          onClick={() => insert("description")}
          disabled={!canInsert}
          className={`${smallButton} flex-1`}
        >
          Add to embed
        </button>
      </div>

      <p className="mt-2 text-xs text-muted">
        Tags in the message notify people. Tags inside the embed
        only show the name and do not notify.
      </p>
    </div>
  );
}