(function () {
  const responseEl = document.getElementById('response');
  const idInstance = () => document.getElementById('idInstance').value.trim();
  const apiTokenInstance = () => document.getElementById('apiTokenInstance').value.trim();

  const apiTokenInput = document.getElementById('apiTokenInstance');
  const toggleBtn = document.querySelector('.toggle-password');
  if (toggleBtn && apiTokenInput) {
    toggleBtn.addEventListener('click', () => {
      const isPass = apiTokenInput.type === 'password';
      apiTokenInput.type = isPass ? 'text' : 'password';
      toggleBtn.classList.toggle('visible', isPass);
      toggleBtn.setAttribute('aria-label', isPass ? 'Скрыть токен' : 'Показать токен');
      toggleBtn.setAttribute('title', isPass ? 'Скрыть токен' : 'Показать токен');
    });
  }

  function show(data) {
    responseEl.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  }

  function showError(err) {
    show({ error: err.message || String(err) });
  }

  async function api(path, body = {}) {
    const opts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idInstance: idInstance(), apiTokenInstance: apiTokenInstance(), ...body }),
    };
    const r = await fetch(path, opts);
    const data = await r.json().catch(async () => ({ error: await r.text() }));
    if (!r.ok) show(data);
    else show(data);
  }

  document.getElementById('btnGetSettings').addEventListener('click', () => {
    api('/api/getSettings').catch(showError);
  });
  document.getElementById('btnGetStateInstance').addEventListener('click', () => {
    api('/api/getStateInstance').catch(showError);
  });
  document.getElementById('btnSendMessage').addEventListener('click', () => {
    const chatId = document.getElementById('messageChatId').value.trim();
    const message = document.getElementById('messageText').value;
    api('/api/sendMessage', { chatId, message }).catch(showError);
  });
  document.getElementById('btnSendFileByUrl').addEventListener('click', () => {
    const chatId = document.getElementById('fileChatId').value.trim();
    const urlFile = document.getElementById('fileUrl').value.trim();
    api('/api/sendFileByUrl', { chatId, urlFile }).catch(showError);
  });
})();
