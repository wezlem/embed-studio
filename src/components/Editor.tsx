type EditorProps = {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
};

export default function Editor({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: EditorProps) {
  return (
    <div className="rounded-xl bg-[#2b2d31] p-4 h-full">
      <h2 className="mb-4 text-lg font-semibold">📝 Editor</h2>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Embed Title
          </label>

          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter title..."
            className="w-full rounded-lg bg-[#1e1f22] border border-[#3f4147] px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Enter description..."
            rows={6}
            className="w-full rounded-lg bg-[#1e1f22] border border-[#3f4147] px-3 py-2 outline-none resize-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}