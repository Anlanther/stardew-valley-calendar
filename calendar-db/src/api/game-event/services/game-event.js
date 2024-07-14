'use strict';

/**
 * game-event service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::game-event.game-event');
