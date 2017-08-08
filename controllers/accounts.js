'use strict';

const userstore = require('../models/user-store');
const trainerstore = require('../models/trainer-store');
const logger = require('../utils/logger');
const uuid = require('uuid');

const accounts = {

  index(request, response) {
    const viewData = {
      title: 'Login or Signup',
    };
    response.render('index', viewData);
  },

  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },

  logout(request, response) {
    response.cookie('gymapp', '');
    response.redirect('/');
  },

  signup(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('signup', viewData);
  },

  register(request, response) {
    const user = request.body;
    user.id = uuid();
    user.assessments = [];
    userstore.addUser(user);
    logger.info(`registering ${user.email}`);
    response.redirect('/');
  },

  authenticate(request, response) {
    const user = userstore.getUserByEmail(request.body.email);
    const trainer = trainerstore.getTrainerByEmail(request.body.email);
    if (user && user.password === request.body.password) {
      response.cookie('user', user.email);
      logger.info(`logging in ${user.email}`);
      response.redirect('/dashboard');
    } else if (trainer && trainer.password === request.body.password) {
      response.cookie('trainer', trainer.email);
      logger.info(`logging in ${trainer.email}`);
      response.redirect('/trainerDashboard');
    } else {
      logger.info(`authentication failed`);
      response.redirect('/login');
    }
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.user;
    return userstore.getUserByEmail(userEmail);
  },

  getCurrentTrainer(request) {
    const trainerEmail = request.cookies.trainer;
    return trainerstore.getTrainerByEmail(trainerEmail);
  },
};

module.exports = accounts;