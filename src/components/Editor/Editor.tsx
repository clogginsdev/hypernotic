import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Code,
  Heading1,
  Heading2,
  Quote,
  ListOrdered,
  List,
  Link as LinkIcon,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import LinkInputModal from "./LinkInputModal";
import { Markdown } from "tiptap-markdown";
import { writeTextFile, rename } from "@tauri-apps/plugin-fs";
import { save, open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";
import DirectoryModal from "./DirectoryModal";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import "highlight.js/styles/github-dark.css";
import { listen } from "@tauri-apps/api/event";
import { readText } from "@tauri-apps/plugin-clipboard-manager";
import AboutModal from "./AboutModal";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";

const lowlight = createLowlight(common);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("javascript", js);
lowlight.register("typescript", ts);

export default function Editor() {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [fileName, setFileName] = useState("untitled.md");
  const [filePath, setFilePath] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState<string>("");
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showKeyboardShortcutsModal, setShowKeyboardShortcutsModal] =
    useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Markdown.configure({
        html: false,
        transformCopiedText: true,
        transformPastedText: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "plaintext",
        HTMLAttributes: {
          class: "rounded-md overflow-hidden bg-gray-900 dark:bg-gray-950",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400",
          rel: "noopener noreferrer",
          target: "_blank",
        },
        validate: (_href) => true,
      }),
      Underline,
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-base lg:prose-lg mx-auto focus:outline-none dark:prose-invert prose-pre:p-0",
      },
    },
    onUpdate: ({ editor: _editor }) => {
      setIsSaved(false);
    },
  });

  const handleSaveFile = useCallback(async () => {
    if (!editor) return;

    try {
      const content = editor.storage.markdown.getMarkdown();

      // If we have a file path, this is an existing file
      if (filePath) {
        const currentName = filePath.split("/").pop();

        // Check if we're renaming
        if (currentName !== fileName) {
          const parentDir = filePath.substring(0, filePath.lastIndexOf("/"));
          const newPath = `${parentDir}/${fileName}`;

          // First rename the file, then write content to the new location.
          await rename(filePath, newPath);
          await writeTextFile(newPath, content);
          setFilePath(newPath);
          setIsSaved(true);
          return;
        }

        // Just a regular save on the same file path
        await writeTextFile(filePath, content);
        setIsSaved(true);
        return;
      }

      // New file save
      const savePath = await save({
        filters: [{ name: "Markdown", extensions: ["md"] }],
        defaultPath: fileName,
      });

      if (savePath) {
        await writeTextFile(savePath, content);
        setFilePath(savePath);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error in save operation:", error);
      setIsSaved(false);
      // Revert filename on error
      if (filePath) {
        setFileName(filePath.split("/").pop() || "untitled.md");
      }
    }
  }, [editor, fileName, filePath]);

  const handleOpenFile = async (selectedPath?: string) => {
    if (!editor) return;

    try {
      // If we have a selectedPath, it's coming from DirectoryModal
      if (selectedPath) {
        const content = await readTextFile(selectedPath);
        const name = selectedPath.split("/").pop() || "untitled.md";

        editor.commands.setContent(content);
        setFilePath(selectedPath);
        setFileName(name); // Ensure this is set for DirectoryModal files
        setIsSaved(true);
        return;
      }

      // Handle regular file open dialog
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "Markdown",
            extensions: ["md"],
          },
        ],
      });

      if (selected) {
        const content = await readTextFile(selected as string);
        const name = selected.toString().split("/").pop() || "untitled.md";

        editor.commands.setContent(content);
        setFilePath(selected as string);
        setFileName(name);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newName = e.target.value;
    // Ensure the file name ends with .md
    if (!newName.endsWith(".md")) {
      newName = newName.replace(/\.md$/, "") + ".md";
    }
    setFileName(newName);
  };

  const handleNewFile = () => {
    if (!editor) return;
    editor.commands.clearContent();
    setFilePath("");
    setFileName("untitled.md");
    setIsSaved(false);
  };

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Space
      if (e.ctrlKey && e.code === "Space") {
        e.preventDefault(); // Prevent default browser behavior
        setIsDirectoryModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Add event listener for menu events
  useEffect(() => {
    const unlisten = listen("menu-event", async (event) => {
      if (!editor) return;
      const menuId = event.payload as string;

      switch (menuId) {
        case "new-file":
          handleNewFile();
          break;
        case "open-file":
          handleOpenFile();
          break;
        case "open-folder":
          setIsDirectoryModalOpen(true);
          break;
        case "save-file":
          handleSaveFile();
          break;
        // Add edit menu handlers
        case "undo":
          editor.commands.undo();
          break;
        case "redo":
          editor.commands.redo();
          break;
        case "cut":
          document.execCommand("cut");
          break;
        case "copy":
          document.execCommand("copy");
          break;
        case "paste":
          try {
            const clipboardText = await readText();
            if (clipboardText) {
              editor.commands.insertContent(clipboardText);
            }
          } catch (error) {
            console.error("Failed to paste from clipboard:", error);
            // Fallback to browser paste
            document.execCommand("paste");
          }
          break;
        case "about":
          setShowAboutModal(true);
          break;
        case "keyboard-shortcuts":
          setShowKeyboardShortcutsModal(true);
          break;
      }
    });

    return () => {
      unlisten.then((unlistenFn) => unlistenFn());
    };
  }, [editor, handleSaveFile]); // Added handleSaveFile so the latest state is used
  if (!editor) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Remove the entire menu bar div and just keep the main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Centered File Name */}
          <div className="text-center mb-6 flex flex-col items-center justify-center gap-1">
            <input
              type="text"
              value={fileName}
              onChange={(e) => {
                handleFileNameChange(e);
              }}
              className="text-lg font-medium bg-transparent text-center focus:outline-none dark:text-gray-100 w-full"
              placeholder="Untitled Document"
            />
            <span
              className={`px-2 py-0.5 text-sm rounded ${
                isSaved
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
              }`}
            >
              {isSaved ? "Saved" : "Unsaved"}
            </span>
          </div>

          {editor && (
            <BubbleMenu
              editor={editor}
              tippyOptions={{ duration: 100 }}
              className="flex overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  editor.isActive("bold") ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  editor.isActive("italic")
                    ? "bg-gray-100 dark:bg-gray-800"
                    : ""
                }`}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  editor.isActive("code") ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
                title="Code"
              >
                <Code className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  editor.isActive("heading", { level: 1 })
                    ? "bg-gray-100 dark:bg-gray-800"
                    : ""
                }`}
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  editor.isActive("heading", { level: 2 })
                    ? "bg-gray-100 dark:bg-gray-800"
                    : ""
                }`}
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  editor.isActive("bulletList")
                    ? "bg-gray-100 dark:bg-gray-800"
                    : ""
                }`}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  editor.isActive("orderedList")
                    ? "bg-gray-100 dark:bg-gray-800"
                    : ""
                }`}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  editor.isActive("blockquote")
                    ? "bg-gray-100 dark:bg-gray-800"
                    : ""
                }`}
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setLinkUrl(editor.getAttributes("link").href || "");
                  setShowLinkModal(true);
                }}
                className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  editor.isActive("link") ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
                title="Link"
              >
                <LinkIcon className="h-4 w-4" />
              </button>
            </BubbleMenu>
          )}
          <EditorContent
            editor={editor}
            className="min-h-[500px] prose dark:prose-invert max-w-none
              prose-pre:p-4
              prose-pre:bg-gray-50
              prose-code:text-gray-500
              dark:prose-code:text-gray-100
              prose-pre:my-0
              [&_.hljs]:p-4
              [&_.hljs]:rounded-md
              [&_.hljs]:bg-gray-900 
              dark:[&_.hljs]:bg-gray-950"
          />
          {showLinkModal && (
            <LinkInputModal
              initialUrl={linkUrl}
              onClose={(newUrl) => {
                setShowLinkModal(false);
                if (typeof newUrl === "string") {
                  const { from, to } = editor.state.selection;
                  const text = editor.state.doc.textBetween(from, to, " ");

                  if (newUrl === "") {
                    editor.chain().focus().unsetLink().run();
                  } else {
                    let processedUrl = newUrl;
                    if (
                      !processedUrl.startsWith("http://") &&
                      !processedUrl.startsWith("https://")
                    ) {
                      processedUrl = `https://${processedUrl}`;
                    }

                    editor
                      .chain()
                      .focus()
                      .setTextSelection({ from, to })
                      .setLink({ href: processedUrl })
                      .run();

                    if (text.length === 0) {
                      editor
                        .chain()
                        .focus()
                        .insertContent({
                          type: "text",
                          text: processedUrl,
                          marks: [
                            { type: "link", attrs: { href: processedUrl } },
                          ],
                        })
                        .run();
                    }
                  }
                }
              }}
            />
          )}
          {isDirectoryModalOpen && (
            <DirectoryModal
              isOpen={isDirectoryModalOpen}
              onClose={() => setIsDirectoryModalOpen(false)}
              onFileSelect={(path) => {
                handleOpenFile(path);
                setIsDirectoryModalOpen(false);
              }}
              initialPath={currentDirectory}
              onDirectoryChange={setCurrentDirectory}
            />
          )}
          {showAboutModal && (
            <AboutModal
              isOpen={showAboutModal}
              onClose={() => setShowAboutModal(false)}
            />
          )}
          {showKeyboardShortcutsModal && (
            <KeyboardShortcutsModal
              isOpen={showKeyboardShortcutsModal}
              onClose={() => setShowKeyboardShortcutsModal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
