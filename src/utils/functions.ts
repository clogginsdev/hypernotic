import {
  readDir,
  readTextFile,
  writeTextFile,
  mkdir,
} from "@tauri-apps/plugin-fs";
import { BaseDirectory } from "@tauri-apps/api/path";

interface FileEntry {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileEntry[];
}

export async function processEntriesRecursively(
  directory: string
): Promise<FileEntry[]> {
  const entries = await readDir(directory);
  const results: FileEntry[] = [];

  for (const entry of entries) {
    const fullPath = `${directory}/${entry.name}`;

    if (entry.isDirectory) {
      const children = await processEntriesRecursively(fullPath);
      results.push({
        name: entry.name,
        path: fullPath,
        isDirectory: true,
        children,
      });
    } else if (entry.name.endsWith(".md")) {
      results.push({
        name: entry.name,
        path: fullPath,
        isDirectory: false,
      });
    }
  }

  results.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.name.localeCompare(b.name);
  });

  return results;
}

export async function loadFileContent(path: string): Promise<string> {
  return await readTextFile(path);
}

export async function saveFileContent(path: string, content: string) {
  try {
    await writeTextFile(path, content);
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
}

export const loadRecentDirectories = async (): Promise<string[]> => {
  try {
    // First, ensure the app data directory exists
    await mkdir("", {
      recursive: true,
      baseDir: BaseDirectory.AppData,
    });

    // Try to read the file
    const content = await readTextFile("recent-dirs.json", {
      baseDir: BaseDirectory.AppData,
    });
    return JSON.parse(content);
  } catch (error: any) {
    // If the file doesn't exist, create it with an empty array
    if (error.toString().includes("No such file or directory")) {
      await writeTextFile("recent-dirs.json", JSON.stringify([]), {
        baseDir: BaseDirectory.AppData,
      });
      return [];
    }
    console.error("Failed to load recent directories:", error);
    return [];
  }
};

export const saveRecentDirectories = async (
  directories: string[]
): Promise<void> => {
  try {
    await writeTextFile("recent-dirs.json", JSON.stringify(directories), {
      baseDir: BaseDirectory.AppData,
    });
  } catch (error) {
    console.error("Failed to save recent directories:", error);
  }
};

export async function createDirectory(path: string): Promise<void> {
  try {
    await mkdir(path, {
      recursive: true, // Enable creating nested directories
    });
  } catch (error) {
    console.error("Failed to create directory:", error);
    throw error;
  }
}
