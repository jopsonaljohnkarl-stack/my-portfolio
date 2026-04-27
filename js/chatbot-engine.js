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
    return phrases.some(function (phrase) {
      return text.includes(phrase);
    });
  }

  function createChatbotEngine(data) {
    function scrollChip(label, target) {
      return {
        label: label,
        action: 'scroll',
        target: target
      };
    }

    function reply(input) {
      const text = normalize(input);

      if (includesAny(text, ['hire', 'contact', 'book', 'call', 'email', 'whatsapp'])) {
        return {
          intent: 'contact',
          text:
            'You can reach John at ' +
            data.contact.email +
            ', message him on WhatsApp at ' +
            data.contact.whatsappLabel +
            ', or book a free call at ' +
            data.contact.calendlyUrl +
            '.',
          chips: [scrollChip('Go to Contact', '#contact'), 'What services do you offer?']
        };
      }

      if (includesAny(text, ['hello', 'hi', 'hey'])) {
        return {
          intent: 'greeting',
          text:
            "Hey! I'm John's site assistant. I can help with his services, tools, projects, process, or how to get in touch.",
          chips: data.quickReplies.slice(0, 3)
        };
      }

      if (includesAny(text, ['service', 'offer', 'what do you build', 'what do you do'])) {
        const labels = data.services.map(function (service) {
          return service.label;
        }).join(', ');

        return {
          intent: 'services',
          text:
            'John focuses on ' +
            labels +
            '. He builds practical systems that reduce manual work and keep tools in sync.',
          chips: [scrollChip('Go to Services', '#services'), 'What tools do you use?']
        };
      }

      if (includesAny(text, ['tool', 'stack', 'tech', 'platform'])) {
        return {
          intent: 'tools',
          text:
            'John regularly works with ' +
            data.tools.automation.join(', ') +
            ' for automation, ' +
            data.tools.ai.join(', ') +
            ' for AI, and ' +
            data.tools.data.join(', ') +
            ' for data workflows.',
          chips: [scrollChip('Go to Tools', '#tools'), 'Show me lead generation projects']
        };
      }

      if (includesAny(text, ['process', 'timeline', 'how long', 'turnaround'])) {
        return {
          intent: 'process',
          text:
            data.process.timeline +
            ' A typical flow is ' +
            data.process.steps.join(', ') +
            '.',
          chips: [scrollChip('Go to Process', '#process'), 'How do I hire John?']
        };
      }

      if (includesAny(text, ['lead generation', 'lead gen', 'outreach'])) {
        return {
          intent: 'projectsByCategory',
          text:
            'Lead generation examples on the site include ' +
            data.projects.byCategory.leadGeneration.join(', ') +
            '.',
          chips: [scrollChip('Go to Projects', '#work'), 'What tools do you use?']
        };
      }

      if (includesAny(text, ['projects', 'project', 'portfolio', 'work', 'show me projects', 'show me your work'])) {
        return {
          intent: 'projectsGeneral',
          text:
            'You can browse John’s portfolio in the Projects section. It includes lead generation systems, voice AI, finance ops, content workflows, and other production automations.',
          chips: [scrollChip('Go to Projects', '#work'), 'Show me lead generation projects']
        };
      }

      if (includesAny(text, ['testimonial', 'testimonials', 'reviews', 'feedback'])) {
        return {
          intent: 'testimonials',
          text:
            'You can find client feedback in the Testimonials section, where the site highlights faster lead handling, easier reporting, and smoother content operations.',
          chips: [scrollChip('Go to Testimonials', '#testimonials'), 'How do I hire John?']
        };
      }

      if (includesAny(text, ['about', 'who is john', 'who are you'])) {
        return {
          intent: 'about',
          text: data.identity.shortIntro,
          chips: [scrollChip('Go to About', '#about'), 'What services do you offer?']
        };
      }

      return {
        intent: 'unsupported',
        text:
          data.fallbacks.unsupported +
          ' Email: ' +
          data.contact.email +
          ' | Book a call: ' +
          data.contact.calendlyUrl,
        chips: ['How do I hire John?', 'What services do you offer?']
      };
    }

    return { reply: reply };
  }

  return { createChatbotEngine: createChatbotEngine };
});
