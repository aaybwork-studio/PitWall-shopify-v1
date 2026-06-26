---
created: 2026-06-26T09:26:24.749Z
title: Redesign navbar team/driver dropdowns with visual selectors
area: ui
files:
  - src/components/Navbar.tsx
---

## Problem

Navbar dropdowns currently are likely text-list-only (per src/components/Navbar.tsx). User wants a visual overhaul referencing 4 images:

- **Image 1 (Teams dropdown)**: Replace text list with team car-livery images, grouped into columns: "F1 Teams" (Cadillac, McLaren, Ferrari, Aston Martin, Haas), "F1 Teams" col 2 (Audi, Red Bull Racing, Mercedes AMG Petronas, Visa Cash App RB / Racing Bulls, Williams), and "Legacy F1 Teams" (Stake/Kick Sauber, Alfa Romeo, AlphaTauri). Each row = car image + team name.
- **Image 2 (Drivers dropdown)**: Replace text list with driver headshot circles next to names, grouped into "F1 Drivers" (2 columns, current grid) and "F1 Alumni" (Senna, Magnussen, Doohan, Ricciardo, Vettel, Tsunoda, Zhou).
- **Image 3 (Team landing page)**: Clicking a team should route to a team page with: hero banner image (team drivers + logo), breadcrumb, title, description blurb, then filter bar (Season, Collection, F1 Drivers, Type, Gender, Size, Price, In Stock, sort dropdown), then product grid.
- **Image 4 (Driver landing page)**: Clicking a driver should route to a driver page: breadcrumb, title (driver name), description blurb (with team name linked/highlighted), filter bar (Season, Collection, Type, Gender, Size, Price, Rating, sort), product grid.

All navbar items (teams + drivers, including legacy/alumni) must be clickable and route to a working page matching the image 3 / image 4 pattern — not dead links.

Scope decision needed: pick 5-6 "best selling / profitable" teams and 5-6 top drivers to launch with first (full roster can follow later). Business judgment call — current grid (F1, McLaren, Ferrari, Red Bull, Mercedes, Aston Martin) + drivers (Verstappen, Hamilton, Leclerc, Norris, Piastri, Russell) are the obvious high-commercial picks, but needs explicit confirmation/discussion with user before building.

## Solution

TBD — needs a /gsd-discuss-phase or /gsd-plan-phase pass to nail down:
1. Final list of 5-6 teams + 5-6 drivers to ship first (revenue/popularity-driven).
2. Dropdown component redesign (image assets for team livery + driver headshots, grouped columns, hover/click states).
3. Dynamic team page template (hero, filters, product grid) — likely route pattern `/pages/teams/[team-slug]`.
4. Dynamic driver page template (breadcrumb, bio blurb, filters, product grid) — likely route pattern `/pages/drivers/[driver-slug]`.
5. Wiring every navbar dropdown entry to its corresponding page (no dead links).
6. Asset sourcing for team logos/liveries and driver headshots.
