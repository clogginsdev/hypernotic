# Contributing to Hypernotic

Thank you for your interest in contributing to Hypernotic! This document provides guidelines and instructions for contributing to make the process smooth and effective for everyone involved.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Standards](#coding-standards)
- [Feature Proposals](#feature-proposals)
- [Bug Reports](#bug-reports)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and constructive environment. We expect all contributors to:

- Be respectful of differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what's best for the community and users
- Show empathy towards other community members

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/clogginsdev/hypernotic.git
   cd hypernotic
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Process

1. **Environment Setup**

   - Ensure you have the [prerequisites](README.md#prerequisites) installed
   - Follow the [development setup](README.md#development) instructions

2. **Making Changes**

   - Write clear, concise commit messages
   - Keep commits atomic and focused
   - Add tests for new functionality
   - Update documentation as needed

3. **Testing**
   - Run the project: `pnpm tauri dev`
   - Test the basic functionality of the app to ensure it works as expected
   - Test your changes to ensure they work as expected and don't break the app

## Pull Request Guidelines

1. **Before Submitting**

   - Ensure your code follows our coding standards
   - Throughly test your changes
   - Update/add documentation if needed
   - Rebase your branch on the latest main

2. **PR Description**

   - Clearly describe the changes
   - Link to related issues
   - Include screenshots for UI changes
   - List any breaking changes

3. **Quality Requirements**
   - No auto-generated code from AI tools without thorough review and modification
   - All new features must be thoroughly tested
   - Changes should maintain or improve performance
   - Code should be self-documenting with clear comments where necessary

## Coding Standards

1. **TypeScript**

   - Use strict type checking
   - Follow the existing TypeScript configuration
   - Avoid `any` types unless absolutely necessary

2. **React**

   - Use functional components and hooks
   - Follow React best practices
   - Maintain component modularity

3. **Styling**

   - Use Tailwind CSS classes
   - Follow the existing design system
   - Ensure dark mode compatibility

4. **File Organization**
   - Follow the established project structure
   - Place components in appropriate directories
   - Use consistent file naming conventions

## Feature Proposals

1. **Before Development**

   - Open an issue describing the feature
   - Wait for discussion and approval
   - Ensure the feature benefits the general user base

2. **Requirements**
   - Must align with project goals
   - Should be maintainable
   - Must consider performance implications
   - Should work across all supported platforms

## Bug Reports

When reporting bugs:

1. Use the issue template
2. Include clear reproduction steps
3. Specify your environment details
4. Include relevant error messages
5. Add screenshots if applicable

## License Compliance

- All contributions must comply with the [CC BY-NC 4.0 license](LICENSE)
- Ensure third-party dependencies are compatible with our license

## Questions?

If you have questions, feel free to:

1. Open an issue for discussion
2. Ask in the project discussions
3. Contact the maintainers

Thank you for contributing to Hypernotic! 🚀
