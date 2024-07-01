'use strict';

/**
 * calendar-event service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::calendar-event.calendar-event');
