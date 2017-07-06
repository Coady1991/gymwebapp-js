'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts.js');
const uuid = require('uuid');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Gym App Dashboard',
    };
    logger.info('about to render');
    response.render('dashboard', viewData);
  },
};

module.exports = dashboard;
