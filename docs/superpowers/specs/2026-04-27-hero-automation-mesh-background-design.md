# Hero Automation Mesh Background Design

Date: 2026-04-27
Status: Approved for planning review

## Goal

Add a subtle animated tech signal to the white portfolio redesign without returning to the old dark futuristic style.

The background should make the hero feel more like AI, automation, systems, and workflows while preserving the premium white direction.

## Chosen Direction

Use an animated automation mesh in the hero only.

The rest of the page should stay mostly clean, with optional static technical accents from the current visual system. There should not be a full-page animated background.

## Visual Behavior

The hero background should show:

- pale blue-gray nodes
- thin connecting lines
- slow movement
- occasional soft signal pulses
- very subtle cursor response

The animation should feel like workflows passing through a quiet system, not like a game, particle storm, or sci-fi effect.

## Scope

### In Scope

- evolve the existing `#heroCanvas` behavior in `js/main.js`
- keep the animation behind the hero only
- tune the CSS opacity/blending for the new white theme
- support reduced-motion users
- keep text readability and visual calm as top priorities

### Out Of Scope

- new animation libraries
- WebGL or Three.js
- dark neon effects
- animated blobs or decorative orbs
- full-page animated background
- heavy background motion in every section

## Technical Approach

Reuse the existing canvas element:

- `index.html`: keep the current `<canvas id="heroCanvas">`
- `css/style.css`: tune hero canvas opacity, blending, and layering
- `js/main.js`: replace the simple particle network with a more intentional automation mesh

The mesh should be built with vanilla canvas:

- nodes move slowly
- nearby nodes connect with low-opacity lines
- signal pulses travel between selected node pairs
- mouse proximity gently offsets nearby nodes
- animation pauses when the tab is hidden
- reduced-motion mode draws a static version or disables the loop

## Motion Rules

The animation must be restrained:

- no rapid motion
- no strong glow
- no dense particle clutter
- no high-contrast strokes
- no large layout shifts

It should remain visible enough to make the hero feel technical, but light enough that the text remains the main focus.

## Accessibility And Performance

Requirements:

- respect `prefers-reduced-motion`
- keep node count modest
- avoid expensive per-frame work
- pause on `visibilitychange`
- handle resize cleanly
- avoid interaction on coarse-pointer devices if it creates unnecessary work

## Success Criteria

This is successful if:

- the hero feels more tech-forward immediately
- the site still feels white, premium, and high-trust
- the animation reads as automation/workflows rather than random particles
- text remains highly readable
- motion feels calm and deliberate
- the rest of the page remains clean
