'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts.js');
const assessmentStore = require('../models/assessment-store');
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
      assessments: assessmentStore.getUserAssessments(loggedInUser.id),
    };
    logger.info('about to render');
    response.render('dashboard', viewData);
  },
  deleteAssessment(request, response) {
    const assessmentId = request.params.id;
    logger.debug(`Deleting Assessment ${assessmentId} from Dashboard`);
    assessmentStore.deleteAssessment(assessmentId);
    response.redirect('/dashboard/');
  },
  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newAssessment = {
      id: uuid(),
      userid: loggedInUser.id,
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
    assessmentStore.addAssessmentList(newAssessment);
    response.redirect('/dashboard/');
  },
};

module.exports = dashboard;
