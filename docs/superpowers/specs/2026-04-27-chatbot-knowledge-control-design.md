# Chatbot Knowledge Control Design

Date: 2026-04-27
Project: `my-portfolio-main`
Scope: Refine the portfolio chatbot so it is broader in coverage but tightly controlled, using the website as the primary knowledge source and a local portrait asset as the chatbot logo.

## Goal

Replace the current loose keyword-and-copy chatbot with a site-backed chatbot that answers common visitor questions reliably without inventing facts. The chatbot should feel helpful and broad enough for a portfolio visitor, but it must stay inside approved knowledge boundaries.

## Problem

The current chatbot in `js/chatbot.js` uses a flat keyword list with hardcoded responses. That creates two issues:

1. It can return the wrong answer because broad keywords overlap.
2. It can confidently repeat claims that are not guaranteed to match the current site content.

The result is a chatbot that sounds polished but can drift away from the actual portfolio.

## Approved Design Direction

The chatbot will be:

- Broader but still controlled
- Limited to site-backed facts and explicitly approved business facts
- Strict about saying "I don't have that detail here" instead of guessing
- Updated to use the provided portrait image as the chatbot avatar/logo

The user-approved boundaries are:

- Primary knowledge source: the website itself
- Knowledge delivery model: curated internal data object, not live DOM reading
- Out-of-scope behavior: polite fallback to direct contact or booking a call
- General knowledge behavior: do not answer from freeform general knowledge

## Recommended Approach

Use a curated internal knowledge object sourced from the site's actual content and structured project data.

This approach is preferred over live DOM reading because it is:

- More reliable
- Easier to test
- Easier to maintain as the site grows
- Less likely to misread decorative, duplicated, or layout-only text

## Knowledge Sources

The chatbot should only answer from approved content derived from these sources:

- `index.html`
- `js/projects.js`
- Explicit hardcoded business facts that are already present on the site or approved during future edits

The chatbot should not invent additional facts, statistics, pricing promises, delivery guarantees, or personal background details that are not represented in those approved sources.

## Knowledge Model

Create a single structured knowledge source inside the chatbot layer, organized into clear sections.

Suggested sections:

- `identity`
- `hero`
- `stats`
- `about`
- `services`
- `tools`
- `projects`
- `process`
- `testimonials`
- `contact`
- `fallbacks`
- `quickReplies`

### Identity

Contains the approved personal and professional framing used across replies.

Examples:

- Name
- Role/title
- High-level description
- Availability status if shown on the site

### Hero and Stats

Contains the top-level summary claims from the hero section and any visible headline metrics.

Examples:

- `50+ workflows built`
- `15+ clients served`
- `30+ integrations`
- `5.0 client rating`

This section becomes the authoritative source for summary stats. Older chatbot-only claims that are not represented in the site-backed source should be removed or excluded.

### About

Contains concise approved positioning statements from the About section, such as helping founders and operators reduce repetitive admin work and connect their tools through practical workflows.

### Services

Contains the service categories and short descriptions from the services section.

Examples:

- Workflow automation
- AI agent development
- Automation architecture/infrastructure

Each service entry should have:

- label
- description
- optional keywords

### Tools

Contains the tools and platforms shown on the site.

This should support grouped answers like:

- automation tools
- AI tools
- data tools
- communication tools
- deployment/development tools

The grouping can be curated for clarity, even if the original site displays them as a marquee.

### Projects

Contains project entries pulled from `js/projects.js`, including:

- title
- category
- company/client type
- tools/skills
- short description
- features
- hours/week metric if present in project data

This enables controlled answers like:

- "What kinds of projects has John built?"
- "Show me lead generation projects"
- "What finance automations are on the site?"

### Process

Contains the approved delivery/process steps and timeframe language from the process section.

### Testimonials

Contains short approved quote summaries from the visible testimonials section. Replies should paraphrase or summarize rather than over-asserting beyond the written content.

### Contact

Contains all approved call-to-action details:

- email
- WhatsApp
- Calendly booking link
- contact form positioning

### Fallbacks

Contains short, reusable fallback messages for unsupported questions.

## Behavioral Rules

