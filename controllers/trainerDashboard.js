'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts.js');
const userstore = require('../models/user-store');
const assessmentStore = require('../models/assessment-store');
const analytics = require('../utils/analytics');
const uuid = require('uuid');

const trainerDashboard = {
  index(request, response) {
    logger.info('trainerdashboard rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const userList = userstore.getAllUsers();
    const viewData = {
      title: 'Trainer Dashboard',
      trainer: loggedInTrainer,
      userList: userList,
    };
    response.render('trainerDashboard', viewData);
  },
};

module.exports = trainerDashboard;
