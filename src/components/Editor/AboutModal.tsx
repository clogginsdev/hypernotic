import { X } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-[500px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold dark:text-gray-100">
            About Hypernotic
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Version:</span>
              <span>1.0.0</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Website:</span>
              <a
                href="https://hypernotic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                hypernotic.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Author:</span>
              <a
                href="https://loggins.cc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Chris Loggins
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
