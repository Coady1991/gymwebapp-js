'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics');
const uuid = require('uuid');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const BMI = analytics.calculateBMI(loggedInUser);
    const BMICategory = analytics.determineBMICategory(BMI);
    const idealBodyWeight = analytics.isIdealBodyWeight(loggedInUser);
    const viewData = {
      title: 'Gym App Dashboard',
      user: loggedInUser,
      BMI: BMI,
      BMICategory: BMICategory,
      idealBodyWeight: idealBodyWeight,
    };
    logger.info('about to render');
    response.render('dashboard', viewData);
  },
};

module.exports = dashboard;
