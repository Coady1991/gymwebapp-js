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
    let goalPrompt = true;
    let bookAssess = false;
    for (let i = 0; i < goals.length; i++) {
      if ((goals[i].status === 'Open') || (goals[i].status === 'Awaiting processing')) {
        goalPrompt = false;
        const timeDiff = (new Date(goals[i].date) - new Date);
        const diff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (diff <= 0) {
          const target = goals[i].target;
          const measure = goals[i].measure;
          if (assessments.length > 0) {
            const recentAssess = assessments[0];
            const dateDiff = (new Date(recentAssess.date) - new Date);
            const diff2 = Math.ceil(dateDiff / (1000 * 3600 * 24));
            if ((diff2 <= 0) && (diff2 >= (-3))) {
              if (target === 'Weight') {
                if (measure <= recentAssess.weight) {
                  goals[i].status = 'Achieved';
                } else {
                  goals[i].status = 'Missed';
                }
              } else if (target === 'Chest') {
                if (measure <= recentAssess.chest) {
                  goals[i].status = 'Achieved';
                } else {
                  goals[i].status = 'Missed';
                }
              } else if (target === 'Thigh') {
                if (measure <= recentAssess.thigh) {
                  goals[i].status = 'Achieved';
                } else {
                  goals[i].status = 'Missed';
                }
              } else if (target === 'Upper Arm') {
                if (measure <= recentAssess.upperArm) {
                  goals[i].status = 'Achieved';
                } else {
                  goals[i].status = 'Missed';
                }
              } else if (target === 'Waist') {
                if (measure <= recentAssess.waist) {
                  goals[i].status = 'Achieved';
                } else {
                  goals[i].status = 'Missed';
                }
              } else if (target === 'Hips') {
                if (measure <= recentAssess.hips) {
                  goals[i].status = 'Achieved';
                } else {
                  goals[i].status = 'Missed';
                }
              }
            } else {
              goals[i].status = 'Awaiting processing';
              bookAssess = true;
            }
          } else {
            goals[i].status = 'Awaiting processing';
            bookAssess = true;
          }
        }
      }
    }
    const viewData = {
      title: 'Gym App Dashboard',
      user: loggedInUser,
      BMI: BMI,
      BMICategory: BMICategory,
      idealBodyWeight: idealBodyWeight,
      assessments: assessments,
      goals: goals,
      goalPrompt: goalPrompt,
      bookAssess: bookAssess,
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

  deleteGoal(request, response) {
    const user = accounts.getCurrentUser(request);
    const goalId = request.params.goalId;
    userStore.deleteGoal(user.id, goalId);
    response.redirect('/dashboard/');
  }
};

module.exports = dashboard;
