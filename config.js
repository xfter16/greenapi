require('dotenv').config();

module.exports = {
  idInstance: process.env.ID_INSTANCE || '1111111111',
  apiTokenInstance: process.env.API_TOKEN_INSTANCE || 'some token',
  chatId: process.env.CHAT_ID || '77771234567',
};
