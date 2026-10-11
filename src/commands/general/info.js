'use strict';

const config = require('../../config/config');

module.exports = {
  name: 'info',
  description: 'Get bot information',
  category: 'general',

  async execute(msg) {
    const infoText = `╔════════════════════════════════╗
║     🚀 NOVA OS Info           ║
╚════════════════════════════════╝

🤖 Bot Name: ${config.botName}
📝 Description: ${config.botDescription}
👤 Owner: ${config.ownerName}
⚙️ Mode: ${config.mode}
📍 Prefix: ${config.prefix}

Features:
✅ ViewOnce media capture
✅ DM forwarding
✅ Command system
✅ Group support

Powered by BIGACE`;

    await msg.reply(infoText);
  }
};
