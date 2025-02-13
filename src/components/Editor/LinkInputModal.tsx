import { useState, useEffect } from "react";

interface LinkInputModalProps {
  initialUrl?: string;
  onClose: (url?: string) => void;
}

export default function LinkInputModal({
  initialUrl = "",
  onClose,
}: LinkInputModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "Enter") {
        handleSubmit();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [url]);

  const handleSubmit = () => {
    setIsVisible(false);
    onClose(url.trim());
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose(undefined);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96">
        <h3 className="text-lg font-medium mb-4 dark:text-gray-100">
          Add Link
        </h3>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          autoFocus
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
