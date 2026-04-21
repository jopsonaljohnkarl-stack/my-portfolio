// ─────────────────────────────────────────────────────────────
//  PROJECTS DATA
//  Edit this file to add, remove, or update portfolio projects.
//
//  Each project has:
//    cat      - filter tab: 'n8n' | 'zapier' | 'make' | 'gohighlevel'
//    title    - project name shown on the card
//    tag      - short category label (e.g. 'Lead Generation')
//    color    - dot colour on the card header (hex)
//    hours    - hours/week saved metric
//    company  - client type shown above the title
//    skills   - array of tech/tool tags shown as pills
//    img      - path to project screenshot inside project-images/
//    desc     - one-paragraph description
//    features - bullet list of 3–5 highlights
// ─────────────────────────────────────────────────────────────

const PROJECTS = [
  { cat:'n8n', title:'Lead Gen & Enrichment Pipeline', tag:'Lead Generation', color:'#e84141', hours:18, company:'B2B Companies', skills:['LinkedIn API','Apollo','ICP Scoring','Slack'],
    img:'project-images/n8n-lead-gen-enrichment.png',
    desc:'Automated lead funnel that scrapes prospects, enriches with Apollo & LinkedIn data, scores by ICP fit, and pushes qualified leads directly into your CRM.',
    features:['Multi-source scraping — LinkedIn, Apollo, web','AI-powered ICP scoring with configurable thresholds','CRM auto-push with enriched contact data','Slack instant alerts for high-value leads']
  },
  { cat:'n8n', title:'TikTok Content Intelligence', tag:'Content Intel', color:'#fe2c55', hours:10, company:'Content Creators', skills:['TikTok API','Web Scraping','AI Analysis','Slack Reporting'],
    img:'project-images/TikTok Content Intelligence Pipeline.png',
    desc:'Scrapes TikTok competitor data, extracts metadata and transcripts, uses AI to analyze performance patterns, and delivers weekly intelligence reports to Slack.',
    features:['Automated TikTok profile & video scraping','AI transcript extraction and analysis','Competitor performance benchmarking','Weekly Slack intelligence digest']
  },
  { cat:'n8n', title:'WhatsApp Bot', tag:'Conversational AI', color:'#25d366', hours:16, company:'E-Commerce Brands', skills:['WhatsApp API','GPT Integration','Customer Service','Message Queue'],
    img:'project-images/Whatsapp bot.jpeg',
    desc:'Conversational WhatsApp automation that routes messages by intent, generates AI responses, and logs all interactions — running 24/7 without manual effort.',
    features:['Multi-intent routing via AI classification','Context-aware GPT-4 response generation','Session memory across conversation threads','Full interaction logging to Google Sheets']
  },
  { cat:'n8n', title:'Receipt Extractor', tag:'Finance Ops', color:'#ea4335', hours:8, company:'Accounting Teams', skills:['OCR Technology','PDF Processing','Data Extraction','Google Sheets'],
    img:'project-images/automation receipt extractor.png',
    desc:'Watches Gmail for receipt emails, downloads attachments, runs AI parsing to extract line items, and auto-categorizes expenses into Google Sheets for accounting.',
    features:['Automated Gmail receipt detection & download','AI OCR parsing of PDF and image receipts','Smart expense categorization by vendor/type','Monthly rollup reports to Sheets + Slack']
  },
  { cat:'n8n', title:'Instagram Automation', tag:'Social Media', color:'#e1306c', hours:12, company:'Social Media Agencies', skills:['Instagram API','AI Caption Gen','Post Scheduling','Analytics'],
    img:'project-images/instagram workflow.png',
    desc:'End-to-end Instagram content pipeline — generates AI captions, schedules posts at optimal times, and tracks performance data automatically.',
    features:['AI caption generation from content briefs','Optimal-time scheduling via engagement analytics','Hashtag strategy and auto-tagging','Performance tracking dashboard in Sheets']
  },
  { cat:'n8n', title:'TikTok & Instagram Scraper', tag:'Data Pipeline', color:'#fe2c55', hours:10, company:'Data Analytics', skills:['Platform APIs','Parallel Processing','Delta Updates','Dashboards'],
    img:'project-images/TIktok and instagram scraper.png',
    desc:'Dual-platform scraper that pulls profile stats, video data, and engagement metrics from TikTok and Instagram simultaneously into a unified analytics sheet.',
    features:['Simultaneous TikTok & Instagram extraction','Parallel processing with Merge node sync','Duplicate detection and delta-only updates','Unified multi-platform analytics dashboard']
  },
  { cat:'n8n', title:'Retell AI Voice Agent', tag:'Voice AI', color:'#6c3de8', hours:25, company:'Call Centers', skills:['Retell AI','Voice Processing','CRM Integration','Transcription'],
    img:'project-images/retell ai updated.png',
    desc:'Inbound voice agent powered by Retell AI — answers calls, qualifies leads through natural conversation, logs outcomes to CRM, and triggers follow-up sequences automatically.',
    features:['Natural language call handling via Retell AI','Real-time lead qualification during calls','Automatic CRM logging with call transcripts','Post-call follow-up email/SMS sequences']
  },
  { cat:'n8n', title:'AI Market Research', tag:'Research AI', color:'#1fb8cd', hours:16, company:'Multiple Clients', skills:['Perplexity AI','Web Scraping','Data Synthesis','Slack API'],
    img:'project-images/AI Market Research Automation System.jpeg',
    desc:'Automated research pipeline that queries multiple data sources, runs competitive analysis via Perplexity AI, synthesizes findings, and delivers structured reports to Slack.',
    features:['Multi-source web research with Perplexity AI','Competitor analysis and trend detection','Structured report generation with key insights','Automated delivery to Slack + Notion archive']
  },
  { cat:'n8n', title:'Lead Generation System', tag:'Lead Generation', color:'#e05c35', hours:15, company:'SaaS Startup', skills:['Apollo API','Apify','Data Enrichment','ICP Scoring'],
    img:'project-images/Lead Gen using Apify.png',
    desc:'Full-stack lead gen that pulls targeted prospects from Apollo/Apify, enriches with firmographic data, scores by ICP fit, and auto-enrolls qualified leads in outbound sequences.',
    features:['Apollo/Apify prospect sourcing with filters','Multi-step data enrichment pipeline','ICP fit scoring with tiered thresholds','Auto-enrollment in outbound sequences']
  },
  { cat:'n8n', title:'Metadata Automation', tag:'File Management', color:'#2d7ff9', hours:9, company:'Digital Agency', skills:['File Processing','AI Tagging','Google Sheets','Airtable'],
    img:'project-images/metadata.png',
    desc:'Extracts and organizes metadata from digital files and media assets — enabling faster retrieval, AI-driven tagging, and eliminating all manual categorization work.',
    features:['Automated metadata extraction from files/media','AI-driven tagging based on file content & type','Centralized Google Sheets / Airtable database','Batch processing + duplicate file detection']
  },
  { cat:'n8n', title:'Lead Outreach Automation', tag:'Sales Outreach', color:'#0078d4', hours:20, company:'E-Commerce Firm', skills:['GPT-4 API','Email Integration','CRM API','Reply Detection'],
    img:'project-images/Lead Outreach.png',
    desc:'Identifies qualified prospects, sends AI-personalized outreach, follows up at optimal intervals, tracks replies, and logs all activity into your CRM automatically.',
    features:['AI-personalized cold email generation via GPT-4','Automated follow-up scheduling at set intervals','Reply detection that stops sequences automatically','Real-time CRM activity logging for all touchpoints']
  },
  { cat:'zapier', title:'Intelligent Media Transcription & Blog Generation', tag:'Content Pipeline', color:'#ff4a00', hours:10, company:'Marketing Agency', skills:['AI Transcription','SEO Optimization','Multi-Channel Publishing','Zapier'],
    img:'project-images/project-transcription.png',
    desc:'End-to-end content pipeline that converts short-form video into SEO-optimized blog posts and social captions with automated multi-channel publishing.',
    features:['Zero manual intervention for content repurposing across platforms','Automated video-to-text transcription using AI by Zapier','Multi-channel routing to Facebook and LinkedIn via Zapier Paths','Dynamic content looping and automated email distribution']
  },
  { cat:'zapier', title:'High-Intent Lead Identification & Engagement Stack', tag:'Lead Engagement', color:'#ff4a00', hours:12, company:'Consulting Group', skills:['Webhooks','AI Personalization','Slack API','Lead Scoring'],
    img:'project-images/project-lead.png',
    desc:'Custom webhook-based lead ingestion with dual-path logic to categorize and autonomously engage high-priority leads using AI by Zapier personalized emails.',
    features:['Reduced manual lead screening time by 80%','Custom webhook ingestion with dynamic text formatting','Dual-path conditional routing for High vs. Low priority leads','Automated AI email drafting and instant Slack team notifications']
  },
  { cat:'zapier', title:'AI Content Repurposing Pipeline', tag:'Social Automation', color:'#ff4a00', hours:14, company:'Content Creator Network', skills:['Google Drive API','AI Content Gen','LinkedIn API','Data Looping'],
    img:'project-images/Ai-content-repurposing.png',
    desc:'Fully automated content engine that watches Google Drive for new files, extracts content via AI, generates long-form blog posts, and loops through the outputs to publish tailored updates across multiple LinkedIn channels.',
    features:['Google Drive trigger for seamless file ingestion','AI-powered URL extraction and blog post generation','Advanced data looping to process multiple content pieces simultaneously','Conditional routing to publish customized LinkedIn updates']
  },
  { cat:'zapier', title:'Apollo Lead Router & Account Setup', tag:'Sales Ops', color:'#ff4a00', hours:8, company:'Tech Startup', skills:['Apollo.io API','Webhooks','Data Standardization','Lead Segmentation'],
    img:'project-images/apollo-lead-router.png',
    desc:'An automated lead ingestion system that catches incoming webhook data, formats it, creates corresponding accounts in Apollo.io, and conditionally routes leads into prioritized databases based on their value.',
    features:['Custom Webhook ingestion for flexible, real-time lead capture','Automated text formatting and data standardization','Direct integration with Apollo.io for zero-touch account creation','Conditional routing to instantly segment high-priority vs. standard leads']
  },
  { cat:'zapier', title:'Asana Lead CRM & Action Automation', tag:'CRM Automation', color:'#ff4a00', hours:18, company:'Professional Services', skills:['Asana API','Google Drive','Email Automation','Conditional Logic'],
    img:'project-images/lead-action-automation-crm.png',
    desc:'A complex, multi-path CRM automation triggered by Asana task updates. It dynamically handles lead statuses—creating client folders, dispatching targeted follow-up emails, and routing post-sale onboarding based on specific service tiers.',
    features:['Asana task-based trigger for real-time pipeline management','5-way conditional routing for distinct lead lifecycle stages','Automated Google Drive client folder and subtask generation','Nested conditional logic to dispatch service-specific post-sale emails']
  },
  { cat:'make', title:'Xero to Asana Financial Sync', tag:'Finance Ops', color:'#5e00d1', hours:12, company:'Accounting Firm', skills:['Xero API','Asana API','CSV Generation','Data Sync'],
    img:'project-images/xero-asana-export.png',
    desc:'Automates financial reporting by watching for completed Asana tasks, pulling account transactions via Xero API, compiling a formatted CSV report, and attaching it back to the project management workflow.',
    features:['Asana task-triggered financial data extraction','Custom Xero API integration for transaction retrieval','Automated CSV generation using Google Sheets','Self-cleaning architecture that resets databases after runs']
  },
  { cat:'make', title:'AI Lead Qualification & CRM Auto-Pipeline', tag:'Lead Scoring', color:'#5e00d1', hours:15, company:'B2B SaaS', skills:['OpenAI API','Real-time Routing','CRM Integration','Slack API'],
    img:'project-images/project-lead-qualification.png',
    desc:'AI-powered lead qualification system that scores and routes inbound leads in real time, updates CRM automatically, and instantly alerts teams for high-priority opportunities via Slack and email.',
    features:['Real-time lead scoring and routing with zero manual CRM updates','Multi-step AI analysis using OpenAI to determine lead priority','Automated data routing based on custom scoring thresholds','Instant team alerts via Slack and Gmail for high-value leads']
  },
];
