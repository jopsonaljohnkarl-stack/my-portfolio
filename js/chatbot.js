(function () {
  var bubble = document.getElementById('cbBubble');
  var win = document.getElementById('cbWindow');
  var msgs = document.getElementById('cbMessages');
  var chipsEl = document.getElementById('cbChips');
  var input = document.getElementById('cbInput');
  var sendBtn = document.getElementById('cbSend');
  var dataApi = window.ChatbotData;
  var engineApi = window.ChatbotEngine;
  var isOpen = false;
  var isTyping = false;

  if (!bubble || !win || !msgs || !chipsEl || !input || !sendBtn || !dataApi || !engineApi) {
    return;
  }

  var chatbot = engineApi.createChatbotEngine(dataApi.CHATBOT_DATA);
  var avatarHtml = '<img src="project-images/chatbot-logo.png" alt="John" onerror="this.style.display=\'none\';this.parentElement.textContent=\'JJ\'" />';
  var QUICK = dataApi.CHATBOT_DATA.quickReplies;

  function scrollToTarget(target) {
    var el = document.querySelector(target);

    if (!el) {
      return;
    }

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

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

  function showTyping() {
    var wrap = document.createElement('div');
    wrap.className = 'cb-msg bot';
    wrap.id = 'cbTyping';

    var dot = document.createElement('div');
    dot.className = 'cb-msg-dot';
    dot.innerHTML = avatarHtml;

    var bubbleEl = document.createElement('div');
    bubbleEl.className = 'cb-msg-bubble cb-typing';
    bubbleEl.innerHTML = '<span></span><span></span><span></span>';

    wrap.appendChild(dot);
    wrap.appendChild(bubbleEl);
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    var typing = document.getElementById('cbTyping');

    if (typing) {
      typing.remove();
    }
  }

  function setChips(list) {
    chipsEl.innerHTML = '';

    if (!list) {
      return;
    }

    list.forEach(function (item) {
      var chip = document.createElement('button');
      chip.className = 'cb-chip';
      chip.textContent = typeof item === 'string' ? item : item.label;
      chip.addEventListener('click', function () {
        if (typeof item === 'string') {
          sendMessage(item);
          return;
        }

        if (item.action === 'scroll' && item.target) {
          scrollToTarget(item.target);
          return;
        }

        if (item.message) {
          sendMessage(item.message);
        }
      });
      chipsEl.appendChild(chip);
    });
  }

  function botReply(userText) {
    if (isTyping) {
      return;
    }

    isTyping = true;
    setChips(null);
    showTyping();

    setTimeout(function () {
      var result = chatbot.reply(userText);

      hideTyping();
      addMsg(result.text, 'bot');
      isTyping = false;
      setChips(result.chips || QUICK.slice(0, 3));
    }, 700);
  }

  function sendMessage(text) {
    var value = (text || input.value).trim();

    if (!value) {
      return;
    }

    input.value = '';
    addMsg(value, 'user');
    botReply(value);
  }

  function toggleChat() {
    isOpen = !isOpen;
    bubble.classList.toggle('open', isOpen);
    win.classList.toggle('open', isOpen);
    bubble.setAttribute('aria-expanded', isOpen);

    if (isOpen && msgs.childElementCount === 0) {
      setTimeout(function () {
        showTyping();

        setTimeout(function () {
          hideTyping();
          addMsg(chatbot.reply('hello').text, 'bot');
          setChips(QUICK);
        }, 900);
      }, 300);

      setTimeout(function () {
        input.focus();
      }, 400);
    }
  }

  sendBtn.addEventListener('click', function () {
    sendMessage();
  });

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  bubble.addEventListener('click', toggleChat);
})();
