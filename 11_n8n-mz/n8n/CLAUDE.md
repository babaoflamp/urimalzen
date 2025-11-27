# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in the n8n repository.

## Project Overview

n8n is a workflow automation platform written in TypeScript, using a monorepo
structure managed by pnpm workspaces. It consists of a Node.js backend, Vue.js
frontend, and extensible node-based workflow engine.

## Requirements

- **Node.js:** >= 22.16
- **pnpm:** >= 10.18.3 (install via corepack: `corepack enable && corepack prepare --activate`)
- **Build tools:** gcc, g++, make (Linux), Xcode Command Line Tools (macOS)

## General Guidelines

- Always use pnpm
- We use Linear as a ticket tracking system
- We use Posthog for feature flags
- When starting to work on a new ticket – create a new branch from fresh
  master with the name specified in Linear ticket
- When creating a new branch for a ticket in Linear - use the branch name
  suggested by linear
- Use mermaid diagrams in MD files when you need to visualise something

## Essential Commands

### Initial Setup
After cloning the repository:
```bash
pnpm install    # Install all dependencies and link packages
pnpm build      # Build all packages (required before first run)
```

### Development
- `pnpm dev` - Start full-stack development with hot reload (resource-intensive)
- `pnpm dev:be` - Backend-only development (excludes editor-ui, design-system)
- `pnpm dev:fe` - Frontend-only development (editor-ui + design-system)
- `pnpm dev:ai` - AI/LangChain nodes development
- `pnpm start` - Start n8n in production mode
- `pnpm start --tunnel` - Start with tunnel for webhook testing

**Selective Package Development:**
For resource-constrained environments, develop specific packages:
```bash
# Terminal 1: Build and watch nodes package
cd packages/nodes-base && pnpm dev

# Terminal 2: Run CLI with hot reload
cd packages/cli && N8N_DEV_RELOAD=true pnpm dev
```

### Building
Use `pnpm build` to build all packages. ALWAYS redirect the output of the
build command to a file:

```bash
pnpm build > build.log 2>&1
```

You can inspect the last few lines of the build log file to check for errors:
```bash
tail -n 20 build.log
```

For individual packages:
```bash
cd packages/cli && pnpm build
```

### Testing
- `pnpm test` - Run all tests
- `pnpm test:affected` - Runs tests based on what has changed since the last commit
- `pnpm test:ci` - Run all tests in CI mode (sequential)
- `pnpm test:ci:backend` - Run only backend tests
- `pnpm test:ci:frontend` - Run only frontend tests

**Running specific tests:**
Navigate to the package directory first:
```bash
cd packages/cli
pnpm test <test-file>
```

**Code Coverage:**
Enable coverage reporting locally:
```bash
COVERAGE_ENABLED=true pnpm test
```
View results in the `coverage` folder or use VSCode Coverage Gutters extension.

**E2E Tests (Playwright):**
```bash
pnpm --filter=n8n-playwright test:local                    # Run all E2E tests
pnpm --filter=n8n-playwright test:local --ui               # Interactive UI mode
pnpm --filter=n8n-playwright test:local --grep="test-name" # Specific tests
pnpm test:show:report                                       # Show test report
```
See `packages/testing/playwright/README.md` for details.

**Directory Navigation:**
When changing directories, use `pushd` to navigate and `popd` to return.
Use `pwd` to check your current directory.

### Code Quality
- `pnpm lint` - Lint code
- `pnpm lint:fix` - Auto-fix linting issues
- `pnpm typecheck` - Run type checks
- `pnpm format` - Format code with Biome
- `pnpm format:check` - Check code formatting

Always run lint and typecheck before committing code to ensure quality.
Execute these commands from within the specific package directory you're
working on (e.g., `cd packages/cli && pnpm lint`). Run the full repository
check only when preparing the final PR. When your changes affect type
definitions, interfaces in `@n8n/api-types`, or cross-package dependencies,
build the system before running lint and typecheck.

### Other Useful Commands
- `pnpm watch` - Watch and rebuild packages on changes
- `pnpm clean` - Clean build artifacts
- `pnpm reset` - Reset entire workspace (removes node_modules and rebuilds)
- `pnpm webhook` - Start webhook server only
- `pnpm worker` - Start worker process only

## Architecture Overview

**Monorepo Structure:** pnpm workspaces with Turbo build orchestration

### Package Structure

The monorepo is organized into these key packages:

- **`packages/@n8n/api-types`**: Shared TypeScript interfaces between frontend and backend
- **`packages/workflow`**: Core workflow interfaces and types
- **`packages/core`**: Workflow execution engine
- **`packages/cli`**: Express server, REST API, and CLI commands
- **`packages/editor-ui`**: Vue 3 frontend application
- **`packages/@n8n/i18n`**: Internationalization for UI text
- **`packages/nodes-base`**: Built-in nodes for integrations
- **`packages/@n8n/nodes-langchain`**: AI/LangChain nodes
- **`@n8n/design-system`**: Vue component library for UI consistency
- **`@n8n/config`**: Centralized configuration management
- **`packages/node-dev`**: CLI tool for creating custom nodes
- **`packages/testing`**: Testing utilities and E2E test suites

## Technology Stack

- **Frontend:** Vue 3 + TypeScript + Vite + Pinia + Storybook UI Library
- **Backend:** Node.js + TypeScript + Express + TypeORM
- **Testing:** Jest (unit) + Vitest (frontend unit) + Playwright (E2E)
- **Database:** TypeORM with SQLite/PostgreSQL/MySQL support
- **Code Quality:** Biome (for formatting) + ESLint + lefthook git hooks
- **Build System:** Turbo (monorepo orchestration) + TypeScript compiler

