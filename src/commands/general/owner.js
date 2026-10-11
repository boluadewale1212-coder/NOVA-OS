'use strict';

const config = require('../../config/config');

module.exports = {
  name: 'owner',
  description: 'Get owner info',
  category: 'general',

  async execute(msg) {
    const ownerText = `👤 *Owner Information*

Name: ${config.ownerName}
Number: ${config.ownerNumber}

WhatsApp: https://wa.me/${config.ownerNumber}

Powered by BIGACE`;

    await msg.reply(ownerText);
  }
};
