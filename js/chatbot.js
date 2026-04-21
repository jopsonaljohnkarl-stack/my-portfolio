// ─────────────────────────────────────────────────────────────
//  CHATBOT
//  Edit KB array below to update what the chatbot says.
//  Each entry has:
//    k - array of keywords that trigger this response
//    r - the reply text (supports \n for line breaks and <b> tags)
// ─────────────────────────────────────────────────────────────

(function() {
  var bubble   = document.getElementById('cbBubble');
  var win      = document.getElementById('cbWindow');
  var msgs     = document.getElementById('cbMessages');
  var chipsEl  = document.getElementById('cbChips');
  var input    = document.getElementById('cbInput');
  var sendBtn  = document.getElementById('cbSend');
  var isOpen   = false;
  var isTyping = false;

  // Quick-reply chips shown on first open
  var QUICK = [
    'What do you build?',
    'What tools do you use?',
    'How much do you charge?',
    'See your projects',
    'How do I hire you?',
    'How long does it take?'
  ];

  // Knowledge base — edit responses here
  var KB = [
    { k:['hello','hi','hey','sup','hiya','good morning','good afternoon'],
      r:'Hey! 👋 I\'m John\'s AI assistant. I can tell you about his automation services, past projects, pricing, or how to get started. What would you like to know?' },
    { k:['build','do','offer','service','specialize','help','what you'],
      r:'John builds intelligent automation systems that eliminate manual work. Main specialties:\n\n• <b>n8n & Make workflows</b> — multi-step automations connecting any tools\n• <b>AI agents</b> — Claude/GPT-powered bots that take real action\n• <b>Lead gen pipelines</b> — scrape, enrich, score, push to CRM\n• <b>Voice AI</b> — inbound call handling via Retell AI\n• <b>Social media automation</b> — TikTok, Instagram, content pipelines\n\nAnything specific you want to automate?' },
    { k:['tool','stack','tech','use','platform','software','n8n','make','zapier'],
      r:'John\'s core stack:\n\n<b>Automation:</b> n8n, Make, Zapier\n<b>AI:</b> Claude, GPT-4, Gemini, Retell AI\n<b>Data:</b> Google Sheets, Airtable, Supabase, PostgreSQL\n<b>Comms:</b> Slack, Gmail API, WhatsApp, Outlook\n<b>CRM/Sales:</b> HubSpot, GoHighLevel, Apollo\n<b>Deploy:</b> Vercel, Node.js, Python\n\nIf your stack isn\'t listed, he can likely connect to it via API or webhook.' },
    { k:['price','cost','charge','rate','fee','budget','how much','pricing','pay'],
      r:'Pricing depends on project scope. Typical ranges:\n\n• <b>Simple workflow</b> (3–5 nodes): from $300\n• <b>Multi-step pipeline</b>: $500–$1,500\n• <b>Full AI agent system</b>: $1,500–$4,000+\n• <b>Monthly retainer</b>: available for ongoing builds\n\nBest way to get an accurate quote is a 30-min call — it\'s free and no obligation.' },
    { k:['project','portfolio','built','example','work','case','show'],
      r:'John has built 11 production systems including:\n\n• Lead Gen & Enrichment Pipeline (saves 18h/wk)\n• Retell AI Voice Agent (saves 25h/wk)\n• WhatsApp Bot — 24/7 conversational AI\n• Lead Outreach Automation (saves 20h/wk)\n• TikTok Content Intelligence Pipeline\n• AI Market Research system\n\nScroll up to the Projects section to see all 11 with full workflow diagrams. Click any card to expand it!' },
    { k:['hire','start','work together','get started','contact','reach','book','call','meeting','schedule'],
      r:'Easy — two options:\n\n1. <b>Book a free 30-min call</b> → calendly.com/jopsonaljohnkarl/30min\n2. <b>Email directly</b> → jopsonaljohnkarl@gmail.com\n3. <b>WhatsApp</b> → +63 905 500 1273\n\nJohn usually responds within a few hours. The intro call is zero-pressure — just come with your biggest operational pain point.' },
    { k:['long','time','timeline','week','fast','quick','how long','turnaround','deliver'],
      r:'Most projects ship in <b>2–4 weeks</b>:\n\n• Week 1: Discovery call + scoping\n• Week 2: Build + internal testing\n• Week 3: Integration testing with your real data\n• Week 4: Launch + handoff\n\nSimpler workflows can be done in days. Complex multi-system builds may take 4–6 weeks.' },
    { k:['linkedin','social','github','profile','link'],
      r:'You can find John here:\n\n• <b>LinkedIn:</b> linkedin.com/in/aljohn-jopson-06a28232b\n• <b>Email:</b> jopsonaljohnkarl@gmail.com\n• <b>WhatsApp:</b> +63 905 500 1273\n• <b>Book a call:</b> calendly.com/jopsonaljohnkarl/30min' },
    { k:['ai agent','voice','retell','phone','call','voice bot'],
      r:'John builds voice AI agents using <b>Retell AI</b> — they answer inbound calls, qualify leads through natural conversation, log outcomes to your CRM, and trigger follow-up sequences automatically.\n\nThe Retell Voice Agent he built saves 25 hours/week for his client. Interested in a voice agent for your business?' },
    { k:['lead','scrape','apollo','enrich','crm','outreach','email'],
      r:'Lead generation is one of John\'s strongest areas. He\'s built multiple systems that:\n\n• Pull prospects from Apollo, Apify, LinkedIn\n• Enrich with firmographic + contact data\n• Score by ICP fit\n• Auto-send personalized outreach via GPT-4\n• Log everything to HubSpot or GHL\n\nHis lead gen systems save clients 15–20h/week.' }
  ];

  function match(text) {
    var t = text.toLowerCase();
    for (var i = 0; i < KB.length; i++) {
      for (var j = 0; j < KB[i].k.length; j++) {
        if (t.includes(KB[i].k[j])) return KB[i].r;
      }
    }
    return 'Good question! For the most accurate answer, I\'d recommend booking a quick call with John — it\'s free and he can tailor the answer to your specific situation.\n\n📅 calendly.com/jopsonaljohnkarl/30min\n📧 jopsonaljohnkarl@gmail.com';
  }

  function addMsg(text, who) {
    var wrap = document.createElement('div');
    wrap.className = 'cb-msg ' + who;
    var dot = document.createElement('div');
    dot.className = 'cb-msg-dot';
    if (who === 'bot') {
      dot.innerHTML = '<img src="project-images/profile.jpg" alt="John" onerror="this.style.display=\'none\';this.parentElement.textContent=\'JJ\'" />';
    } else {
      dot.textContent = 'You';
      dot.style.fontSize = '.5rem';
    }
    var bub = document.createElement('div');
    bub.className = 'cb-msg-bubble';
    bub.innerHTML = text.replace(/\n/g, '<br>');
    if (who === 'user') {
      wrap.appendChild(bub); wrap.appendChild(dot);
    } else {
      wrap.appendChild(dot); wrap.appendChild(bub);
    }
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
    return wrap;
  }

  function showTyping() {
    var d = document.createElement('div');
    d.className = 'cb-msg bot'; d.id = 'cbTyping';
    var dot = document.createElement('div'); dot.className = 'cb-msg-dot';
    dot.innerHTML = '<img src="project-images/profile.jpg" alt="John" onerror="this.style.display=\'none\';this.parentElement.textContent=\'JJ\'" />';
    var bub = document.createElement('div'); bub.className = 'cb-msg-bubble cb-typing';
    bub.innerHTML = '<span></span><span></span><span></span>';
    d.appendChild(dot); d.appendChild(bub);
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    var t = document.getElementById('cbTyping');
    if (t) t.remove();
  }

  function setChips(list) {
    chipsEl.innerHTML = '';
    if (!list) return;
    list.forEach(function(label) {
      var c = document.createElement('button');
      c.className = 'cb-chip'; c.textContent = label;
      c.addEventListener('click', function() { sendMessage(label); });
      chipsEl.appendChild(c);
    });
  }

  function botReply(userText) {
    if (isTyping) return;
    isTyping = true;
    setChips(null);
    showTyping();
    var delay = 700 + Math.random() * 600;
    setTimeout(function() {
      hideTyping();
      var reply = match(userText);
      addMsg(reply, 'bot');
      isTyping = false;
      setChips(['How do I hire you?', 'See your projects', 'What tools do you use?']);
    }, delay);
  }

  function sendMessage(text) {
    var t = (text || input.value).trim();
    if (!t) return;
    input.value = '';
    addMsg(t, 'user');
    botReply(t);
  }

  sendBtn.addEventListener('click', function() { sendMessage(); });
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  function toggleChat() {
    isOpen = !isOpen;
    bubble.classList.toggle('open', isOpen);
    win.classList.toggle('open', isOpen);
    bubble.setAttribute('aria-expanded', isOpen);
    if (isOpen && msgs.childElementCount === 0) {
      setTimeout(function() {
        showTyping();
        setTimeout(function() {
          hideTyping();
          addMsg('Hey there! 👋 I\'m John\'s assistant. Ask me about his automation services, projects, pricing — or anything else. I\'m here to help!', 'bot');
          setChips(QUICK);
        }, 900);
      }, 300);
      setTimeout(function() { input.focus(); }, 400);
    }
  }

  bubble.addEventListener('click', toggleChat);
})();
