# Chatbot Knowledge Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current keyword-only portfolio chatbot with a curated, site-backed chatbot that uses a local portrait avatar, answers only from approved portfolio data, and safely falls back instead of guessing.

**Architecture:** Split the chatbot into three focused parts: a curated knowledge source, a pure response engine that can be tested in Node, and a browser UI controller that renders messages and handles interactions. Keep the existing static-site architecture, but load the data and engine before `js/chatbot.js` so the UI layer stays thin and deterministic.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node built-in test runner, PowerShell file copy

---

## File Map

- Create: `project-images/chatbot-logo.png`
  Responsibility: local portrait asset used by the chatbot bubble, header avatar, and bot message avatar.
- Create: `js/chatbot-data.js`
  Responsibility: single curated source of truth for identity, services, tools, contact info, quick replies, fallbacks, and project-derived groupings.
- Create: `js/chatbot-engine.js`
  Responsibility: pure intent detection and answer construction from approved data only.
- Create: `js/chatbot-engine.test.cjs`
  Responsibility: Node tests covering intent routing, fallback behavior, and site-backed answer construction.
- Modify: `js/chatbot.js`
  Responsibility: browser-only UI controller that delegates all content decisions to the engine.
- Modify: `index.html`
  Responsibility: load `chatbot-data.js` and `chatbot-engine.js` before `chatbot.js`, update the chatbot avatar image references, and tighten placeholder/label copy.
- Modify: `css/style.css`
  Responsibility: support the new portrait-based bubble/avatar styling without changing the overall site design.

### Task 1: Add the local chatbot portrait asset

**Files:**
- Create: `project-images/chatbot-logo.png`

- [ ] **Step 1: Copy the approved portrait into the repo**

Run:

```powershell
Copy-Item 'C:\Users\jopso\Downloads\Gemini_Generated_Image_2tey8l2tey8l2tey.png' 'project-images\chatbot-logo.png'
```

Expected: the file `project-images\chatbot-logo.png` exists in the repo.

- [ ] **Step 2: Verify the asset is present**

Run:

```powershell
Get-Item 'project-images\chatbot-logo.png' | Select-Object Name,Length
```

Expected: output shows `chatbot-logo.png` with a non-zero file size.

- [ ] **Step 3: Commit**

```bash
git add project-images/chatbot-logo.png
git commit -m "feat: add chatbot portrait asset"
```

### Task 2: Add a curated chatbot knowledge source

**Files:**
- Create: `js/chatbot-data.js`

- [ ] **Step 1: Write the failing test for site-backed data**

Create `js/chatbot-engine.test.cjs` with this initial test block:

```javascript
const test = require('node:test');
const assert = require('node:assert/strict');

const { CHATBOT_DATA } = require('./chatbot-data.js');

test('chatbot data exposes approved contact details and quick replies', () => {
  assert.equal(CHATBOT_DATA.contact.email, 'jopsonaljohnkarl@gmail.com');
  assert.equal(CHATBOT_DATA.contact.whatsappHref, 'https://wa.me/639055001273');
  assert.equal(CHATBOT_DATA.contact.calendlyUrl, 'https://calendly.com/jopsonaljohnkarl/30min');
  assert.ok(CHATBOT_DATA.quickReplies.includes('What do you build?'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
node --test 'js\chatbot-engine.test.cjs'
```

Expected: FAIL because `./chatbot-data.js` does not exist yet.

- [ ] **Step 3: Write the curated data source**

Create `js/chatbot-data.js`:

