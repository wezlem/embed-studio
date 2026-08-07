import { useState } from "react";
import Editor from "./components/Editor";
import Preview from "./components/Preview";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="min-h-screen bg-[#313338] text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#3f4147] px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">🎨 Embed Studio</h1>
          <p className="text-sm text-gray-400">
            Build beautiful Discord embeds.
          </p>
        </div>

        <button className="rounded-lg border border-[#4f545c] px-4 py-2 transition hover:bg-[#3f4147]">
          🌙 Dark
        </button>
      </header>

      <main className="grid h-[calc(100vh-81px)] grid-cols-2 gap-4 p-4">
        <Editor
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
        />

        <Preview
          title={title}
          description={description}
        />
      </main>
    </div>
  );
}

export default App;