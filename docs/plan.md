# Hypernotic PRD (Product Requirements Document)

**Last Updated:** 2025-02-01
**Target Release:** Q1 2025

## Context

A minimalist desktop note-taking application combining TextEdit's simplicity with Notion's organizational capabilities. Built for professionals who need both quick capture and structured note management.

**Core Team:**

- Lead Developer (1)
- UX Designer (1)
- QA Engineer (0.5)

**Key Stakeholders:**

- End users (primary)
- Open source contributors
- Security auditors

**Problem Statement:**  
Users waste time switching between simple text editors and complex note apps, leading to fragmented workflows and lost productivity.

## Goals & KPIs

| Goal                       | KPI                     | Target |
| -------------------------- | ----------------------- | ------ |
| Instant note creation      | Time-to-first-keystroke | <1s    |
| Local file management      | File search latency     | <200ms |
| Markdown fluency           | Auto-format accuracy    | 98%    |
| Cross-platform consistency | UI parity score         | 95/100 |

## Constraints & Assumptions

- **Technical:**
  - Must work offline-first
  - Max memory usage: 150MB
  - Tauri v2 filesystem access limitations
- **Design:**
  - Zero visual clutter in default mode
  - Max 3 click depth for features

## Features (P0 MVP)

1. **Core Editor**
   - Tiptap Markdown editor with:
     - Real-time preview (split view)
     - Syntax-aware highlighting
     - Auto-save (configurable interval)
2. **File Management**
   - Recursive directory watching
   - Fuzzy-search (FZF-like)
   - File tree with virtual scrolling
3. **Command Palette**
   - Ctrl+P style interface
   - Action search (new/file/export)
   - Semantic file search

## Release Criteria

- [ ] 100% unit test coverage for file operations
- [ ] <5ms editor response time for 10k-line files
- [ ] Verified secure sandboxing via Tauri
- [ ] Accessibility score ≥90 (WCAG 2.1 AA)

## Success Metrics

- **Adoption:** 30% daily active usage (measured)
- **Performance:** 99th percentile FCP <800ms
- **Reliability:** <0.1% crash rate

## Appendix

- [Technical Design Doc](#)
- [Security Audit Plan](#)
- [UI Kit (Figma)](#)

<!-- Kanban Board -->

## Tasks

| Not Started          | In Progress     | Completed           |
| -------------------- | --------------- | ------------------- |
| Tauri FS integration | Editor core     | Project scaffolding |
| Virtualized tree     | Command palette | CI/CD pipeline      |
