'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts.js');
const userstore = require('../models/user-store');
const classStore = require('../models/class-store');
const analytics = require('../utils/analytics');
const uuid = require('uuid');

const trainerDashboard = {
  index(request, response) {
    logger.info('trainerDashboard rendering');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const userList = userstore.getAllUsers();
    const viewData = {
      title: 'Trainer Dashboard',
      trainer: loggedInTrainer,
      userList: userList,
    };
    logger.info('about to render');
    response.render('trainerDashboard', viewData);
  },

  trainerView(request, response) {
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const userId = request.params.id;
    const user = userstore.getUserById(userId);
    let BMI;
    let BMICategory;
    let idealBodyWeight;
    if (user.assessments.length == 0) {
      BMI = analytics.calculateBMI(user.weight, user.height);
      BMICategory = analytics.determineBMICategory(BMI);
      idealBodyWeight = analytics.isIdealBodyWeight(user, user.height);
    } else {
      BMI = analytics.calculateBMI(user.assessments[0].weight, user.height);
      BMICategory = analytics.determineBMICategory(BMI);
      idealBodyWeight = analytics.isIdealBodyWeight(user.assessments[0].weight, user.height);
    }
    const assessments = userstore.getUserAssessments(user);
    const viewData = {
      title: 'Trainer View',
      trainer: loggedInTrainer,
      id: userId,
      user: user,
      BMI: BMI,
      BMICategory: BMICategory,
      idealBodyWeight: idealBodyWeight,
      assessment: assessments,
    };
    response.render('trainerView', viewData);
  },

  deleteUser(request, response) {
    const userId = request.params.id;
    userstore.deleteUser(userId);
    response.redirect('/trainerDashboard');
  },

  addComment(request, response) {
    const userId = request.params.id;
    const assessmentId = request.params.assessmentid;
    const comment = request.body.comment;
    const updateAssessment = userstore.getAssessment(userId, assessmentId);
    updateAssessment.comment = comment;
    userstore.store.save();
    response.redirect('/trainerDashboard/trainerView/' + userId);
  },

  addGoal(request, response) {
    const userId = request.params.id;
    const date = new Date(request.body.date);
    const newGoal = {
      goalId: uuid(),
      target: request.body.target,
      measure: request.body.measure,
      description: request.body.description,
      date: date.toDateString(),
      status: 'Open',
    }
    userstore.addGoal(userId, newGoal);
    response.redirect('/trainerDashboard/trainerView/' + userId);
  },
};

module.exports = trainerDashboard;
