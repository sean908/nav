# Repository Guidelines

## Project Structure & Module Organization
The Angular workspace centers on src/, where app defines the bootstrap shell and top-level routes. Feature views and reusable UI live under view/ and components/, with shared state in store/, utilities in utils/, and HTTP facades in services/. Static assets split between src/assets/ for bundled resources and public/ for pass-through files. Navigation data that feeds the UI resides in data/*.json and nav.config.yaml. Support tools in scripts/ prepare third-party feeds before builds and automate deployment tasks.

## Build, Test, and Development Commands
- pnpm install: install dependencies; rerun after pulling lockfile changes.
- pnpm start: run scripts/start.ts then ng serve on port 7002 without live reload for production-like verification.
- pnpm start:reload: development server with live reload enabled.
- pnpm build: execute scripts/build.ts and emit an optimized bundle in dist/.
- pnpm setup: precompute remote data; always run before headless builds or CI.
- pnpm lint / pnpm format: invoke oxlint and Prettier to enforce style and formatting.

## Coding Style & Naming Conventions
Use TypeScript strict defaults with two-space indentation and trailing commas where allowed. Match Angular conventions: PascalCase components (foo-card.component.ts), camelCase services and helpers, and hyphenated SCSS class names. Prefer standalone components and keep template logic minimal; move calculations into typed helpers inside utils/ or the owning service. Run Prettier before committing to avoid formatting churn.

## Testing Guidelines
Jasmine and Karma remain the default test stack. Author new specs alongside code as *.spec.ts files and favor shallow component tests for UI fragments in components/. Run pnpm exec ng test --watch during development and add --code-coverage for CI baselines. When scripts in scripts/ gain logic, cover them with lightweight unit tests executed through tsx or add smoke checks in scripts/__tests__/.

## Commit & Pull Request Guidelines
Follow conventional commits such as fix:, feat:, and refactor:, keeping scopes short and lowercased. Group related changes per commit and avoid mixing feature work with formatting. Pull requests should include a concise summary, a linked issue or task reference, and UI screenshots or GIFs when the navigation layout changes. Note any configuration updates to nav.config.yaml or data/ so reviewers can validate generated content.

## Configuration Tips
Environment-specific settings live in src/environments/. Update nav.config.yaml for branding changes and rerun pnpm setup so generated data stays in sync. For self-hosted deployments, review netlify.toml and vercel.json to mirror your hosting target, and keep secrets out of the repo by relying on platform environment variables.