The chatbot should behave like a controlled site concierge, not a general-purpose assistant.

### Allowed

- Answer questions about John, his services, tools, process, projects, testimonials, and contact methods
- Summarize site-backed claims in plain language
- Suggest relevant project categories based on user interest
- Redirect users to contact or booking when the question needs a custom answer

### Not Allowed

- Invent facts not present in the approved knowledge source
- Give general-purpose explanations from open-ended world knowledge unless they are added as approved glossary entries in a future change
- Promise pricing, outcomes, or timelines beyond what is explicitly approved
- Blend together multiple partial matches into a misleading answer

## Fallback Rule

If the chatbot cannot answer from the approved knowledge object with sufficient confidence, it should not guess.

Preferred fallback pattern:

"I don't have that specific detail on the site right now. The best next step is to message John directly or book a free call."

The fallback should then provide one or more approved contact actions:

- email
- WhatsApp
- book a call

## Intent Model

Replace the current loose keyword bank with a more structured intent map.

Suggested intent groups:

- greeting
- whoIsJohn
- whatHeBuilds
- services
- tools
- projectsGeneral
- projectsByCategory
- projectExamples
- process
- timeline
- contact
- hire
- pricing
- testimonials
- unsupported

Each intent should define:

- trigger phrases/keywords
- answer builder function or template
- optional suggested follow-up chips

## Answer Construction

Replies should be assembled from approved data instead of handwritten paragraphs that drift over time.

Recommended pattern:

1. Detect the likely intent
2. Pull the matching approved data
3. Compose a short answer from templates
4. Offer 2-3 context-aware follow-up chips

This keeps tone conversational while ensuring the content stays bounded.

## Project Query Behavior

The project dataset is one of the best ways to make the chatbot feel broader without becoming risky.

The chatbot should support:

- broad project questions
- category questions like lead generation, finance ops, content, voice AI, research
- tool-based questions like n8n, Zapier, Make, Apollo, WhatsApp, Retell AI

When answering with projects, the chatbot should:

- mention 1-3 relevant projects
- summarize them briefly
- avoid claiming cross-project totals unless the totals are explicitly approved in the knowledge source

## Avatar / Logo Design

Use the provided portrait image as the chatbot visual identity for:

- the floating chat bubble
- the bot avatar beside assistant messages
- optional welcome-state branding inside the chat window

Implementation should use a local repo asset rather than a personal Downloads path so the site remains portable and deployable.

Recommended asset flow:

1. Copy the chosen portrait into a project asset folder such as `project-images/`
2. Reference that local asset from the chatbot UI
3. Keep the existing text fallback behavior in case the image fails to load

## Content Consistency Rules

The chatbot source of truth must resolve conflicts between older chatbot text and current site content.

Examples of potential conflict areas:

- project count
- hours/week savings claims
- pricing ranges
- delivery timelines
- tool lists

Rule:

- Site-backed curated data wins
- Legacy chatbot-only phrasing is removed unless re-approved

## Testing Requirements

The refactor should be validated against real visitor-style prompts.

Minimum test set:

- greeting
- what John does
- what tools he uses
- how to contact him
- how to hire him
- what kinds of projects he has built
- finance-related projects
- lead generation projects
- AI agent questions limited to site-backed service descriptions
- unsupported questions that should trigger fallback

Key assertions:

- no unsupported facts appear
- no wrong contact details appear
- no broad keyword misrouting occurs
- unsupported prompts redirect instead of guessing

## Non-Goals

This change does not include:

- adding a live LLM backend
- turning the chatbot into a general knowledge assistant
- scraping the DOM at runtime as the main knowledge engine
- introducing admin tooling for chatbot content management

## Expected Outcome

After implementation, the chatbot should:

- feel more trustworthy
- answer a wider set of site-relevant questions
- stay aligned with the portfolio content
- fail safely when information is missing
- present a stronger branded identity using the provided portrait avatar

## Implementation Handoff

The implementation plan should cover:

- extracting approved content into a structured knowledge object
- replacing the current flat `KB` response model
- improving intent routing
- introducing strict fallback handling
- wiring the portrait asset into the chat UI
- validating behavior with representative prompts
