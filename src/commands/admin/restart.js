'use strict';

module.exports = {
  name: 'restart',
  description: 'Restart the bot',
  category: 'admin',
  owner_only: true,

  async execute(msg) {
    await msg.reply('🔄 Restarting NOVA OS...');
    setTimeout(() => process.exit(1), 1000);
  }
};
