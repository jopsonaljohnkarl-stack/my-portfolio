# Section Reactive Background System Design

Date: 2026-04-27
Status: Approved for planning review
Supersedes: `docs/superpowers/specs/2026-04-27-hero-automation-mesh-background-design.md`

## Goal

Create a stronger interactive background system for the white tech-luxury portfolio. The current hero-only automation mesh is too subtle and does not make the whole site feel alive.

The new background should react to scrolling, cursor movement, and the active section so the portfolio feels like a living automation map.

## Chosen Direction

Use a global, section-aware canvas environment behind the page.

The background should remain premium and light, but it should be more visible and more interactive than the hero-only mesh.

## Experience Model

The page should feel like one connected system.

As the visitor scrolls, the background changes behavior based on the active section:

- Hero: automation mesh with moving signals
- Tools: flowing integration paths and subtle tool-node movement
- About/Services: branching workflow paths
- Why Specialist: comparison-style split paths or decision routes
- Work: structured grid with active data routes
- Process: step-by-step beam/path animation
- Testimonials: softer proof/signal field
- Contact: convergence pattern that draws toward the CTA

The background should not restart visually at each section. It should feel like one continuous system changing modes.

## Interaction Rules

### Cursor Interaction

The native cursor stays. The background should react around it.

Expected behavior:

- nearby nodes gently bend or separate
- signal paths subtly brighten near the cursor
- the effect should feel responsive but not magnetic or distracting

### Scroll Interaction

The active section should influence the background mode.

Expected behavior:

- section detection updates the canvas mode
- transitions between modes should be smooth
- motion intensity can rise slightly in the active viewport area
- inactive sections should remain quieter

### Section Interaction

Sections should optionally expose a simple data attribute for background behavior, such as:

```html
<section data-bg-mode="tools">
```

This keeps the behavior explicit and maintainable.

## Visual Style

The system should use:

- pale blue-gray lines
- soft cool-blue signal pulses
- white/silver surfaces
- low-opacity technical grids
- calm movement
- restrained glow

Avoid:

- dark neon styling
- purple-heavy gradients
- big blobs or orbs
- particle storms
- high-contrast lines behind text
- motion that makes reading harder

## Technical Approach

The preferred implementation is a single global canvas:

- add one fixed canvas near the top of `index.html`
- style it as a full-page background layer in `css/style.css`
- implement the section-aware renderer in `js/main.js`
- keep the existing native cursor interaction model

The existing hero canvas can either be removed or hidden once the global canvas replaces it. The goal is one background system, not multiple competing animation layers.

## Renderer Behavior

The canvas renderer should:

- initialize a modest node graph
- draw a low-opacity grid
- draw connections and signal pulses
- track mouse position
- track active section mode
- smoothly interpolate between mode settings
- pause when the tab is hidden
- simplify or stop animation for reduced-motion users
- avoid expensive per-frame DOM reads

## Section Modes

The system should not require a completely different renderer per section. Instead, each mode should adjust the same renderer settings:

- node density
- connection distance
- line direction bias
- pulse speed
- pulse count
- grid visibility
- focal point
- opacity

This keeps the implementation maintainable while still making each section feel distinct.

## Accessibility And Performance

Requirements:

- respect `prefers-reduced-motion`
- keep performance acceptable on laptops
- reduce work on mobile/coarse-pointer devices
- pause animation on `visibilitychange`
- keep text readability above animation
- do not block interaction with page content

## Success Criteria

This is successful if:

- the site feels noticeably more tech-forward
- each section feels subtly connected to the background
- the white premium design remains intact
- the background reacts to cursor and scroll
- the animation feels like automation/workflow systems
- the effect is clearly more visible than the hero-only mesh
- the site does not become visually noisy
