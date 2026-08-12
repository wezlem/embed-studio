import { useState } from "react";

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

export default function Preview({
  content,
  botName,
  botAvatar,
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
    const mentionRegex =
      /(@everyone|@here|<@!?\d+>|<@&\d+>)/g;

    const parts = text.split(mentionRegex);

    return parts.map((part, index) => {
      const isMention =
        part === "@everyone" ||
        part === "@here" ||
        /^<@!?\d+>$/.test(part) ||
        /^<@&\d+>$/.test(part);

      if (isMention) {
        let displayText = part;

        if (/^<@!?\d+>$/.test(part)) {
          const id = part
            .replace("<@!", "")
            .replace("<@", "")
            .replace(">", "");

          displayText = `@User-${id}`;
        }

        if (/^<@&\d+>$/.test(part)) {
          const id = part
            .replace("<@&", "")
            .replace(">", "");

          displayText = `@Role-${id}`;
        }

        return (
          <span
            key={index}
            className="rounded bg-[#5865F2]/20 px-0.5 font-medium text-[#C9CDFB]"
          >
            {displayText}
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
    <div className="h-full overflow-y-auto rounded-xl bg-[#313338] p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          👀 Live Preview
        </h2>
      </div>

      <div className="flex gap-3">
        {botAvatar && !botAvatarHasError ? (
          <img
            src={botAvatar}
            alt="Bot Avatar"
            className="h-10 w-10 shrink-0 rounded-full object-cover"
            onError={() => setBotAvatarError(botAvatar)}
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5865F2] text-xl">
            🤖
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-semibold text-white">
              {botName || "Embed Studio"}
            </span>

            {showBotBadge && (
              <span className="rounded bg-[#5865F2] px-1.5 py-0.5 text-[10px] font-bold uppercase">
                BOT
              </span>
            )}

            <span className="text-xs text-gray-400">
              Today at {currentTime}
            </span>
          </div>

          {content && (
            <div className="mb-2 whitespace-pre-wrap text-sm text-gray-100">
              {renderContent(content)}
            </div>
          )}

          <div
            className="overflow-hidden rounded-md border-l-4 bg-[#2B2D31]"
            style={{ borderLeftColor: color }}
          >
            <div className="p-4">
              {author && (
                <div className="mb-2 flex items-center gap-2">
                  {authorIcon && !authorIconHasError && (
                    <img
                      src={authorIcon}
                      alt="Author Icon"
                      className="h-6 w-6 rounded-full object-cover"
                      onError={() => setAuthorIconError(authorIcon)}
                    />
                  )}

                  <span className="text-sm font-semibold text-white">
                    {author}
                  </span>
                </div>
              )}

              <div className="flex gap-4">
                <div className="min-w-0 flex-1">
                  {title && (
                    <h3 className="mb-2 text-lg font-bold text-white">
                      {title}
                    </h3>
                  )}

                  {description && (
                    <p className="whitespace-pre-wrap text-sm text-gray-300">
                      {description}
                    </p>
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
                <div className="mt-5 grid grid-cols-12 gap-x-4 gap-y-4">
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
                          <h4 className="text-sm font-semibold text-white">
                            {field.name}
                          </h4>
                        )}

                        {field.value && (
                          <p className="mt-1 whitespace-pre-wrap text-sm text-gray-300">
                            {field.value}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {image && !imageHasError && (
                <img
                  src={image}
                  alt="Embed Image"
                  className="mt-4 max-h-80 w-full rounded-md object-cover"
                  onError={() => setImageError(image)}
                />
              )}

              {(footerText || showTimestamp) && (
                <div className="mt-4 flex items-center gap-2">
                  {footerIcon && !footerIconHasError && (
                    <img
                      src={footerIcon}
                      alt="Footer Icon"
                      className="h-5 w-5 rounded-full object-cover"
                      onError={() => setFooterIconError(footerIcon)}
                    />
                  )}

                  {footerText && (
                    <span className="text-xs text-gray-400">
                      {footerText}
                    </span>
                  )}

                  {footerText && showTimestamp && (
                    <span className="text-xs text-gray-500">
                      •
                    </span>
                  )}

                  {showTimestamp && (
                    <span className="text-xs text-gray-400">
                      {currentTime}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}