# Changelog

## [3.0.10] — 2026-05-29

### Fixed
- Project detail modal now renders correctly (centered dialog with full content) by adding Bootstrap modal layout shell CSS required by React-Bootstrap
- Lifted `ProjectDetailModal` to portfolio root so it layers above fixed section slides without being obscured

### Changed
- Improved project modal typography (Playfair title, Inter body), spacing, and footer Close button styling
- Chat agent footer close uses native button with explicit Escape handler and test coverage

## [3.0.9] — 2026-05-28

### Fixed
- Project and chat modal close behavior now works reliably via header close icon, footer close button, and Escape key
- Prevented background portfolio interactions while a modal is open by locking page interaction and section navigation handlers
- Improved modal close-button hit area and layering so controls are consistently clickable on desktop and mobile

### Changed
- Updated chat and project modal UI copy to a more professional tone
- Rewrote all ported project descriptions in `projectDetails.js` with clearer, professional language while preserving original scope

## [3.0.8] — 2026-05-27

### Fixed
- Project and AI chat modals: solid green backgrounds on header, body, and footer (no transparent bleed-through)
- Modals now layer above nav dots/arrows (z-index 1400) with a darker backdrop (82% black)
- Improved chat bubble and project description text contrast

## [3.0.7] — 2026-05-27

### Added
- Project detail modal: click any project thumbnail for full-resolution image, description, tags, gallery, and website link
- Ported legacy project copy into `src/v3/data/projectDetails.js` (28 projects)
- `ProjectDetailModal` component with xl/fullscreen mobile layout and V3 styling

### Changed
- Projects grid still uses resized thumbnails; modal uses full `/static/images/sites/` images

## [3.0.6] — 2026-05-27

### Fixed
- AI Chat assistant: V3 styling, empty-send loading bug, safe API response parsing, scrollable messages, mobile fullscreen modal
- Mobile nav dots: higher z-index and stronger bottom tray contrast so they stay visible above content
- Mobile section arrows: visible again with safe positioning above nav dots and below header (44px tap targets)

### Added
- Chat FAB bottom-left on mobile (icon-only) to avoid overlapping nav dots
- `ChatAgent.test.js` for FAB, empty submit, and API reply flow

## [3.0.5] — 2026-05-27

### Added
- Home shape parallax via device gyroscope on mobile (tilt to move shapes)
- iOS motion permission requested on first tap; touch parallax remains as fallback

## [3.0.4] — 2026-05-27

### Added
- Home hero animated geometric shapes (circles, ring, hexagon) with slow spin, pulse, and drift
- Mouse and touch parallax on Home shapes — layered depth response on desktop and mobile
- `prefers-reduced-motion` disables shape animations and parallax

## [3.0.3] — 2026-05-27

### Fixed
- Project thumbnail images not appearing on mobile (iOS): replaced broken placeholder lazy-load with eager load when Projects section is active
- Added `background-image` fallback on project cards (same pattern as V2)
- Skip projects with invalid ids in the grid (no more broken `false.jpg` entries)

### Added
- `Projects.test.js` for image loading regression

## [3.0.2] — 2026-05-27

### Fixed
- About section scroll lock on mobile: inner content now scrolls correctly and section navigation works at boundaries
- Profile photo crop on About: face visible with improved `object-position`
- Skills and Contact sections use the same inner-scroll pattern to prevent identical mobile scroll traps

### Added
- `About.test.js` regression tests for scroll structure

## [3.0.1] — 2026-05-27

### Fixed
- Mobile fast-touch no longer jumps to the next section while scrolling inside Experience, Projects, and other long sections
- Touch swipe navigation now uses the same inner-scroll boundary gating as wheel navigation
- Nested scrollable areas (e.g. Experience timeline) resolve to the correct overflow container

### Added
- Unit tests for `SwipeHandler` and Portfolio touch boundary navigation

## [3.0.0] — 2026-05-13

### Added
- Portfolio V3 under `src/v3/` with Starbucks-inspired green design system
- Full-page slide navigation with per-section fixed positioning, hash sync, keyboard, and touch swipe
- Mobile support: hamburger menu, bottom nav dot tray, safe-area insets, 100svh sections
- V3 sections: Home, About, Skills, Experience, Projects, Contact
- Enterprise + AI-focused copy targeting big companies and AI developer roles
- Cursor rules for V3 design system, components, content, mobile, and copy
- Unit tests for V3 components and App shell
- GitHub Actions workflow builds and deploys `docs/` artifact on push to main
- Custom domain support via `public/CNAME` for carlmanuel.com

### Changed
- Default entry point switched to V3 portfolio (`src/pages/Index.js`)
- Package version bumped to 3.0.0
- Canonical and OG URLs updated to https://carlmanuel.com
- Firebase Cloud Functions CORS extended for carlmanuel.com

### Fixed
- GitHub Pages deploy workflow now runs `npm ci && npm run build` and uploads `docs/` instead of entire repo
