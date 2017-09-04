'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts.js');
const userStore = require('../models/user-store');
const classStore = require('../models/class-store');
const trainerStore = require('../models/trainer-store');
const analytics = require('../utils/analytics');
const uuid = require('uuid');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    let BMI;
    let BMICategory;
    let idealBodyWeight;
    if (loggedInUser.assessments.length == 0) {
      BMI = analytics.calculateBMI(loggedInUser.weight, loggedInUser.height);
      BMICategory = analytics.determineBMICategory(BMI);
      idealBodyWeight = analytics.isIdealBodyWeight(loggedInUser, loggedInUser.height);
    } else {
      BMI = analytics.calculateBMI(loggedInUser.assessments[0].weight, loggedInUser.height);
      BMICategory = analytics.determineBMICategory(BMI);
      idealBodyWeight = analytics.isIdealBodyWeight(loggedInUser.assessments[0].weight, loggedInUser.height);
    }
    const assessments = loggedInUser.assessments;
    const goals = loggedInUser.goals;
    const viewData = {
      title: 'Gym App Dashboard',
      user: loggedInUser,
      BMI: BMI,
      BMICategory: BMICategory,
      idealBodyWeight: idealBodyWeight,
      assessments: assessments,
      goals: goals,
    };
    logger.info('about to render');
    response.render('dashboard', viewData);
  },

  deleteAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const assessmentId = request.params.assessmentid;
    logger.debug(`Deleting Assessment ${assessmentId} from Dashboard`);
    userStore.deleteAssessment(loggedInUser.id, assessmentId);
    response.redirect('/dashboard/');
  },

  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newAssessment = {
      assessmentid: uuid(),
      date: new Date().toDateString(),
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperArm: request.body.upperArm,
      waist: request.body.waist,
      hips: request.body.hips,
      comment: '',
    };
    logger.debug('Creating a new assessment', newAssessment);
    userStore.addAssessment(loggedInUser.id, newAssessment);
    response.redirect('/dashboard/');
  },

  addGoal(request, response) {
    const user = accounts.getCurrentUser(request);
    const date = new Date(request.body.date);
    const newGoal = {
      goalId: uuid(),
      target: request.body.target,
      measure: request.body.measure,
      description: request.body.description,
      date: date.toDateString(),
      status: 'Open',
    }
    userStore.addGoal(user.id, newGoal);
    response.redirect('/dashboard/');
  },
};

module.exports = dashboard;
