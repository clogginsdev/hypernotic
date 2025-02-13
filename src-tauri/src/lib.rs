#[cfg_attr(mobile, tauri::mobile_entry_point)]
use tauri::Emitter;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let handle = app.handle();

            // Main menu
            let main_menu = tauri::menu::SubmenuBuilder::new(handle, "Main")
                .item(
                    &tauri::menu::MenuItemBuilder::new("Exit")
                        .id("exit")
                        .accelerator("CmdOrCtrl+Q")
                        .build(handle)?,
                )
                .build()?;
            // Create File submenu with more standard options
            let file_submenu = tauri::menu::SubmenuBuilder::new(handle, "File")
                .item(
                    &tauri::menu::MenuItemBuilder::new("New")
                        .id("new-file")
                        .accelerator("CmdOrCtrl+N")
                        .build(handle)?,
                )
                .item(
                    &tauri::menu::MenuItemBuilder::new("Open...")
                        .id("open-file")
                        .accelerator("CmdOrCtrl+O")
                        .build(handle)?,
                )
                .item(
                    &tauri::menu::MenuItemBuilder::new("Open Folder...")
                        .id("open-folder")
                        .accelerator("CmdOrCtrl+K")
                        .build(handle)?,
                )
                .item(
                    &tauri::menu::MenuItemBuilder::new("Save")
                        .id("save-file")
                        .accelerator("CmdOrCtrl+S")
                        .build(handle)?,
                )
                .build()?;

            // Create Edit submenu
            let edit_submenu = tauri::menu::SubmenuBuilder::new(handle, "Edit")
                .item(
                    &tauri::menu::MenuItemBuilder::new("Undo")
                        .id("undo")
                        .accelerator("CmdOrCtrl+Z")
                        .build(handle)?,
                )
                .item(
                    &tauri::menu::MenuItemBuilder::new("Redo")
                        .id("redo")
                        .accelerator("CmdOrCtrl+Shift+Z")
                        .build(handle)?,
                )
                .separator()
                .item(
                    &tauri::menu::MenuItemBuilder::new("Cut")
                        .id("cut")
                        .accelerator("CmdOrCtrl+X")
                        .build(handle)?,
                )
                .item(
                    &tauri::menu::MenuItemBuilder::new("Copy")
                        .id("copy")
                        .accelerator("CmdOrCtrl+C")
                        .build(handle)?,
                )
                .item(
                    &tauri::menu::MenuItemBuilder::new("Paste")
                        .id("paste")
                        .accelerator("CmdOrCtrl+V")
                        .build(handle)?,
                )
                .build()?;

            let help_submenu = tauri::menu::SubmenuBuilder::new(handle, "Help")
                .item(
                    &tauri::menu::MenuItemBuilder::new("About")
                        .id("about")
                        .build(handle)?,
                )
                .item(
                    &tauri::menu::MenuItemBuilder::new("Keyboard Shortcuts")
                        .id("keyboard-shortcuts")
                        .accelerator("CmdOrCtrl+Shift+K")
                        .build(handle)?,
                )
                .build()?;

            // Build main menu
            let menu = tauri::menu::MenuBuilder::new(handle)
                .item(&main_menu)
                .item(&file_submenu)
                .item(&edit_submenu)
                .item(&help_submenu)
                .build()?;

            app.set_menu(menu)?;

            // Menu event handling
            app.on_menu_event(|app, event| match event.id().as_ref() {
                "new-file" => app.emit("menu-event", "new-file").unwrap(),
                "open-file" => app.emit("menu-event", "open-file").unwrap(),
                "open-folder" => app.emit("menu-event", "open-folder").unwrap(),
                "save-file" => app.emit("menu-event", "save-file").unwrap(),
                "exit" => app.exit(0),
                "undo" => app.emit("menu-event", "undo").unwrap(),
                "redo" => app.emit("menu-event", "redo").unwrap(),
                "cut" => app.emit("menu-event", "cut").unwrap(),
                "copy" => app.emit("menu-event", "copy").unwrap(),
                "paste" => app.emit("menu-event", "paste").unwrap(),
                "about" => app.emit("menu-event", "about").unwrap(),
                "keyboard-shortcuts" => app.emit("menu-event", "keyboard-shortcuts").unwrap(),
                _ => {}
            });

            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
