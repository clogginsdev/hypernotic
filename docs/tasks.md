# Hypernotic Development Tasks

## Core Editor (P0)

| Task                                | Owner       | Status      | Priority |
| ----------------------------------- | ----------- | ----------- | -------- |
| Set up Tiptap+React integration     | FE Engineer | Not Started | P0       |
| Configure Markdown extensions       | FE Engineer | Not Started | P0       |
| Auto-save system (Zustand+Tauri FS) | BE Engineer | Not Started | P0       |
| Syntax highlighting theme system    | UX Engineer | Not Started | P1       |

## File Management (P0)

| Task                            | Owner       | Status      | Priority |
| ------------------------------- | ----------- | ----------- | -------- |
| Tauri FS directory watcher      | BE Engineer | Not Started | P0       |
| Virtualized file tree component | FE Engineer | Not Started | P0       |
| FZF-like search implementation  | BE Engineer | Not Started | P0       |
| File operations API (CRUD)      | BE Engineer | Not Started | P1       |
| Recent files history            | FE Engineer | Not Started | P2       |

## Command Palette (P0)

| Task                         | Owner       | Status      | Priority |
| ---------------------------- | ----------- | ----------- | -------- |
| Keyboard shortcut subsystem  | FE Engineer | Not Started | P0       |
| Action search integration    | FE Engineer | In Progress | P0       |
| Semantic file search backend | BE Engineer | Not Started | P0       |
| Command palette UI component | UX Engineer | Not Started | P1       |

## Quality Assurance

- [ ] Unit test coverage ≥90% (Vitest)
- [ ] E2E test scenarios (Playwright)
- [ ] Performance benchmarking
- [ ] Security audit checklist

## Documentation

- [ ] Architecture decision records
- [ ] API documentation (TypeDoc)
- [ ] User guide (MDX format)
- [ ] Contributor onboarding docs

**Key Technical Requirements:**

1. Memory constraints: Implement virtual scrolling for >10k items
2. Security: File validation layer before FS operations
3. Performance: Editor must handle 50mb+ files gracefully

**Design Validation Checklist:**
✓ Apple-style minimalism  
✓ WCAG 2.1 AA compliance  
✓ Cross-platform theming system  
✓ Motion design principles

**Recent Updates:**

- 2025-02-01: Finalized MVP scope in PRD
- 2025-01-28: Security requirements locked
- 2025-01-25: UI kit approved by stakeholders
