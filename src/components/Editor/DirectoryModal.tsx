import { useState, useEffect } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readDir } from "@tauri-apps/plugin-fs";
import { Folder, File, ChevronRight, X, ChevronLeft } from "lucide-react";

interface DirectoryEntry {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: DirectoryEntry[];
}

interface Breadcrumb {
  name: string;
  path: string;
}

interface DirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect?: (path: string) => void;
  initialPath: string;
  onDirectoryChange: (path: string) => void;
}

export default function DirectoryModal({
  isOpen,
  onClose,
  onFileSelect,
  initialPath,
  onDirectoryChange,
}: DirectoryModalProps) {
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Determine the effective initial path
      // Check if initialPath was passed as a prop, otherwise check localStorage
      let effectiveInitialPath = initialPath;
      const storedInitial = window.localStorage.getItem("initialDirectoryPath");
      if (!effectiveInitialPath && storedInitial) {
        effectiveInitialPath = storedInitial;
      }
      if (!effectiveInitialPath) {
        // No initial directory available, so prompt the user using the open dialog
        handleSelectDirectory();
      } else {
        console.log("Initial path:", effectiveInitialPath);
        const pathParts = effectiveInitialPath.split("/");
        const crumbs = pathParts
          .map((part, index) => ({
            name: part || "Root",
            path: pathParts.slice(0, index + 1).join("/"),
          }))
          .filter((crumb) => crumb.name);
        setBreadcrumbs(crumbs);
        // Notify parent of the directory change and load its contents
        onDirectoryChange(effectiveInitialPath);
        loadDirectoryContents(effectiveInitialPath);
      }
    }
  }, [isOpen, initialPath]);

  const handleSelectDirectory = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
      });

      if (selected) {
        // Store the selected directory path in local storage as the initial path
        window.localStorage.setItem("initialDirectoryPath", selected as string);
        onDirectoryChange(selected as string);
        await loadDirectoryContents(selected as string);
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Error selecting directory:", error);
      onClose();
    }
  };

  const loadDirectoryContents = async (path: string) => {
    setIsLoading(true);
    try {
      const contents = await readDir(path);
      const processedEntries: DirectoryEntry[] = contents
        .filter(
          (entry) =>
            // Only show directories and markdown files
            entry.isDirectory || entry.name?.toLowerCase().endsWith(".md")
        )
        .map((entry) => ({
          name: entry.name ?? "",
          path: `${path}/${entry.name}`,
          isDirectory: entry.isDirectory ?? false,
        }));

      const pathParts = path.split("/");
      const crumbs = pathParts
        .map((part, index) => ({
          name: part || "Root",
          path: pathParts.slice(0, index + 1).join("/"),
        }))
        .filter((crumb) => crumb.name);
      setBreadcrumbs(crumbs);

      // Store the current path in local storage as the user navigates
      window.localStorage.setItem("currentPath", path);

      processedEntries.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

      setEntries(processedEntries);
    } catch (error) {
      console.error("Error loading directory contents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileClick = (path: string) => {
    if (onFileSelect) {
      onFileSelect(path);
      onClose();
    }
  };

  const handleDirectoryClick = async (path: string) => {
    console.log("Navigating to:", path);
    onDirectoryChange(path);
    await loadDirectoryContents(path);
  };

  const handleBreadcrumbClick = async (path: string) => {
    console.log("Navigating to:", path);
    onDirectoryChange(path);
    await loadDirectoryContents(path);
  };

  // Display current directory name only (from the last breadcrumb)
  const currentDirectoryName =
    breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].name : "Root";

  // Determine the current path from breadcrumbs
  const currentPath =
    breadcrumbs.length > 0
      ? breadcrumbs[breadcrumbs.length - 1].path
      : initialPath;

  // Retrieve the initial directory from local storage (or fallback to initialPath)
  const storedInitialPath =
    window.localStorage.getItem("initialDirectoryPath") || initialPath;

  // Hide the back button if the current path equals the initial directory
  const shouldShowBackArrow =
    breadcrumbs.length > 1 && currentPath !== storedInitialPath;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[600px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-medium dark:text-gray-100">
              Directory Contents
            </h2>
            <button
              onClick={handleSelectDirectory}
              className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Change Directory
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 flex items-center gap-2">
          {shouldShowBackArrow && (
            <button
              onClick={() =>
                handleBreadcrumbClick(breadcrumbs[breadcrumbs.length - 2].path)
              }
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              title="Go back"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <div className="flex items-center gap-1 overflow-x-auto">
            {/* Display only the current directory name */}
            <span className="text-lg font-medium dark:text-gray-300 text-gray-600">
              {currentDirectoryName}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
          ) : entries.length > 0 ? (
            <div className="space-y-1">
              {entries.map((entry) => (
                <button
                  key={entry.path}
                  onClick={() =>
                    entry.isDirectory
                      ? handleDirectoryClick(entry.path)
                      : handleFileClick(entry.path)
                  }
                  className="w-full flex items-center px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  {entry.isDirectory ? (
                    <>
                      <Folder className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200">
                        {entry.name}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                    </>
                  ) : (
                    <>
                      <File className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-700 dark:text-gray-200">
                        {entry.name}
                      </span>
                    </>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              {initialPath
                ? "No files or directories found"
                : "Select a directory to view its contents"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
