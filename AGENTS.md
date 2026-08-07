<!-- BEGIN:nextjs-agent-rules -->

# Repo Agent Guide

## Mandatory context

- This project uses `next@16.2` App Router. Before changing routing, rendering,
  route handlers, or caching behavior, read the relevant guide in
  `node_modules/next/dist/docs/01-app/`.
- Prefer the patterns already used in this repo over generic Next.js habits.

## Stack

- `Next.js 16`, `React 19`, `TypeScript strict`, `Tailwind CSS 4`, `HeroUI 3`,
  `next-intl`, `axios`, `react-hook-form`, `zod`.
- UI is `RTL`, Persian-first, and `light-only`.

## Source map

- `src/app`: thin route entrypoints and route handlers only. Route groups are
  `(website)`, `(auth)`, `(pwa)`.
- `src/layouts`: app shells such as website, auth, and PWA chrome.
- `src/modules`: feature/page implementations. Keep page logic here, not in
  `app`.
- `src/components/shared`: shared primitives such as `DImage` and `Logo`.
- `src/utils`: pure reusable helpers such as file-size formatting, filename or
  extension helpers, date formatting, and query parsing helpers.
- `src/constants`: shared configuration values such as routes, query keys,
  pagination size, auth cookie names, and cross-module upload limits.
- `src/apis`: request clients, error normalization, shared API types, and
  service factories.
- `src/hooks`: request-state hooks and auth access.
- `src/providers` and `src/contexts`: global client providers/state.
- `src/styles`: design tokens, HeroUI theme mapping, and component-level
  overrides.
- `messages/fa`: translation source of truth.
- `docs/API-Design.txt` and `docs/design system spec.txt`: fallback references
  for unclear or not-yet-implemented domain/UI rules.

## Naming and exports

- File and folder names in `src` must be `kebab-case`. Next route groups such as
  `(pwa)` and API service convention files such as `_dto.ts`, `_services.ts`,
  `_types.ts`, `_mappers.ts`, and `_endpoints.ts` are explicit exceptions.
- Localization JSON files in `messages/fa` must be `camelCase`, and the same
  camelCase keys must be used in `global.d.ts`, `src/i18n/request.ts`, and
  `useTranslations()` / `getTranslations()` calls.
- Public imports from `src/constants`, `src/modules`, `src/models`,
  `src/components/shared`, `src/containers`, `src/contexts`, `src/providers`,
  `src/hooks`, `src/layouts`, and `src/utils` must go through that folder's
  `index` file. For default exports, expose them with named aliases, for example
  `export { default as PWALayout } from './pwa';`, and import from the folder
  root such as `@/layouts`.
- Keep barrel files explicit. Do not use broad `export *` unless the file is a
  deliberate type-only boundary and there is a clear reason.
- Remove unused imports and unused exports as part of every change. Do not keep
  public exports for future guesses; export only items with a current consumer,
  framework convention requirement, or clear module-boundary reason.

## Coding pattern

- Keep `app/**/page.tsx` and `app/**/layout.tsx` thin; they should mostly
  delegate to `src/modules` and `src/layouts`.
- When adding a feature, colocate its UI and schema under
  `src/modules/<feature>/`.
- For page modules, use a small, trackable file convention:
  - `index.tsx` is the module entry and composition layer.
  - `<module>-client.tsx` is used when client state, query hooks, or browser
    interactions need a dedicated runtime boundary.
  - `<module>.server.ts` is used when server-only loading, validation, or
    error/not-found normalization is large enough to leave `index.tsx`.
  - `<form-or-flow>.schema.ts` holds zod schema factories.
  - `types.ts` holds module-local UI/input types only.
- Do not create `*.server.ts`, `*-client.tsx`, mapper, or barrel files
  mechanically. Add them only when there is an actual split in runtime,
  responsibility, or reuse.
- Keep module-local components inside their module while only one module uses
  them. Move repeated UI used by multiple modules to `src/components/shared`.
- If an identical or near-identical component/pattern is used more than twice,
  make it reusable. When the reuse is only inside one module, keep the shared
  component inside that module. When the reuse crosses module boundaries, move
  it to `src/components/shared` and export it through the shared barrel.
- Move pure repeated logic to `src/utils` and repeated configuration to
  `src/constants`; modules should not keep duplicate helpers such as file-size
  formatting, file extension parsing, or shared upload limits.
