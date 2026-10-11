'use strict';

const config = require('../../config/config');

module.exports = {
  name: 'help',
  description: 'Show available commands',
  category: 'general',

  async execute(msg) {
    const helpText = `╔════════════════════════════════╗
║      🚀 NOVA OS Help          ║
╚════════════════════════════════╝

📋 Available Commands:

General:
.help - Show this help menu
.ping - Check bot status
.info - Get bot information
.owner - Get owner info

Owner Only:
.restart - Restart the bot

Prefix: ${config.prefix}

Powered by BIGACE`; 

    await msg.reply(helpText);
  }
};