```javascript
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.ChatbotData = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const CHATBOT_DATA = {
    identity: {
      name: 'John Jopson',
      role: 'AI & Automation Specialist',
      shortIntro:
        'John helps founders and operators connect their tools, reduce repetitive admin work, and build practical workflows that hold up in real operations.',
      availability: 'Available for projects'
    },
    stats: [
      '50+ workflows built',
      '15+ clients served',
      '30+ integrations',
      '5.0 client rating'
    ],
    services: [
      {
        id: 'workflow-automation',
        label: 'Workflow Automation',
        keywords: ['workflow', 'automation', 'automate'],
        description:
          'John builds end-to-end automations that remove repetitive work, keep tools in sync, and make operations easier to manage.'
      },
      {
        id: 'ai-agents',
        label: 'AI Agent Development',
        keywords: ['agent', 'ai agent', 'assistant', 'triage'],
        description:
          'John builds AI agents with tool use and memory, including Slack bots, email triage agents, and executive-assistant style systems that take action.'
      },
      {
        id: 'automation-architecture',
        label: 'Automation Architecture',
        keywords: ['architecture', 'infrastructure', 'pipeline', 'api'],
        description:
          'John designs the automation infrastructure layer: data pipelines, API orchestration, event-driven triggers, and internal tooling that scales.'
      }
    ],
    tools: {
      automation: ['n8n', 'Make', 'Zapier'],
      ai: ['Claude', 'OpenAI', 'Gemini'],
      communication: ['Slack', 'Gmail API', 'WhatsApp'],
      data: ['Google Sheets', 'Airtable', 'PostgreSQL', 'Supabase'],
      development: ['Node.js', 'Python', 'Vercel', 'VS Code', 'Claude Code']
    },
    contact: {
      email: 'jopsonaljohnkarl@gmail.com',
      whatsappLabel: '+63 905 500 1273',
      whatsappHref: 'https://wa.me/639055001273',
      calendlyUrl: 'https://calendly.com/jopsonaljohnkarl/30min'
    },
    quickReplies: [
      'What do you build?',
      'What services do you offer?',
      'What tools do you use?',
      'Show me lead generation projects',
      'How does the process work?',
      'How do I hire John?'
    ],
    fallbacks: {
      unsupported:
        "I don't have that specific detail on the site right now. The best next step is to message John directly or book a free call."
    }
  };

  return { CHATBOT_DATA };
});
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
node --test 'js\chatbot-engine.test.cjs'
```

Expected: PASS for the contact-data test.

- [ ] **Step 5: Commit**

```bash
git add js/chatbot-data.js js/chatbot-engine.test.cjs
git commit -m "feat: add curated chatbot knowledge source"
```

### Task 3: Build the pure response engine with fallback-first behavior

**Files:**
- Create: `js/chatbot-engine.js`
- Modify: `js/chatbot-engine.test.cjs`

- [ ] **Step 1: Write the failing engine tests**

Append these tests to `js/chatbot-engine.test.cjs`:

```javascript
const { createChatbotEngine } = require('./chatbot-engine.js');
const { CHATBOT_DATA } = require('./chatbot-data.js');

test('engine answers services questions from approved data only', () => {
  const engine = createChatbotEngine(CHATBOT_DATA);
  const result = engine.reply('What services do you offer?');

  assert.equal(result.intent, 'services');
  assert.match(result.text, /Workflow Automation/);
  assert.match(result.text, /AI Agent Development/);
});

test('engine answers contact questions with approved contact details', () => {
  const engine = createChatbotEngine(CHATBOT_DATA);
  const result = engine.reply('How do I hire John?');

  assert.equal(result.intent, 'contact');
  assert.match(result.text, /jopsonaljohnkarl@gmail.com/);
  assert.match(result.text, /calendly\.com\/jopsonaljohnkarl\/30min/);
});

test('engine falls back instead of guessing on unsupported questions', () => {
  const engine = createChatbotEngine(CHATBOT_DATA);
  const result = engine.reply('What is the capital of France?');

  assert.equal(result.intent, 'unsupported');
  assert.match(result.text, /I don't have that specific detail on the site right now/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
node --test 'js\chatbot-engine.test.cjs'
```

Expected: FAIL because `./chatbot-engine.js` does not exist yet.

- [ ] **Step 3: Write the minimal response engine**

