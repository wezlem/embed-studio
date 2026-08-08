type Field = {
  id: number;
  name: string;
  value: string;
  inline: boolean;
};

type EditorProps = {
  content: string;
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

  onContentChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onAuthorIconChange: (value: string) => void;
  onThumbnailChange: (value: string) => void;
  onImageChange: (value: string) => void;
  onAddField: () => void;
  onUpdateField: (
    id: number,
    property: "name" | "value" | "inline",
    value: string | boolean
  ) => void;
  onRemoveField: (id: number) => void;
  onFooterTextChange: (value: string) => void;
  onFooterIconChange: (value: string) => void;
  onShowTimestampChange: (value: boolean) => void;
};

export default function Editor({
  content,
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
  onContentChange,
  onTitleChange,
  onDescriptionChange,
  onColorChange,
  onAuthorChange,
  onAuthorIconChange,
  onThumbnailChange,
  onImageChange,
  onAddField,
  onUpdateField,
  onRemoveField,
  onFooterTextChange,
  onFooterIconChange,
  onShowTimestampChange,
}: EditorProps) {
  return (
    <div className="h-full overflow-y-auto rounded-xl bg-[#2b2d31] p-4">
      <h2 className="mb-5 text-lg font-semibold">
        📝 Editor
      </h2>

      <div className="space-y-5">

        {/* Message Content */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">
            💬 Message Content
          </h3>

          <textarea
            value={content}
            onChange={(e) =>
              onContentChange(e.target.value)
            }
            placeholder="Write a normal Discord message..."
            rows={4}
            className="w-full resize-none rounded-lg border border-[#3f4147] bg-[#1e1f22] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#5865F2]"
          />

          <p className="mt-2 text-xs text-gray-500">
            Supports normal text, mentions, @everyone and @here.
          </p>
        </div>

        {/* Embed */}
        <div className="border-t border-[#3f4147] pt-5">
          <h3 className="mb-4 text-sm font-semibold text-white">
            📦 Embed
          </h3>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Title
              </label>

              <input
                value={title}
                onChange={(e) =>
                  onTitleChange(e.target.value)
                }
                placeholder="Enter title..."
                className="w-full rounded-lg border border-[#3f4147] bg-[#1e1f22] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#5865F2]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  onDescriptionChange(e.target.value)
                }
                placeholder="Enter description..."
                rows={5}
                className="w-full resize-none rounded-lg border border-[#3f4147] bg-[#1e1f22] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#5865F2]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Embed Color
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) =>
                    onColorChange(e.target.value)
                  }
                  className="h-11 w-14 cursor-pointer rounded-lg border border-[#3f4147] bg-[#1e1f22] p-1"
                />

                <span className="rounded-lg bg-[#1e1f22] px-3 py-2.5 font-mono text-sm text-gray-300">
                  {color.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Author */}
        <div className="border-t border-[#3f4147] pt-5">
          <h3 className="mb-4 text-sm font-semibold text-white">
            👤 Author
          </h3>

          <div className="space-y-4">
            <input
              value={author}
              onChange={(e) =>
                onAuthorChange(e.target.value)
              }
              placeholder="Author Name"
              className="w-full rounded-lg border border-[#3f4147] bg-[#1e1f22] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#5865F2]"
            />

            <input
              value={authorIcon}
              onChange={(e) =>
                onAuthorIconChange(e.target.value)
              }
              placeholder="Author Icon URL"
              className="w-full rounded-lg border border-[#3f4147] bg-[#1e1f22] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#5865F2]"
            />
          </div>
        </div>

        {/* Fields */}
        <div className="border-t border-[#3f4147] pt-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              📋 Fields
            </h3>

            <button
              onClick={onAddField}
              className="rounded-lg bg-[#5865F2] px-3 py-1.5 text-xs font-semibold transition hover:bg-[#4752C4]"
            >
              + Add Field
            </button>
          </div>

          {fields.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#4f545c] px-4 py-6 text-center text-sm text-gray-500">
              No fields yet.
              <br />
              Click{" "}
              <span className="text-gray-300">
                + Add Field
              </span>{" "}
              to create one.
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-lg border border-[#3f4147] bg-[#1e1f22] p-3"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400">
                      Field #{index + 1}
                    </span>

                    <button
                      onClick={() =>
                        onRemoveField(field.id)
                      }
                      className="rounded px-2 py-1 text-xs text-red-400 transition hover:bg-red-400/10"
                    >
                      🗑️ Remove
                    </button>
                  </div>

                  <div className="space-y-3">
                    <input
                      value={field.name}
                      onChange={(e) =>
                        onUpdateField(
                          field.id,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Field Name"
                      className="w-full rounded-lg border border-[#3f4147] bg-[#2b2d31] px-3 py-2 text-sm text-white outline-none transition focus:border-[#5865F2]"
                    />

                    <textarea
                      value={field.value}
                      onChange={(e) =>
                        onUpdateField(
                          field.id,
                          "value",
                          e.target.value
                        )
                      }
                      placeholder="Field Value"
                      rows={3}
                      className="w-full resize-none rounded-lg border border-[#3f4147] bg-[#2b2d31] px-3 py-2 text-sm text-white outline-none transition focus:border-[#5865F2]"
                    />

                    <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-400">
                      <input
                        type="checkbox"
                        checked={field.inline}
                        onChange={(e) =>
                          onUpdateField(
                            field.id,
                            "inline",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 accent-[#5865F2]"
                      />

                      Inline field
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Images */}
        <div className="border-t border-[#3f4147] pt-5">
          <h3 className="mb-4 text-sm font-semibold text-white">
            🖼️ Images
          </h3>

          <div className="space-y-4">
            <input
              value={thumbnail}
              onChange={(e) =>
                onThumbnailChange(e.target.value)
              }
              placeholder="Thumbnail URL"
              className="w-full rounded-lg border border-[#3f4147] bg-[#1e1f22] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#5865F2]"
            />

            <input
              value={image}
              onChange={(e) =>
                onImageChange(e.target.value)
              }
              placeholder="Large Image URL"
              className="w-full rounded-lg border border-[#3f4147] bg-[#1e1f22] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#5865F2]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#3f4147] pt-5">
          <h3 className="mb-4 text-sm font-semibold text-white">
            📝 Footer
          </h3>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Footer Text
              </label>

              <input
                value={footerText}
                onChange={(e) =>
                  onFooterTextChange(e.target.value)
                }
                placeholder="e.g. Embed Studio"
                className="w-full rounded-lg border border-[#3f4147] bg-[#1e1f22] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#5865F2]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Footer Icon URL
              </label>

              <input
                value={footerIcon}
                onChange={(e) =>
                  onFooterIconChange(e.target.value)
                }
                placeholder="https://example.com/icon.png"
                className="w-full rounded-lg border border-[#3f4147] bg-[#1e1f22] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#5865F2]"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={showTimestamp}
                onChange={(e) =>
                  onShowTimestampChange(
                    e.target.checked
                  )
                }
                className="h-4 w-4 accent-[#5865F2]"
              />

              Show Timestamp
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}