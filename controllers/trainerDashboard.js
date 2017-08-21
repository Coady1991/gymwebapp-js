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

  classView(request, response) {
    logger.info('class view rendering');
    const trainer = accounts.getCurrentTrainer(request);
    const classes = classStore.getAllClasses();
    const viewData = {
      title: 'Trainer Classes',
      trainer: trainer,
      classes: classes,
    };
    logger.info('about to render classes');
    response.render('classView', viewData);
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

  addClass(request, response) {
    logger.info('adding a new class');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const newClass = {
      classId: uuid(),
      trainerid: loggedInTrainer.id,
      className: request.body.className,
      noOfClass: request.body.noOfClass,
      duration: request.body.duration,
      difficulty: request.body.difficulty,
      capacity: request.body.capacity,
      time: request.body.time,
      date: request.body.date,
      class: [],
    };
    for (let i = 0; i < request.body.noOfClass; i++) {
      const date = new Date(request.body.date);
      const nextDate = (i * 7);
      const classDate = new Date(date.setTime(date.getTime() + (nextDate * 86400000))); // https://stackoverflow.com/questions/6963311/add-days-to-a-date-object
      const exClass = {
        exClassid: uuid(),
        duration: request.body.duration,
        currentCapacity: 0,
        capacity: request.body.capacity,
        classDate: classDate.toDateString(),
        time: request.body.time,
        members: [],
      };
      newClass.class.push(exClass);
    }
    logger.debug('adding new classess');
    classStore.addClass(newClass);
    response.redirect('/trainerDashboard/classView');
  },
};

module.exports = trainerDashboard;