Create `js/chatbot-engine.js`:

```javascript
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.ChatbotEngine = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function normalize(text) {
    return String(text || '').toLowerCase().trim();
  }

  function includesAny(text, phrases) {
    return phrases.some((phrase) => text.includes(phrase));
  }

  function createChatbotEngine(data) {
    function reply(input) {
      const text = normalize(input);

      if (includesAny(text, ['hello', 'hi', 'hey'])) {
        return {
          intent: 'greeting',
          text:
            "Hey! I'm John's site assistant. I can help with his services, tools, projects, process, or how to get in touch.",
          chips: data.quickReplies.slice(0, 3)
        };
      }

      if (includesAny(text, ['hire', 'contact', 'book', 'call', 'email', 'whatsapp'])) {
        return {
          intent: 'contact',
          text:
            `You can reach John at ${data.contact.email}, message him on WhatsApp at ${data.contact.whatsappLabel}, or book a free call at ${data.contact.calendlyUrl}.`,
          chips: ['What services do you offer?', 'Show me projects']
        };
      }

      if (includesAny(text, ['service', 'offer', 'what do you build', 'what do you do'])) {
        const labels = data.services.map((service) => service.label).join(', ');
        return {
          intent: 'services',
          text:
            `John focuses on ${labels}. He builds practical systems that reduce manual work and keep tools in sync.`,
          chips: ['What tools do you use?', 'How does the process work?']
        };
      }

      return {
        intent: 'unsupported',
        text:
          `${data.fallbacks.unsupported} Email: ${data.contact.email} | Book a call: ${data.contact.calendlyUrl}`,
        chips: ['How do I hire John?', 'What services do you offer?']
      };
    }

    return { reply };
  }

  return { createChatbotEngine };
});
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
node --test 'js\chatbot-engine.test.cjs'
```

Expected: PASS for greeting, services, contact, and fallback tests.

- [ ] **Step 5: Commit**

```bash
git add js/chatbot-engine.js js/chatbot-engine.test.cjs
git commit -m "feat: add fallback-safe chatbot response engine"
```

### Task 4: Expand the engine to support tools, process, and project categories

**Files:**
- Modify: `js/chatbot-data.js`
- Modify: `js/chatbot-engine.js`
- Modify: `js/chatbot-engine.test.cjs`

- [ ] **Step 1: Write the failing tests for tools, process, and project categories**

Append these tests to `js/chatbot-engine.test.cjs`:

```javascript
test('engine answers tools questions from curated tool groups', () => {
  const engine = createChatbotEngine(CHATBOT_DATA);
  const result = engine.reply('What tools do you use?');

  assert.equal(result.intent, 'tools');
  assert.match(result.text, /n8n/);
  assert.match(result.text, /Make/);
  assert.match(result.text, /Zapier/);
});

test('engine answers process questions with site-backed timeline language', () => {
  const engine = createChatbotEngine(CHATBOT_DATA);
  const result = engine.reply('How does the process work?');

  assert.equal(result.intent, 'process');
  assert.match(result.text, /2-4 weeks/);
});

test('engine answers lead generation project questions with relevant project names', () => {
  const engine = createChatbotEngine(CHATBOT_DATA);
  const result = engine.reply('Show me lead generation projects');

  assert.equal(result.intent, 'projectsByCategory');
  assert.match(result.text, /Lead Gen & Enrichment Pipeline/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
node --test 'js\chatbot-engine.test.cjs'
```

Expected: FAIL because the engine does not yet support those intents.

- [ ] **Step 3: Extend data and engine with project/process support**

Update `js/chatbot-data.js` by adding:

