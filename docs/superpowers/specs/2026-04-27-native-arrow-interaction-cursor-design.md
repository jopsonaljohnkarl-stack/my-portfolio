# Native Arrow Interactive Cursor Design

Date: 2026-04-27
Status: Approved for planning review
Supersedes: `docs/superpowers/specs/2026-04-27-precision-ring-cursor-design.md`

## Goal

Replace the custom cursor overlay with the browser's normal arrow cursor while making the portfolio feel more interactive through responsive hover behavior in the page itself.

The site should feel polished and alive without drawing attention away from the content. The cursor should remain familiar. The environment should react around it.

## Outcome

The portfolio will use the default system cursor on desktop and standard touch behavior on mobile. Interactive elements will respond through motion, glow, underline transitions, and light magnetic behavior on important buttons.

This should make the site feel:

- more premium
- more usable
- less gimmicky
- more compatible with the current visual language

## Chosen Direction

Recommended direction: `Tech premium`

This means:

- native arrow cursor remains visible at all times
- no custom cursor ring, dot, trail, or fragments
- cards and tiles react with lift and edge emphasis
- text links react with a cleaner, more deliberate underline or accent motion
- primary CTAs and key buttons get subtle magnetic movement

Magnetism should apply only to high-value CTA elements, not to every card or tile. Cards should feel stable and premium, not floaty.

## Interaction Model

### 1. Cursor Baseline

Desktop should use the normal browser cursor behavior:

- standard arrow on general page areas
- standard pointer where interactive elements already use pointer semantics

There should be no synthetic cursor element attached to the viewport.

### 2. Cards And Tiles

Interactive cards such as services, tools, projects, or contact blocks should respond on hover with:

- a small upward lift
- a slightly stronger shadow
- a subtle border or surface glow
- optional tiny inner highlight shift if it matches the existing component style

The effect should communicate focus, not bounce or drift.

### 3. Buttons And CTAs

Primary CTA elements should react more strongly than cards:

- subtle lift
- shadow increase
- slight magnetic translation toward the cursor position
- stable spring-back when the cursor leaves

Magnetism should be intentionally light. It should feel like tension, not drag.

Secondary buttons can use lift and glow only if full magnetism feels too busy.

### 4. Text Links

Text links should use a more polished hover treatment than a plain color swap:

- underline sweep
- accent reveal
- or a small directional offset if already consistent with the site

The behavior should improve clarity without making inline text jitter.

### 5. Section-Level Feedback

Large interactive clusters such as the Projects or Services areas may brighten slightly when the user hovers deep into that area, but this must stay subtle. Section reactions are optional and should only ship if they visibly improve the experience.

## Scope

### In Scope

- removing the custom cursor overlay
- restoring the native desktop cursor
- hover lift and glow on interactive cards
- magnetic behavior on important buttons and CTAs
- improved hover styling for links
- preserving mobile and coarse-pointer behavior

### Out Of Scope

- any custom cursor art or replacement pointer
- particle trails, rings, shards, spotlight masks, or reticles
- whole-page pointer tracking effects
- strong parallax tied to cursor position
- motion that reduces readability or feels game-like

## Architecture Notes

Implementation should likely simplify the current cursor work in three places:

- `index.html`: remove custom cursor DOM
- `css/style.css`: remove cursor-overlay styles and strengthen hover states
- `js/main.js`: remove cursor-overlay logic and add targeted button magnetism only where needed

The preferred structure is behavior by component class rather than a single global cursor system.

## Behavioral Rules

- All interactions must degrade cleanly if JavaScript is unavailable.
- Hover states should still look good without magnetic motion.
- Magnetic effects should be desktop-only and limited to fine pointers.
- Motion should respect reduced-motion preferences.
- Effects should be restrained enough to avoid fighting existing section reveals and animations.

## Testing Expectations

Implementation should be checked for:

- no custom cursor overlay remaining in the DOM or CSS
- no desktop usability regression from removing the custom cursor
- stable hover behavior across buttons, cards, and links
- no movement on touch/coarse-pointer devices
- reduced-motion handling for magnetic behavior

## Success Criteria

This redesign is successful if:

- the cursor feels normal and trustworthy
- the site still feels premium and interactive
- hover feedback is clearer than before
- the motion feels intentional rather than flashy
- the page experience improves without introducing distraction