- Before adding a new pure helper, formatter, parser, normalizer, or converter,
  first check `src/utils` and nearby existing mappers/services for an equivalent
  function. Reuse or extend the existing helper instead of creating a duplicate
  module-local function.
- Reuse `ROUTES`, `BREAKPOINTS`, `AUTH_COOKIE_NAME`, global `FCC`, and existing
  models/constants before adding new abstractions.
- Do not add `useMemo` or `useCallback` by default. Use them only when there is
  a concrete need such as preserving referential identity for memoized children
  or context values, stabilizing effect dependencies, or avoiding an actually
  expensive recalculation.
- Use `cn` from `@/utils` for className composition instead of manual string
  concatenation.
- Do not use deprecated browser APIs or properties (such as `navigator.platform`
  or `navigator.vendor`). Use modern standards like `navigator.userAgentData`
  when available or safe `navigator.userAgent` testing.
- Use `getTranslations()` in async server components/metadata and
  `useTranslations()` in client/shared components.
- Do not hardcode UI copy when it belongs in `messages/fa`.
- For module-level UI work, add or update a matching camelCase
  `messages/fa/<moduleName>.json` file and wire the module through `next-intl`.

## Data and API pattern

- Browser code should call `/api/backend/*`, not the upstream API directly.
- Auth cookie name is `access_token`; login/logout route handlers own cookie
  writes/deletes.
- Reuse `clientApiRequest`, `serverApiRequest`, and service factories in
  `src/apis/services/*`.
- Reuse shared API types from `src/apis/core/types/*` before defining new
  request/response wrappers. In particular, use `ApiRequestFunction`,
  `ApiPaginatedRequestFunction`, `ApiResponse`, `ApiPaginatedResponse`,
  `PaginatedResult`, and `PaginationMeta` instead of rewriting pagination or
  envelope types in feature services.
- Name service return types by HTTP intent: GET outputs use `*Response`, while
  POST, PUT, PATCH, and DELETE outputs use `*Result`.
- Keep frontend-facing contracts in `src/models`. Backend-only contracts must
  not be imported into models; define them in the relevant service `_dto.ts`
  file with a `Dto` postfix.
- Do not define service request/response/result contracts in `src/models`. Keep
  them next to the service in `_types.ts`, for example
  `src/apis/services/tickets/_types.ts`. These app-facing service types should
  compose models when needed, while backend-facing contracts stay in `_dto.ts`.
- Name primary model interfaces in `src/models` with an `I` prefix, for example
  `ITicket`, `ITicketMessage`, and `IDepartmentLookup`. Service
  `*Response`/`*Result` aliases may point to those `I...` models.
- Keep service files split by responsibility:
  - `_dto.ts` is only for raw backend contracts such as `*RequestDto`,
    `*ResponseDto`, nested DTO objects, and backend enum/string unions. It
    should not import app models, routes, constants, or formatting helpers.
  - `_mappers.ts` converts DTOs into app/domain models and may use models,
    constants, routes, and formatting helpers needed for that conversion.
  - `_services.ts` owns API orchestration only: endpoint, method, params/body,
    auth meta, signal, and calling mappers. Avoid defining duplicate DTO,
    pagination, or UI formatting logic there.
- Create `_mappers.ts`, `client.ts`, or `server.ts` only when the service
  actually needs that split or runtime entrypoint. Do not add files
  mechanically.
- Do not export types, constants, functions, or service instances without a
  current consumer, framework convention requirement, or clear module-boundary
  reason.
- Name service factories with `create...Services`, for example
  `createTicketServices`. In `client.ts`, expose initialized instances with a
  `client...Services` prefix, for example `clientTicketServices`. In
  `server.ts`, expose initialized instances with a `server...Services` prefix,
  for example `serverTicketServices`.
- Respect axios `meta.auth` and `skipUnauthorizedRedirect`.
- Use `useGetRequest` for fetch state and `usePostRequest` for mutations, toast
  feedback, and normalized errors.
- Do not call React Query's `useQuery` or `useMutation` directly in feature,
  layout, or component code. Add missing options to `useGetRequest` or
  `usePostRequest` when needed so API error handling stays centralized.
- Backend errors should flow through `ApiException` and translated keys in
  `messages/fa/common.json`.

