# Precision Ring Cursor Design

Date: 2026-04-27
Project: `my-portfolio-main`
Scope: Replace the current crystalline custom cursor with a cleaner precision ring cursor that better fits the portfolio's polished, systems-oriented tone.

## Goal

Refine the desktop custom cursor so it feels premium, precise, and intentional without drawing attention away from the portfolio content.

## Problem

The current cursor effect is visually busy. It uses a crystalline treatment, fragments, trails, and extra decorative effects that compete with the rest of the site instead of supporting it.

For this portfolio, the cursor should reinforce the feeling of precision and control. Right now it feels more ornamental than useful.

## Approved Direction

The user-approved direction is:

- `balanced precision ring`
- small center dot
- thin outer ring
- smooth motion
- modest size increase on hover
- no decorative shards, fragments, or burst effects

This is intentionally more restrained than the current cursor.

## Recommended Approach

Replace the existing multi-effect cursor system with a simplified two-layer cursor:

1. a tightly tracking center dot
2. a slightly delayed outer ring

This approach is preferred because it:

- fits the portfolio tone better
- reduces distraction
- is easier to maintain
- lowers the chance of motion feeling gimmicky or inconsistent

## Visual Design

### Default State

The cursor should feel balanced and visible, not faint and not flashy.

Recommended characteristics:

- small center dot
- thin circular outer ring
- neutral/light color treatment with soft cool tone support
- very light glow only
- stable motion

The cursor should read as premium and technical, not playful.

### Hover State

On interactive elements such as:

- links
- buttons
- cards
- tabs
- project tiles
- form controls

the cursor should:

- enlarge modestly
- shift tint slightly toward the site accent
- keep the same basic ring-and-dot structure

It should not:

- show labels
- explode into particles
- change into a complex reticle
- become dramatically larger

The hover response should feel like precise focus, not a special effect.

## Behavioral Rules

### Motion

The center dot should track closely to the pointer.

The ring should follow with a slight lag so the motion feels smooth and intentional. The lag should be subtle enough that the cursor still feels responsive.

### Hover Detection

Hover behavior should activate on clearly interactive elements only.

Suggested interactive selector set:

- `a`
- `button`
- `[role="button"]`
- `input`
- `textarea`
- `select`
- `.work-card`
- `.tool-item`
- `.service-card`
- `.contact-card`
- `.cb-chip`
- `.cb-bubble`

The exact selector list can be adjusted to match the existing site structure, but the principle is that hover amplification should be selective and predictable.

### Reduced Complexity

The new cursor should remove:

- crystalline SVG treatment
- floating fragments
- burst effects
- extra trail particles
- any layered cursor visuals that are not necessary to the ring-and-dot concept

## Technical Direction

The likely implementation should simplify both CSS and JavaScript.

### CSS

Update the cursor styling in `css/style.css` so the cursor system defines:

- one dot element
- one ring element
- hover state classes

Remove or stop using styles related to:

- `.cursor-crystal`
- `.cursor-fragment`
- `.cursor-trail`
- decorative cursor burst visuals

### JavaScript

Simplify the cursor logic in `js/main.js` so it:

- tracks pointer position
- animates the dot and ring
- toggles a hover class when entering interactive elements

Remove or stop using logic related to:

- fragment spawning
- burst particle creation
- extra decorative cursor trail generation

## Accessibility and Fallbacks

The cursor should remain desktop-only.

Keep the existing behavior that disables the custom cursor for:

- coarse pointers
- touch devices

Implementation should continue respecting reduced-motion scenarios when practical. If reduced motion is already handled globally, the cursor should not introduce aggressive independent animation.

## Non-Goals

This change does not include:

- redesigning the whole interaction system
- adding cursor labels
- adding click shockwaves or burst effects
- changing mobile cursor/touch behavior
- changing site color tokens globally

## Expected Outcome

After implementation, the cursor should:

- feel calmer and more premium
- support the portfolio instead of competing with it
- reinforce the site's precise, systems-oriented tone
- remain noticeable enough to feel intentional
- provide cleaner hover feedback on interactive elements

## Implementation Handoff

The implementation plan should cover:

- identifying the current cursor DOM/CSS/JS touchpoints
- removing crystalline and particle-based cursor behavior
- implementing the ring + dot cursor motion
- implementing the hover enlargement/tint behavior
- validating desktop behavior and mobile fallback behavior
