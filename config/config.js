require('dotenv').config();

module.exports = {
  sessionId: process.env.SESSION_ID || 'NOVA-OS:default',

  ownerNumber: process.env.OWNER_NUMBER || '2348069675806',
  ownerName: process.env.OWNER_NAME || 'BIGACE',

  botName: process.env.BOT_NAME || 'NOVA OS',
  botDescription: process.env.BOT_DESCRIPTION || 'Powered by BIGACE',
  prefix: process.env.PREFIX || '.',
  mode: process.env.MODE || 'public',

  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',

  enableViewOnceCapture: process.env.ENABLE_VIEWONCE_CAPTURE === 'true' || true,
  enableAutoForward: process.env.ENABLE_AUTO_DM_FORWARD === 'true' || true,
  enableGroupCommands: process.env.ENABLE_GROUP_COMMANDS === 'true' || true,

  openaiApiKey: process.env.OPENAI_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  newsApiKey: process.env.NEWSAPI_API_KEY || '',
  rapidApiKey: process.env.RAPIDAPI_API_KEY || '',

  logLevel: process.env.LOG_LEVEL || 'info',

  sessionPath: './session',
  commandsPath: './src/commands',

  debug: process.env.DEBUG === 'true' || false,
};
