import { useState } from "react";
import { renderMarkdown } from "./renderMarkdown";
import { isUsableButton, type LinkButton } from "./buttons";

type Field = {
  id: number;
  name: string;
  value: string;
  inline: boolean;
};

type PreviewProps = {
  content: string;
  botName: string;
  botAvatar: string;
  tagNames: Record<string, string>;
  buttons: LinkButton[];
  showBotBadge: boolean;
  title: string;
  description: string;
  color: string;
  author: string;
  authorIcon: string;
  thumbnail: string;
  image: string;
  fields: Field[];
  footerText: string;
  footerIcon: string;
  showTimestamp: boolean;
};

const DEFAULT_AVATAR_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">' +
  '<rect width="128" height="128" fill="#5865F2"/>' +
  '<path d="M28 44c10-8 22-11 36-11s26 3 36 11c8 12 12 28 12 46-9 7-18 11-28 13l-6-10c-9 2-19 2-28 0l-6 10c-10-2-19-6-28-13 0-18 4-34 12-46z" fill="#fff"/>' +
  '<ellipse cx="47" cy="72" rx="8" ry="10" fill="#5865F2"/>' +
  '<ellipse cx="81" cy="72" rx="8" ry="10" fill="#5865F2"/>' +
  "</svg>";

const DEFAULT_AVATAR = `data:image/svg+xml;utf8,${encodeURIComponent(
  DEFAULT_AVATAR_SVG
)}`;

export default function Preview({
  content,
  botName,
  botAvatar,
  tagNames,
  buttons,
  showBotBadge,
  title,
  description,
  color,
  author,
  authorIcon,
  thumbnail,
  image,
  fields,
  footerText,
  footerIcon,
  showTimestamp,
}: PreviewProps) {
  const [botAvatarError, setBotAvatarError] = useState<string | null>(null);
  const [authorIconError, setAuthorIconError] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [footerIconError, setFooterIconError] = useState<string | null>(null);

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const renderContent = (text: string) => {
    const tagRegex = /(@everyone|@here|<@!?\d+>|<@&\d+>|<#\d+>)/g;

    return text.split(tagRegex).map((part, index) => {
      let label = "";

      if (part === "@everyone" || part === "@here") {
        label = part;
      } else if (/^<@&\d+>$/.test(part)) {
        label = `@${tagNames[part] || `Role-${part.slice(3, -1)}`}`;
      } else if (/^<@!?\d+>$/.test(part)) {
        label = `@${tagNames[part] || `User-${part.replace(/\D/g, "")}`}`;
      } else if (/^<#\d+>$/.test(part)) {
        label = `#${tagNames[part] || `channel-${part.slice(2, -1)}`}`;
      }

      if (label) {
        return (
          <span
            key={index}
            className="rounded bg-accent/20 px-0.5 font-medium text-[#C9CDFB]"
          >
            {label}
          </span>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  const botAvatarHasError = botAvatarError === botAvatar;
  const authorIconHasError = authorIconError === authorIcon;
  const thumbnailHasError = thumbnailError === thumbnail;
  const imageHasError = imageError === image;
  const footerIconHasError = footerIconError === footerIcon;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-line bg-chat">
      <div className="border-b border-line px-5 py-3">
        <h2 className="text-sm font-semibold text-ink">
          Preview
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="flex gap-3">
          {botAvatar && !botAvatarHasError ? (
                                          <img
            src={botAvatar && !botAvatarHasError ? botAvatar : DEFAULT_AVATAR}
            alt="Bot avatar"
            className="h-10 w-10 shrink-0 rounded-full object-cover"
            onError={() => setBotAvatarError(botAvatar)}
          />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
              {(botName || "E").charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-semibold text-ink">
                {botName || "Embed Studio"}
              </span>

              {showBotBadge && (
                <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none text-white">
                  Bot
                </span>
              )}

              <span className="text-xs text-muted">
                Today at {currentTime}
              </span>
            </div>

            {content && (
              <div className="mb-2 whitespace-pre-wrap text-sm text-ink">
                {renderMarkdown(content, renderContent)}
              </div>
            )}

            <div
              className="max-w-[520px] overflow-hidden rounded-md border-l-4 bg-panel"
              style={{ borderLeftColor: color }}
            >
              <div className="p-4">
                {author && (
                  <div className="mb-2 flex items-center gap-2">
                    {authorIcon && !authorIconHasError && (
                      <img
                        src={authorIcon}
                        alt="Author icon"
                        className="h-6 w-6 rounded-full object-cover"
                        onError={() => setAuthorIconError(authorIcon)}
                      />
                    )}

                    <span className="text-sm font-semibold text-ink">
                      {author}
                    </span>
                  </div>
                )}

                <div className="flex gap-4">
                  <div className="min-w-0 flex-1">
                    {title && (
                      <h3 className="mb-2 text-base font-semibold text-ink">
                        {title}
                      </h3>
                    )}

                    {description && (
                      <div className="whitespace-pre-wrap text-sm text-ink">
                        {renderMarkdown(description, renderContent)}
                      </div>
                    )}
                  </div>

                  {thumbnail && !thumbnailHasError && (
                    <img
                      src={thumbnail}
                      alt="Thumbnail"
                      className="h-20 w-20 shrink-0 rounded-md object-cover"
                      onError={() => setThumbnailError(thumbnail)}
                    />
                  )}
                </div>

                {fields.length > 0 && (
                  <div className="mt-4 grid grid-cols-12 gap-x-4 gap-y-3">
                    {fields
                      .filter(
                        (field) =>
                          field.name.trim() ||
                          field.value.trim()
                      )
                      .map((field) => (
                        <div
                          key={field.id}
                          className={
                            field.inline
                              ? "col-span-12 sm:col-span-4"
                              : "col-span-12"
                          }
                        >
                          {field.name && (
                            <h4 className="text-sm font-semibold text-ink">
                              {field.name}
                            </h4>
                          )}

                          {field.value && (
                            <div className="mt-0.5 whitespace-pre-wrap text-sm text-ink">
                              {renderMarkdown(field.value, renderContent)}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}

                {image && !imageHasError && (
                  <img
                    src={image}
                    alt="Embed"
                    className="mt-4 max-h-80 w-full rounded-md object-cover"
                    onError={() => setImageError(image)}
                  />
                )}

                {(footerText || showTimestamp) && (
                  <div className="mt-3 flex items-center gap-2">
                    {footerIcon && !footerIconHasError && (
                      <img
                        src={footerIcon}
                        alt="Footer icon"
                        className="h-5 w-5 rounded-full object-cover"
                        onError={() => setFooterIconError(footerIcon)}
                      />
                    )}

                    {footerText && (
                      <span className="text-xs text-subtle">
                        {footerText}
                      </span>
                    )}

                    {footerText && showTimestamp && (
                      <span className="text-xs text-muted">
                        •
                      </span>
                    )}

                    {showTimestamp && (
                      <span className="text-xs text-subtle">
                        {currentTime}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {buttons.filter(isUsableButton).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {buttons.filter(isUsableButton).map((button) => (
                  <span
                    key={button.id}
                    className="inline-flex items-center gap-2 rounded-md bg-[#4e5058] px-4 py-1.5 text-sm font-medium text-white"
                  >
                    {button.label}

                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M15 3h6v6" />
                      <path d="M10 14 21 3" />
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    </svg>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}