```javascript
process: {
  timeline: 'Most projects move from first call to working automation in 2-4 weeks.',
  steps: [
    'Discovery and scoping',
    'Build and internal testing',
    'Integration testing with real data',
    'Launch and handoff'
  ]
},
projects: {
  leadGeneration: [
    'Lead Gen & Enrichment Pipeline',
    'Lead Generation System',
    'Lead Outreach Automation'
  ],
  financeOps: [
    'Receipt Extractor',
    'Xero to Asana Financial Sync'
  ],
  voiceAi: [
    'Retell AI Voice Agent'
  ]
}
```

Update `js/chatbot-engine.js` inside `reply` by adding these branches above the fallback:

```javascript
      if (includesAny(text, ['tool', 'stack', 'tech', 'platform'])) {
        return {
          intent: 'tools',
          text:
            `John regularly works with ${data.tools.automation.join(', ')} for automation, ${data.tools.ai.join(', ')} for AI, and ${data.tools.data.join(', ')} for data workflows.`,
          chips: ['Show me projects', 'How does the process work?']
        };
      }

      if (includesAny(text, ['process', 'timeline', 'how long', 'turnaround'])) {
        return {
          intent: 'process',
          text:
            `${data.process.timeline} A typical flow is ${data.process.steps.join(', ')}.`,
          chips: ['What services do you offer?', 'How do I hire John?']
        };
      }

      if (includesAny(text, ['lead generation', 'lead gen', 'outreach'])) {
        return {
          intent: 'projectsByCategory',
          text:
            `Lead generation examples on the site include ${data.projects.leadGeneration.join(', ')}.`,
          chips: ['What tools do you use?', 'How do I hire John?']
        };
      }
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
node --test 'js\chatbot-engine.test.cjs'
```

Expected: PASS for tools, process, and lead-generation project tests.

- [ ] **Step 5: Commit**

```bash
git add js/chatbot-data.js js/chatbot-engine.js js/chatbot-engine.test.cjs
git commit -m "feat: expand chatbot intents for tools process and projects"
```

### Task 5: Refactor the browser UI to use the engine and local portrait asset

**Files:**
- Modify: `index.html`
- Modify: `js/chatbot.js`
- Modify: `css/style.css`

- [ ] **Step 1: Write the failing integration checks**

Run:

```powershell
node --check 'js\chatbot.js'
```

Expected: PASS now. This is the baseline syntax check before the refactor.

- [ ] **Step 2: Update the chatbot HTML asset references and script order**

In `index.html`, change the avatar image and script loading block to:

```html
  <button class="cb-bubble" id="cbBubble" aria-label="Open chat" aria-expanded="false">
    <img class="cb-bubble-photo" src="project-images/chatbot-logo.png" alt="" aria-hidden="true" />
    <span class="cb-bubble-icon-close" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </span>
  </button>
  <div class="cb-window" id="cbWindow" role="region" aria-label="Chat with John">
    <div class="cb-header">
      <div class="cb-avatar">
        <img src="project-images/chatbot-logo.png" alt="John Jopson chatbot avatar" onerror="this.style.display='none'" />
      </div>
```

And update the script order at the bottom to:

```html
  <script src="js/projects.js" defer></script>
  <script src="js/chatbot-data.js" defer></script>
  <script src="js/chatbot-engine.js" defer></script>
  <script src="js/main.js" defer></script>
  <script src="js/carousel.js" defer></script>
  <script src="js/chatbot.js" defer></script>
```

- [ ] **Step 3: Refactor `js/chatbot.js` into a UI controller**

Replace the content-decision portions of `js/chatbot.js` with:

