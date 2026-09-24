import type { ReactNode } from "react";

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

/* Tüm giriş kutuları aynı stili buradan alır */
const inputClass =
  "w-full rounded-md border border-line bg-field px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-accent";

const textareaClass = `${inputClass} resize-none`;

/* Bölüm: başlık + içerik */
function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-line px-5 py-5 last:border-b-0">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          {title}
        </h3>

        {action}
      </div>

      {children}
    </section>
  );
}

/* Etiket + giriş kutusu (etikete tıklayınca kutu seçilir) */
function Row({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-subtle">
        {label}
      </span>

      {children}
    </label>
  );
}

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
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-line bg-panel">
      <div className="border-b border-line px-5 py-3">
        <h2 className="text-sm font-semibold text-ink">
          Editor
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <Section title="Message">
          <textarea
            value={content}
            onChange={(e) =>
              onContentChange(e.target.value)
            }
            placeholder="Message content"
            rows={4}
            className={textareaClass}
          />

          <p className="mt-2 text-xs text-muted">
            Supports text, mentions, @everyone and @here.
          </p>
        </Section>

        <Section title="Embed">
          <div className="space-y-4">
            <Row label="Title">
              <input
                value={title}
                onChange={(e) =>
                  onTitleChange(e.target.value)
                }
                placeholder="Embed title"
                className={inputClass}
              />
            </Row>

            <Row label="Description">
              <textarea
                value={description}
                onChange={(e) =>
                  onDescriptionChange(e.target.value)
                }
                placeholder="Embed description"
                rows={5}
                className={textareaClass}
              />
            </Row>

            <div>
              <span className="mb-1.5 block text-xs font-medium text-subtle">
                Color
              </span>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) =>
                    onColorChange(e.target.value)
                  }
                  aria-label="Embed color"
                  className="h-9 w-12 cursor-pointer rounded-md border border-line bg-field p-1"
                />

                <span className="rounded-md border border-line bg-field px-3 py-2 font-mono text-xs text-subtle">
                  {color.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Author">
          <div className="space-y-4">
            <Row label="Name">
              <input
                value={author}
                onChange={(e) =>
                  onAuthorChange(e.target.value)
                }
                placeholder="Author name"
                className={inputClass}
              />
            </Row>

            <Row label="Icon URL">
              <input
                value={authorIcon}
                onChange={(e) =>
                  onAuthorIconChange(e.target.value)
                }
                placeholder="https://"
                className={inputClass}
              />
            </Row>
          </div>
        </Section>

        <Section
          title="Fields"
          action={
            <button
              onClick={onAddField}
              className="rounded-md border border-line-strong px-2.5 py-1 text-xs font-medium text-subtle transition-colors hover:bg-line hover:text-ink"
            >
              Add field
            </button>
          }
        >
          {fields.length === 0 ? (
            <p className="rounded-md border border-dashed border-line-strong px-4 py-5 text-center text-xs text-muted">
              No fields added yet.
            </p>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-md border border-line p-3"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-subtle">
                      Field {index + 1}
                    </span>

                    <button
                      onClick={() =>
                        onRemoveField(field.id)
                      }
                      className="text-xs text-muted transition-colors hover:text-danger"
                    >
                      Remove
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
                      placeholder="Name"
                      aria-label={`Field ${index + 1} name`}
                      className={inputClass}
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
                      placeholder="Value"
                      aria-label={`Field ${index + 1} value`}
                      rows={3}
                      className={textareaClass}
                    />

                    <label className="flex cursor-pointer items-center gap-2 text-xs text-subtle">
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
                        className="h-4 w-4 accent-accent"
                      />

                      Inline
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Images">
          <div className="space-y-4">
            <Row label="Thumbnail URL">
              <input
                value={thumbnail}
                onChange={(e) =>
                  onThumbnailChange(e.target.value)
                }
                placeholder="https://"
                className={inputClass}
              />
            </Row>

            <Row label="Image URL">
              <input
                value={image}
                onChange={(e) =>
                  onImageChange(e.target.value)
                }
                placeholder="https://"
                className={inputClass}
              />
            </Row>
          </div>
        </Section>

        <Section title="Footer">
          <div className="space-y-4">
            <Row label="Text">
              <input
                value={footerText}
                onChange={(e) =>
                  onFooterTextChange(e.target.value)
                }
                placeholder="Footer text"
                className={inputClass}
              />
            </Row>

            <Row label="Icon URL">
              <input
                value={footerIcon}
                onChange={(e) =>
                  onFooterIconChange(e.target.value)
                }
                placeholder="https://"
                className={inputClass}
              />
            </Row>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-subtle">
              <input
                type="checkbox"
                checked={showTimestamp}
                onChange={(e) =>
                  onShowTimestampChange(
                    e.target.checked
                  )
                }
                className="h-4 w-4 accent-accent"
              />

              Show timestamp
            </label>
          </div>
        </Section>
      </div>
    </div>
  );
}