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
    about: {
      summary:
        "John bridges the gap between complex technology and real business results by building practical automation systems that remove repetitive work, keep tools in sync, and stay maintainable after handoff.",
      positioning: [
        'Practical automation systems over one-off tool setups',
        'Built around real workflows, data handoffs, and edge cases',
        'Designed for reliability and maintainability after launch'
      ]
    },
    services: [
      {
        id: 'workflow-automation',
        label: 'Workflow Automation',
        keywords: ['workflow', 'automation', 'automate'],
        description:
          'John builds end-to-end automations that remove repetitive work, keep tools in sync, and make operations easier to manage.'
      },
      {
        id: 'crm-marketing',
        label: 'CRM & Marketing',
        keywords: ['crm', 'marketing', 'lead', 'pipeline'],
        description:
          'John automates lead capture, qualification, follow-up, and pipeline updates so CRM work keeps moving without manual input.'
      },
      {
        id: 'ai-agents',
        label: 'AI Agent Development',
        keywords: ['agent', 'ai agent', 'assistant', 'triage'],
        description:
          'John builds AI agents with tool use and memory, including Slack bots, email triage agents, and executive-assistant style systems that take action.'
      },
      {
        id: 'lead-generation',
        label: 'Lead Generation',
        keywords: ['lead generation', 'outreach', 'prospect', 'enrichment'],
        description:
          'John builds outbound systems that research, qualify, enrich, and route leads before they ever reach the team.'
      },
      {
        id: 'email-automation',
        label: 'Email Automation',
        keywords: ['email', 'inbox', 'follow-up', 'reminder'],
        description:
          'John builds email systems for triage, auto-replies, outbound follow-up, and payment reminders that reduce inbox overhead.'
      },
      {
        id: 'automation-architecture',
        label: 'Systems Architecture',
        keywords: ['architecture', 'infrastructure', 'pipeline', 'api'],
        description:
          'John designs the automation infrastructure layer: data pipelines, API orchestration, event-driven triggers, and internal tooling that scales.'
      }
    ],
    tools: {
      automation: ['n8n', 'Make', 'Zapier', 'GoHighLevel'],
      ai: ['Claude', 'OpenAI', 'Gemini', 'Retell AI', 'Perplexity AI'],
      communication: ['Slack', 'Gmail API', 'WhatsApp'],
      data: ['Google Sheets', 'Airtable', 'PostgreSQL', 'Supabase'],
      crmAndSales: ['Apollo', 'GoHighLevel', 'Asana'],
      development: ['Node.js', 'Python', 'Vercel', 'VS Code', 'Claude Code']
    },
    projects: {
      featured: [
        {
          title: 'Lead Gen & Enrichment Pipeline',
          category: 'Lead Generation',
          company: 'B2B Companies',
          hoursSavedPerWeek: 18,
          skills: ['LinkedIn API', 'Apollo', 'ICP Scoring', 'Slack'],
          description:
            'Automated lead funnel that scrapes prospects, enriches them with Apollo and LinkedIn data, scores ICP fit, and pushes qualified leads into the CRM.'
        },
        {
          title: 'Retell AI Voice Agent',
          category: 'Voice AI',
          company: 'Call Centers',
          hoursSavedPerWeek: 25,
          skills: ['Retell AI', 'Voice Processing', 'CRM Integration', 'Transcription'],
          description:
            'Inbound voice agent that answers calls, qualifies leads, logs outcomes to CRM, and triggers follow-up sequences automatically.'
        },
        {
          title: 'Xero to Asana Financial Sync',
          category: 'Finance Ops',
          company: 'Accounting Firm',
          hoursSavedPerWeek: 12,
          skills: ['Xero API', 'Asana API', 'CSV Generation', 'Data Sync'],
          description:
            'Finance reporting automation that syncs completed work with Xero data and attaches generated reporting artifacts back to the workflow.'
        }
      ],
      byCategory: {
        leadGeneration: [
          'Lead Gen & Enrichment Pipeline',
          'Lead Generation System',
          'Lead Outreach Automation'
        ],
        financeOps: [
          'Receipt Extractor',
          'Xero to Asana Financial Sync'
        ],
        voiceAi: ['Retell AI Voice Agent'],
        contentSystems: [
          'TikTok Content Intelligence',
          'AI Content Repurposing Pipeline',
          'AI Market Research'
        ]
      }
    },
    process: {
      timeline: 'Most projects move from first call to a working automation in 2-4 weeks.',
      steps: [
        'Understand the bottleneck',
        'Map the workflow',
        'Plan the build',
        'Build and test',
        'Launch and handover'
      ]
    },
    testimonials: [
      {
        result: 'Lead response moved from hours to minutes',
        summary:
          'Clients describe lead handling moving faster once routing and follow-up happen automatically.'
      },
      {
        result: 'Reporting syncs automated',
        summary:
          'Clients describe reporting work becoming easier to keep accurate after manual steps were reduced.'
      },
      {
        result: 'Content engine running hands-free',
        summary:
          'Clients describe content operations taking far less repeated effort once the workflow was unified.'
      }
    ],
    contact: {
      email: 'jopsonaljohnkarl@gmail.com',
      whatsappLabel: '+63 905 500 1273',
      whatsappHref: 'https://wa.me/639055001273',
      calendlyUrl: 'https://calendly.com/jopsonaljohnkarl/30min',
      linkedinUrl: 'https://www.linkedin.com/in/aljohn-jopson-06a28232b',
      contactFormPrompt:
        'Not ready to book a call? Write first and John replies within one business day.'
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
