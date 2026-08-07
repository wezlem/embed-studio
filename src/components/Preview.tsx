type PreviewProps = {
  title: string;
  description: string;
};

export default function Preview({
  title,
  description,
}: PreviewProps) {
  return (
    <div className="h-full rounded-xl bg-[#2b2d31] p-4">
      <h2 className="mb-4 text-lg font-semibold">
        👀 Live Preview
      </h2>

      <div className="rounded-lg bg-[#313338] p-5">
        <div className="flex gap-3">
          <img
            src="https://cdn.discordapp.com/embed/avatars/0.png"
            alt="Bot Avatar"
            className="h-10 w-10 rounded-full"
          />

          <div className="flex-1">
            <div className="mb-2">
              <span className="font-semibold">
                Embed Studio
              </span>

              <span className="ml-2 text-xs text-gray-400">
                Today at 23:00
              </span>
            </div>

            <div className="rounded border-l-4 border-blue-500 bg-[#2b2d31] p-4">
              <h3 className="mb-2 text-lg font-bold">
                {title || "Embed Title"}
              </h3>

              <p className="whitespace-pre-wrap text-sm text-gray-300">
                {description || "Your description will appear here."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}