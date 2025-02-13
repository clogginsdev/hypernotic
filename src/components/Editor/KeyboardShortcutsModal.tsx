import { X } from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutGroup {
  title: string;
  shortcuts: { key: string; description: string }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "File Operations",
    shortcuts: [
      { key: "Cmd/Ctrl + N", description: "Create new file" },
      { key: "Cmd/Ctrl + O", description: "Open file" },
      { key: "Cmd/Ctrl + K", description: "Open folder" },
      { key: "Cmd/Ctrl + S", description: "Save file" },
      { key: "Cmd/Ctrl + Q", description: "Exit application" },
    ],
  },
  {
    title: "Edit Operations",
    shortcuts: [
      { key: "Cmd/Ctrl + Z", description: "Undo" },
      { key: "Cmd/Ctrl + Shift + Z", description: "Redo" },
      { key: "Cmd/Ctrl + X", description: "Cut" },
      { key: "Cmd/Ctrl + C", description: "Copy" },
      { key: "Cmd/Ctrl + V", description: "Paste" },
    ],
  },
  {
    title: "Navigation",
    shortcuts: [
      { key: "Ctrl + Space", description: "Open directory browser" },
      { key: "Cmd/Ctrl + Shift + K", description: "Show keyboard shortcuts" },
    ],
  },
];

export default function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-[600px] max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold dark:text-gray-100">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-6">
          {shortcutGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-lg font-medium mb-3 dark:text-gray-200">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-gray-600 dark:text-gray-300">
                      {shortcut.description}
                    </span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono dark:text-gray-300">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
