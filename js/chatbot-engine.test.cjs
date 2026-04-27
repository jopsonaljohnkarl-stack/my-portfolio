const test = require('node:test');
const assert = require('node:assert/strict');

const { CHATBOT_DATA } = require('./chatbot-data.js');
const { createChatbotEngine } = require('./chatbot-engine.js');

test('chatbot data exposes approved contact details and quick replies', () => {
  assert.equal(CHATBOT_DATA.contact.email, 'jopsonaljohnkarl@gmail.com');
  assert.equal(CHATBOT_DATA.contact.whatsappHref, 'https://wa.me/639055001273');
  assert.equal(CHATBOT_DATA.contact.calendlyUrl, 'https://calendly.com/jopsonaljohnkarl/30min');
  assert.ok(CHATBOT_DATA.quickReplies.includes('What do you build?'));
});

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

test('engine answers general project questions with a projects scroll chip', () => {
  const engine = createChatbotEngine(CHATBOT_DATA);
  const result = engine.reply('Show me projects');

  assert.equal(result.intent, 'projectsGeneral');
  assert.match(result.text, /Projects section/);
  assert.equal(result.chips[0].action, 'scroll');
  assert.equal(result.chips[0].target, '#work');
});
