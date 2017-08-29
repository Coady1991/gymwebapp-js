'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts.js');
const userStore = require('../models/user-store');
const classStore = require('../models/class-store');
const trainerStore = require('../models/trainer-store');
const analytics = require('../utils/analytics');
const uuid = require('uuid');

const classes = {
  index(request, response) {
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

  memberClassView(request, response) {
    logger.info('memberClassView rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const classList = classStore.getAllClasses();
    const viewData = {
      user: loggedInUser,
      classList: classList,
    };
    logger.debug('rendering classes');
    response.render('memberClassView', viewData);
  },

  addClass(request, response) {
    logger.info('adding a new class');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const date = new Date(request.body.date);
    const newClass = {
      classId: uuid(),
      trainerid: loggedInTrainer.id,
      className: request.body.className,
      noOfClass: request.body.noOfClass,
      duration: request.body.duration,
      difficulty: request.body.difficulty,
      capacity: request.body.capacity,
      time: request.body.time,
      date: date.toDateString(),
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
    response.redirect('/classes/');
  },

  deleteClass(request, response) {
    const classId = request.params.classId;
    logger.debug('deleting', classId);
    classStore.deleteClass(classId);
    response.redirect('/classes/');
  },
};

module.exports = classes;
