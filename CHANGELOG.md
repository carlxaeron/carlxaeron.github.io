# Changelog

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
