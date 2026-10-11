'use strict';

module.exports = {
  name: 'ping',
  description: 'Check bot status',
  category: 'general',

  async execute(msg) {
    await msg.reply('🏓 Pong!');
  }
};