```javascript
  var dataApi = window.ChatbotData;
  var engineApi = window.ChatbotEngine;
  var chatbot = engineApi.createChatbotEngine(dataApi.CHATBOT_DATA);
  var avatarHtml = '<img src="project-images/chatbot-logo.png" alt="John" onerror="this.style.display=\'none\';this.parentElement.textContent=\'JJ\'" />';

  var QUICK = dataApi.CHATBOT_DATA.quickReplies;

  function addMsg(text, who) {
    var wrap = document.createElement('div');
    wrap.className = 'cb-msg ' + who;
    var dot = document.createElement('div');
    dot.className = 'cb-msg-dot';
    if (who === 'bot') {
      dot.innerHTML = avatarHtml;
    } else {
      dot.textContent = 'You';
      dot.style.fontSize = '.5rem';
    }
    var bub = document.createElement('div');
    bub.className = 'cb-msg-bubble';
    bub.innerHTML = text.replace(/\n/g, '<br>');
    if (who === 'user') {
      wrap.appendChild(bub);
      wrap.appendChild(dot);
    } else {
      wrap.appendChild(dot);
      wrap.appendChild(bub);
    }
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function botReply(userText) {
    if (isTyping) return;
    isTyping = true;
    setChips(null);
    showTyping();
    setTimeout(function () {
      hideTyping();
      var result = chatbot.reply(userText);
      addMsg(result.text, 'bot');
      isTyping = false;
      setChips(result.chips || dataApi.CHATBOT_DATA.quickReplies.slice(0, 3));
    }, 700);
  }
```

- [ ] **Step 4: Add portrait-friendly bubble styling**

In `css/style.css`, update the bubble styles to:

```css
.cb-bubble {
  position: fixed; right: 24px; bottom: 28px; z-index: 1000;
  width: 64px; height: 64px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.18);
  background: #10131a;
  box-shadow: 0 12px 34px rgba(0,0,0,0.42);
  color: #fff; cursor: pointer; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.cb-bubble-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.cb-bubble .cb-bubble-icon-close {
  position: absolute;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(9, 12, 18, 0.78);
}
.cb-bubble.open .cb-bubble-photo { opacity: 0.15; }
.cb-bubble.open .cb-bubble-icon-close { display: flex; }
```

- [ ] **Step 5: Run syntax and regression checks**

Run:

```powershell
node --check 'js\chatbot-data.js'
node --check 'js\chatbot-engine.js'
node --check 'js\chatbot.js'
node --test 'js\chatbot-engine.test.cjs'
```

Expected: all syntax checks PASS and the chatbot engine tests PASS.

- [ ] **Step 6: Commit**

```bash
git add index.html css/style.css js/chatbot.js js/chatbot-data.js js/chatbot-engine.js js/chatbot-engine.test.cjs
git commit -m "feat: wire controlled chatbot engine into portfolio UI"
```

### Task 6: Manual smoke test the site behavior

**Files:**
- Modify: none

- [ ] **Step 1: Open the site locally and test the approved prompts**

Manual prompts to test in the browser:

```text
What do you build?
What services do you offer?
What tools do you use?
Show me lead generation projects
How does the process work?
How do I hire John?
What is the capital of France?
```

Expected:

- the portrait appears in the bubble and bot avatar
- supported questions answer with site-backed content
- unsupported question triggers the fallback and contact redirect

- [ ] **Step 2: Verify there are no tracked surprises**

Run:

```powershell
git status --short
```

Expected: only the intended chatbot files and the new portrait asset are modified before final review.

- [ ] **Step 3: Commit**

```bash
git add index.html css/style.css js/chatbot.js js/chatbot-data.js js/chatbot-engine.js js/chatbot-engine.test.cjs project-images/chatbot-logo.png
git commit -m "test: verify controlled chatbot portfolio flow"
```

## Self-Review

- Spec coverage check:
  - curated internal knowledge object: covered by Tasks 2 and 4
  - strict fallback behavior: covered by Task 3
  - broader-but-controlled intent support: covered by Tasks 3 and 4
  - local portrait asset as chatbot logo: covered by Tasks 1 and 5
  - UI wiring and message rendering: covered by Task 5
  - validation with representative prompts: covered by Task 6
- Placeholder scan:
  - no `TODO`, `TBD`, or vague “handle later” steps remain
- Type consistency:
  - shared names are fixed as `CHATBOT_DATA`, `createChatbotEngine`, and `reply`
