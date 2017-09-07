'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts.js');
const userStore = require('../models/user-store');
const classStore = require('../models/class-store');
const trainerStore = require('../models/trainer-store');
const programmeStore = require('../models/programme-store');
const analytics = require('../utils/analytics');
const uuid = require('uuid');

const fitnessProgrammes = {
  index(request, response) {
    logger.info('programme view rendering');
    const trainer = accounts.getCurrentTrainer(request);
    const users = userStore.getAllUsers();
    const classes = classStore.getAllClasses();
    const programmes = programmeStore.getAllProgrammes();
    const viewData = {
      trainer: trainer,
      users: users,
      classes: classes,
      programmes: programmes,
    };
    response.render('fitnessProgrammes', viewData);
  },
};

module.exports = fitnessProgrammes;

