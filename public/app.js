const messagesEl = document.getElementById('messages');
const composerEl = document.getElementById('composer');
const inputEl = document.getElementById('messageInput');

let aiMessageCount = 0;

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function renderUserBubble(text) {
  const node = document.getElementById('userTemplate').content.cloneNode(true);
  node.querySelector('.user-bubble').textContent = text;
  messagesEl.appendChild(node);
  scrollToBottom();
}

function createAiBubble(templateType) {
  aiMessageCount += 1;
  const node = document.getElementById('aiTemplate').content.cloneNode(true);
  const row = node.querySelector('.ai-row');
  const answer = node.querySelector('.answer');
  const links = node.querySelector('.links');
  const feedbackActions = node.querySelector('.feedback-actions');

  row.dataset.templateType = templateType;
  answer.classList.add('typing');

  if (templateType === 'feedback') {
    feedbackActions.hidden = false;
  }

  messagesEl.appendChild(node);
  scrollToBottom();

  const bubble = messagesEl.lastElementChild;
  const answerEl = bubble.querySelector('.answer');
  const linksEl = bubble.querySelector('.links');

  const renderer = {
    htmlCommitted: '',
    htmlPending: '',
    textQueue: '',
    frameScheduled: false,
    questionBuffer: '',
    questionNode: null,

    enqueueHtmlDelta(delta) {
      this.textQueue += delta;
      this.scheduleFrame();
    },

    scheduleFrame() {
      if (this.frameScheduled) return;
      this.frameScheduled = true;
      requestAnimationFrame(() => {
        this.frameScheduled = false;
        this.flushHtmlQueue();
      });
    },

    flushHtmlQueue() {
      if (!this.textQueue) return;

      const chunkSize = 42;
      const chunk = this.textQueue.slice(0, chunkSize);
      this.textQueue = this.textQueue.slice(chunkSize);

      this.htmlPending += chunk;
      const { safeHtml, leftover } = extractRenderableHtml(this.htmlPending);
      if (safeHtml) {
        this.htmlCommitted += safeHtml;
        answerEl.innerHTML = this.htmlCommitted;
      }
      this.htmlPending = leftover;

      scrollToBottom();
      if (this.textQueue) this.scheduleFrame();
    },

    startQuestion() {
      this.questionBuffer = '';
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      li.appendChild(btn);
      linksEl.appendChild(li);
      this.questionNode = btn;
      scrollToBottom();
    },

    appendQuestionDelta(delta) {
      this.questionBuffer += delta;
      if (this.questionNode) {
        this.questionNode.textContent = `➜ ${this.questionBuffer}`;
      }
      scrollToBottom();
    },

    finishQuestion() {
      if (this.questionNode) {
        const value = this.questionBuffer;
        this.questionNode.addEventListener('click', () => {
          sendMessage(value);
        });
      }
      this.questionNode = null;
      this.questionBuffer = '';
    },

    setQuestions(questions) {
      linksEl.innerHTML = '';
      questions.forEach((question) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = `➜ ${question}`;
        btn.addEventListener('click', () => sendMessage(question));
        li.appendChild(btn);
        linksEl.appendChild(li);
      });
      scrollToBottom();
    },

    setDisclaimer(text) {
      bubble.querySelector('.disclaimer').textContent = text;
    },

    done() {
      if (this.htmlPending) {
        this.htmlCommitted += this.htmlPending;
        this.htmlPending = '';
      }
      if (this.textQueue) {
        this.htmlCommitted += this.textQueue;
        this.textQueue = '';
      }

      answerEl.innerHTML = this.htmlCommitted;
      answerEl.classList.remove('typing');
      scrollToBottom();
    }
  };

  return renderer;
}

function extractRenderableHtml(buffer) {
  const lastOpen = buffer.lastIndexOf('<');
  const lastClose = buffer.lastIndexOf('>');

  if (lastOpen === -1) {
    return { safeHtml: buffer, leftover: '' };
  }

  if (lastClose > lastOpen) {
    return { safeHtml: buffer, leftover: '' };
  }

  return {
    safeHtml: buffer.slice(0, lastOpen),
    leftover: buffer.slice(lastOpen)
  };
}

async function streamAssistantResponse(message, templateType) {
  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, templateType })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let bubbleController;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const event of events) {
      const line = event.split('\n').find((entry) => entry.startsWith('data: '));
      if (!line) continue;

      const payload = JSON.parse(line.slice(6));

      if (payload.type === 'message_start') {
        bubbleController = createAiBubble(payload.templateType || 'followup');
      } else if (payload.type === 'text_delta') {
        bubbleController?.enqueueHtmlDelta(payload.delta || '');
      } else if (payload.type === 'question_start') {
        bubbleController?.startQuestion();
      } else if (payload.type === 'question_delta') {
        bubbleController?.appendQuestionDelta(payload.delta || '');
      } else if (payload.type === 'question_done') {
        bubbleController?.finishQuestion();
      } else if (payload.type === 'questions') {
        bubbleController?.setQuestions(payload.items || []);
      } else if (payload.type === 'disclaimer') {
        bubbleController?.setDisclaimer(payload.text || 'Generated by AI');
      } else if (payload.type === 'message_done') {
        bubbleController?.done();
      }
    }
  }
}

async function sendMessage(text) {
  renderUserBubble(text);
  const nextTemplateType = aiMessageCount === 1 ? 'followup' : aiMessageCount === 2 ? 'feedback' : 'followup';
  await streamAssistantResponse(text, nextTemplateType);
}

composerEl.addEventListener('submit', async (event) => {
  event.preventDefault();
  const value = inputEl.value.trim();
  if (!value) return;

  inputEl.value = '';
  await sendMessage(value);
});

async function renderConversationStarter() {
  const res = await fetch('/api/conversation-starter');
  const starter = await res.json();
  const bubble = createAiBubble(starter.templateType);

  bubble.setQuestions(starter.questions);
  bubble.setDisclaimer(starter.disclaimer);
  bubble.enqueueHtmlDelta(starter.text);
  bubble.done();
}

renderConversationStarter();