### Key Architectural Patterns

1. **Dependency Injection**: Uses `@n8n/di` for IoC container
2. **Controller-Service-Repository**: Backend follows MVC-like pattern
3. **Event-Driven**: Internal event bus for decoupled communication
4. **Context-Based Execution**: Different contexts for different node types
5. **State Management**: Frontend uses Pinia stores
6. **Design System**: Reusable components and design tokens are centralized in
   `@n8n/design-system`, where all pure Vue components should be placed to
   ensure consistency and reusability

## Key Development Patterns

- Each package has isolated build configuration and can be developed independently
- Hot reload works across the full stack during development
- Node development uses dedicated `node-dev` CLI tool
- Workflow tests are JSON-based for integration testing
- AI features have dedicated development workflow (`pnpm dev:ai`)

### TypeScript Best Practices
- **NEVER use `any` type** - use proper types or `unknown`
- **Avoid type casting with `as`** - use type guards or type predicates instead
- **Define shared interfaces in `@n8n/api-types`** package for FE/BE communication
- **Do not use `ts-ignore`** - fix the underlying type issue instead

### Error Handling
- Don't use `ApplicationError` class in CLI and nodes for throwing errors,
  because it's deprecated. Use `UnexpectedError`, `OperationalError` or
  `UserError` instead.
- Import from appropriate error classes in each package

### Frontend Development
- **All UI text must use i18n** - add translations to `@n8n/i18n` package
- **Use CSS variables directly** - never hardcode spacing as px values
- **data-test-id must be a single value** (no spaces or multiple values)
- **Avoid repetitive code** - reuse existing components and parameters

When implementing CSS, refer to `packages/frontend/CLAUDE.md` for guidelines on
CSS variables and styling conventions.

### Testing Guidelines
- **Always work from within the package directory** when running tests
- **Mock all external dependencies** in unit tests
- **Confirm test cases with user** before writing unit tests
- **Typecheck is critical before committing** - always run `pnpm typecheck`
- **When modifying pinia stores**, check for unused computed properties
- **PRs must include tests** - unit tests, workflow tests for nodes, and UI tests when applicable

What we use for testing and writing tests:
- For testing nodes and other backend components, we use Jest for unit tests. Examples can be found in `packages/nodes-base/nodes/**/*test*`.
- We use `nock` for HTTP mocking in tests
- For frontend we use `vitest`
- For E2E tests we use Playwright. Run with `pnpm --filter=n8n-playwright test:local`.
  See `packages/testing/playwright/README.md` for details.

### Common Development Tasks

When implementing features:
1. Define API types in `packages/@n8n/api-types`
2. Implement backend logic in `packages/cli` module, follow
   `packages/cli/scripts/backend-module/backend-module.guide.md`
3. Add API endpoints via controllers
4. Update frontend in `packages/editor-ui` with i18n support
5. Write tests with proper mocks
6. Run `pnpm typecheck` to verify types

### Development Workflow Example

**Basic workflow:**
```bash
# 1. Start development mode
pnpm dev

# 2. Make your changes

# 3. Test in production mode
pnpm build
pnpm start

# 4. Run tests
pnpm test

# 5. Check code quality
pnpm lint
pnpm typecheck

# 6. Commit and create PR
```

**Custom node development:**
```bash
# Terminal 1: Watch node package
cd packages/nodes-base
pnpm watch

# Terminal 2: Run CLI with hot reload
cd packages/cli
N8N_DEV_RELOAD=true pnpm dev
```

## Github Guidelines

### PR Title Convention
Follow Angular commit convention:
```
<type>(<scope>): <summary>

type: feat | fix | perf | test | docs | refactor | build | ci | chore
scope: API | benchmark | core | editor | * Node (optional)
summary: Imperative present tense, capitalized, no period
```

**Examples:**
- `feat(editor): Add dark mode support`
- `fix(Slack Node): Fix message formatting`
- `perf(core): Optimize workflow execution`

Add `(no-changelog)` suffix for commits that shouldn't appear in changelog.

### PR Requirements
- PR title and summary must be descriptive
- Follow conventions in `.github/pull_request_template.md` and
  `.github/pull_request_title_conventions.md`
- Use `gh pr create --draft` to create draft PRs
- Always reference the Linear ticket: `https://linear.app/n8n/issue/[TICKET-ID]`
- Link to GitHub issue if mentioned in the Linear ticket
- Include tests (unit, workflow, E2E as needed)
- Update docs or create follow-up ticket
- Label with `release/backport` if urgent fix needs backporting

### Breaking Changes
- Mark breaking changes with `!` in title: `feat(editor)!: Remove dark mode`
- Add `BREAKING CHANGE:` section in PR description
- Add entry to `packages/cli/BREAKING-CHANGES.md`

## Performance Considerations

Full development mode (`pnpm dev`) is resource-intensive:
- Runs TypeScript compilation for all packages
- Monitors files with watchers
- Runs Nodemon for backend restart
- Runs Vite dev server with HMR
- Can consume significant CPU/memory

**Recommendations:**
- Use selective development commands (`pnpm dev:be`, `pnpm dev:fe`, `pnpm dev:ai`)
- Develop individual packages when possible
- Close unnecessary applications
- Monitor system performance and adjust workflow accordingly
