const express = require('express');
const path = require('path');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;
const GREEN_API_BASE = 'https://api.green-api.com';

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', config);
});

const errorTextMap = {
  INSTANCE_TOKEN_REQUIRED: { error: 'idInstance and apiTokenInstance required'},
  SEND_MESSAGE_PARAMS_REQUIRED: { error: 'idInstance, apiTokenInstance, chatId and message required'},
  SEND_FILE_BY_URL_PARAMS_REQUIRED: { error: 'idInstance, apiTokenInstance, chatId and urlFile required'},
}

function normalizeChatId(chatId) {
  return String(chatId).includes('@') ? chatId : `${chatId}@c.us`;
}

function getGreenAPIUrl(idInstance, apiTokenInstance, method) {
  return `${GREEN_API_BASE}/waInstance${idInstance}/${method}/${apiTokenInstance}`;
}

app.post('/api/getSettings', async (req, res) => {
  const { idInstance, apiTokenInstance } = req.body || {};
  if (!idInstance || !apiTokenInstance)
    return res.status(400).json(errorTextMap.INSTANCE_TOKEN_REQUIRED);

  try {
    const r = await fetch(getGreenAPIUrl(idInstance, apiTokenInstance, 'getSettings'));
    const data = await r.json().catch(() => ({}));
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/getStateInstance', async (req, res) => {
  const { idInstance, apiTokenInstance } = req.body || {};
  if (!idInstance || !apiTokenInstance)
    return res.status(400).json(errorTextMap.INSTANCE_TOKEN_REQUIRED);

  try {
    const r = await fetch(getGreenAPIUrl(idInstance, apiTokenInstance, 'getStateInstance'));
    const data = await r.json().catch(() => ({}));
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/sendMessage', async (req, res) => {
  const { idInstance, apiTokenInstance, chatId, message } = req.body || {};
  if (!idInstance || !apiTokenInstance || !chatId || !message)
    return res.status(400).json(errorTextMap.SEND_MESSAGE_PARAMS_REQUIRED);

  try {
    const r = await fetch(getGreenAPIUrl(idInstance, apiTokenInstance, 'sendMessage'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: normalizeChatId(chatId), message: String(message) }),
    });
    const data = await r.json().catch(() => ({}));
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/sendFileByUrl', async (req, res) => {
  const { idInstance, apiTokenInstance, chatId, urlFile, fileName } = req.body || {};
  console.log(req.body);
  if (!idInstance || !apiTokenInstance || !chatId || !urlFile)
    return res.status(400).json(errorTextMap.SEND_FILE_BY_URL_PARAMS_REQUIRED);
  const name = fileName || (urlFile.split('/').pop() || 'file.png');
  try {
    const r = await fetch(getGreenAPIUrl(idInstance, apiTokenInstance, 'sendFileByUrl'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: normalizeChatId(chatId),
        urlFile: String(urlFile),
        fileName: name,
      }),
    });
    const data = await r.json().catch(e => console.log(e));
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