## UI pattern

- Start from tokens in `src/styles/tokens.css` and HeroUI mapping in
  `src/styles/heroui-theme.css`; do not invent ad-hoc colors first.
- Put stable HeroUI component slot/class styling in
  `src/styles/heroui-components.css`, especially for repeated Avatar, Table,
  pagination, form, and button variants. Component files should apply semantic
  classes and lightweight state/modifier classes instead of repeating long
  Tailwind strings.
- With HeroUI 3 compound components, use their documented props and variants
  first. Do not invent custom class names for HeroUI parts in JSX. If a repeated
  global override is truly needed, target HeroUI's existing generated component
  selectors in `src/styles/heroui-components.css`; keep one-off layout utilities
  such as a table column width in the feature component.
- Common non-PWA shell spacing is `max-w-7xl` with
  `px-4 sm:px-5 md:px-6 lg:px-8`. PWA shell/header/bottom navigation must reuse
  `PWA_SHELL_CONTAINER_CLASS` from `src/layouts/pwa/shared.ts`. PWA header
  height, content offset, and page fill height must stay explicit through
  `PWA_CONTENT_MIN_HEIGHT_CLASS`, not page-local spacing hacks.
- PWA page titles, descriptions, and page actions belong in
  `messages/fa/pageHeader.json` as `title`, `description`, and `actionText`.
  Keep route matching and action metadata in `src/layouts/pwa/page-header.ts`.
  Render the route title/description inside the main PWA header next to the logo
  in place of the brand text, and render route actions beside notifications/user
  menu. On mobile, page action links should be icon-only. Keep ticket page
  modules focused on content, filters, forms, and data orchestration instead of
  rendering their own top page headers.
- Preferred typography utilities are `text-h1`, `text-h2`, `text-h3`,
  `text-body`, `text-body-sm`, `text-caption`, and `text-badge`.
- Visual language is subtle borders, white or `primary-50` surfaces,
  `rounded-xl`, soft shadows, and `lucide-react` icons.
- Configure shared Lucide defaults globally with `LucideProvider`. Keep icon
  usage simple: render `<Icon />` for the default icon size, or use only
  `ICON_SIZE_CLASS.sm`, `ICON_SIZE_CLASS.md`, or `ICON_SIZE_CLASS.lg` when a
  specific size is needed. Do not add ad-hoc `size={...}` or repeated
  `strokeWidth` props in components.
- For HeroUI compound icon slots that clone their child, such as
  `SearchField.SearchIcon`, put `ICON_SIZE_CLASS.*` on the HeroUI slot itself,
  not only on the nested Lucide icon.
- When HeroUI already provides an icon slot with a suitable built-in icon, such
  as `SearchField.SearchIcon` or `SearchField.ClearButton`, prefer the HeroUI
  slot and style its official selector in `src/styles/heroui-components.css`
  instead of importing a duplicate Lucide icon in the component.
- Use `DImage` for responsive marketing/decorative imagery and `BREAKPOINTS` for
  media-query thresholds.
- Desktop layouts and responsiveness must use the `lg` breakpoint (`>= 768px`),
  not `md`.
- Preserve RTL semantics and safe-area handling. Do not add dark mode unless
  explicitly requested.

## Forms and auth

- Forms follow `react-hook-form` + `zodResolver` + schema factory functions such
  as `createLoginSchema`.
- Match the existing HeroUI form composition: `TextField` + `Label` + `Input` +
  `FieldError`.
- PWA routes are wrapped by `AuthProvider`; `useAuth()` is the expected access
  point.

## Scope awareness

- Current code implements the marketing home, auth flow, PWA shell, and early
  placeholder app pages.
- If a task touches ticketing/dashboard behavior that is not built yet, align
  names, permissions, states, and payload shapes with the two `docs/` files
  above, but keep the repo's existing architecture and style conventions.

## PR and commit notes

- When proposing commits, group files by user-facing feature or architectural
  layer, not too granular and not too broad. Prefer Conventional Commit prefixes
  such as `feat:`, `fix:`, and `chore:`.
- For PR task text, use a short ticket-style title like
  `FEU-06: Implement User Ticketing Workflows`, followed by one concise
  paragraph and a `Scope` list focused on shipped behavior rather than tiny
  implementation details.

<!-- END:nextjs-agent-rules -->
