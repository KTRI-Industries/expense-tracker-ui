# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

Expense Tracker UI is an Angular 21 frontend for personal/household expense tracking, built as an Nx standalone monorepo. It uses NgRx for state management, Keycloak for authentication, and communicates with a Java backend via OpenAPI-generated client code.

## Common Commands

```bash
# Dev server (port 4200 by default)
nx serve

# Build (production by default)
nx build
nx build --configuration=development

# Run all tests
nx run-many --all --target=test --configuration=ci

# Run tests for a single library
nx test account
nx test shared-auth
nx test transactions

# Run a single test file
npx jest --config libs/account/jest.config.ts --testPathPattern="account.reducer.spec"

# Lint everything
nx run-many --all --target=lint

# Lint a single project
nx lint account

# Test with coverage
npm run test:coverage
npm run coverage:all    # tests + aggregate coverage report

# Regenerate API client from OpenAPI spec
OPEN_API=<path/to/openapi.json> npm run generate:api

# E2E tests
nx e2e e2e --watch
```

## Architecture

### Nx Workspace with Library Modules

The app shell lives in `src/` and lazy-loads feature libraries from `libs/`. All libraries are imported via TypeScript path aliases (`@expense-tracker-ui/*` defined in `tsconfig.base.json`).

**Feature libraries** (each has its own routes, NgRx store, and components):
- `libs/account` - Multi-tenant account management (switching accounts, invitations)
- `libs/dashboard` - Charts and analytics (uses chart.js/ng2-charts)
- `libs/homepage` - Landing page
- `libs/transactions` - Transaction CRUD, recurrent transactions, CSV import
- `libs/user` - User profile management
- `libs/nav-menu` - Navigation sidebar

**Shared libraries:**
- `libs/shared/api` - **Auto-generated** OpenAPI client (services + models). Do NOT edit files in `libs/shared/api/src/lib/generated/` manually; regenerate with `npm run generate:api`
- `libs/shared/auth` - Keycloak integration (service, effects, guard, external config)
- `libs/shared/error-handling` - Global HTTP error interceptor + NgRx error state
- `libs/shared/formly` - Custom Formly field types (chips, amount-input, file-upload)
- `libs/shared/constants` - App-wide constants
- `libs/shared/feature-flags` - Feature flag state management

### NgRx State Management Pattern

Each feature library follows this structure in a `+state/` directory:
- `*.actions.ts` - Actions using `createActionGroup`
- `*.reducer.ts` - Reducer using `createFeature` with `extraSelectors`
- `*.selectors.ts` - Barrel re-export of feature selectors
- `*.effects.ts` - Side effects (API calls, Keycloak operations)
- `*.models.ts` - State interfaces

Root-level stores (Auth, Account, ErrorHandling, FeatureFlags) are registered in `app.config.ts`. Feature-specific stores (Transactions, Dashboard) are lazy-loaded via `provideState()`/`provideEffects()` in route configs.

### Authentication Flow

Keycloak SSO with silent check. On app init:
1. `KeycloakService.init()` with `check-sso` mode
2. `AuthEffects.checkLogin$` dispatches `loginSuccess` if authenticated
3. `retrieveProfile$` loads user profile + roles from Keycloak
4. `checkTenant$` auto-generates a tenant if user has none
5. `KeycloakBearerInterceptor` adds JWT to all HTTP requests

Route guard: `AppGuard` checks roles from `route.data['roles']` array.

### HTTP Interceptor Chain

Configured in `app.config.ts` (order matters):
1. `KeycloakBearerInterceptor` - JWT token injection
2. `GlobalErrorInterceptor` - Error handling (400→store, 401→logout, others→snackbar)
3. `TenantIdHeaderInterceptor` - Adds tenant ID header for multi-tenancy
4. `pendingRequestsInterceptor$` - Loading spinner tracking

### External Configuration

Runtime config loaded from `src/assets/app.config.json` (not baked into build):
- `basePath` - Backend API URL
- `keycloakUrl` - Keycloak server URL
- `allowedOrigins` - CORS origins

## Conventions

- **Component prefix**: `expense-tracker-ui` (kebab-case selector), `expenseTrackerUi` (camelCase directive)
- **Locale**: Greek (`el-GR`) with `DD/MM/YYYY` date format and EUR currency formatting (comma decimal, dot thousands)
- **Standalone components**: All components are standalone (no NgModules for feature components)
- **UI framework**: Angular Material (deeppurple-amber theme) + Tailwind CSS 4
- **Forms**: Dynamic forms via `@ngx-formly/core` + `@ngx-formly/material` with custom types registered in app config
- **Testing**: Components use `@testing-library/angular` (`render`, `screen`, `fireEvent`). Reducers use plain Jest. Effects use `jasmine-marbles` (`hot`/`cold`). Generated API code is excluded from coverage.
- **Barrel exports**: Each library exposes its public API through `src/index.ts`. Import from `@expense-tracker-ui/<lib>`, never from internal paths.
