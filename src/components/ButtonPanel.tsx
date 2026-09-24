import { MAX_BUTTONS, type LinkButton } from "./buttons";

type ButtonPanelProps = {
  buttons: LinkButton[];
  onAdd: () => void;
  onUpdate: (id: number, property: "label" | "url", value: string) => void;
  onRemove: (id: number) => void;
};

const inputClass =
  "w-full rounded-md border border-line bg-field px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-accent";

export default function ButtonPanel({
  buttons,
  onAdd,
  onUpdate,
  onRemove,
}: ButtonPanelProps) {
  return (
    <div>
      {buttons.length === 0 ? (
        <p className="rounded-md border border-dashed border-line-strong px-4 py-5 text-center text-xs text-muted">
          No buttons added yet.
        </p>
      ) : (
        <div className="space-y-3">
          {buttons.map((button, index) => {
            const urlIsBad =
              button.url.trim() !== "" &&
              !/^https?:\/\/\S+$/i.test(button.url.trim());

            return (
              <div
                key={button.id}
                className="rounded-md border border-line p-3"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-subtle">
                    Button {index + 1}
                  </span>

                  <button
                    onClick={() => onRemove(button.id)}
                    className="text-xs text-muted transition-colors hover:text-danger"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    value={button.label}
                    onChange={(e) =>
                      onUpdate(button.id, "label", e.target.value)
                    }
                    maxLength={80}
                    placeholder="Label"
                    aria-label={`Button ${index + 1} label`}
                    className={inputClass}
                  />

                  <input
                    value={button.url}
                    onChange={(e) =>
                      onUpdate(button.id, "url", e.target.value)
                    }
                    placeholder="https://"
                    aria-label={`Button ${index + 1} link`}
                    className={inputClass}
                  />

                  {urlIsBad && (
                    <p className="text-xs text-danger">
                      The link must start with http:// or https://
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={onAdd}
        disabled={buttons.length >= MAX_BUTTONS}
        className="mt-3 w-full rounded-md border border-line-strong px-3 py-2 text-sm text-subtle transition-colors hover:bg-line hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        {buttons.length >= MAX_BUTTONS
          ? `Maximum ${MAX_BUTTONS} buttons`
          : "Add button"}
      </button>

      <p className="mt-2 text-xs text-muted">
        Webhooks can only send link buttons. A button needs both a
        label and a link to be sent.
      </p>
    </div>
  );
}