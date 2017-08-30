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

  deleteExClass(request, response) {
    const classId = request.params.classId;
    const exClassId = request.params.exClassid;
    classStore.deleteExClass(classId, exClassId);
    response.redirect('/classes/');
  },

  enrollInExClass(request, response) {
    const classId = request.params.classId;
    const exClassId = request.params.exClassid;
    const classSession = classStore.getExClassById(classId, exClassId);
    const user = accounts.getCurrentUser(request);
    let enrolled = false;
    for (let i = 0; i < classSession.members.length; i++) {
      if (classSession.members[i] === user.id) {
        enrolled = true;
      }
    }

    if ((!enrolled) && (classSession.currentCapacity < classSession.capacity)) {
      classSession.currentCapacity += 1;
      classSession.members.push(user.id);
      classStore.store.save();
    } else {
      logger.debug('Unable to enroll');
    }
    response.redirect('/classes/memberClassView');
  },

  unenrollInExClass(request, response) {
    const classId = request.params.classId;
    const exClassId = request.params.exClassid;
    const classSession = classStore.getExClassById(classId, exClassId);
    const user = accounts.getCurrentUser(request);
    for (let i = 0; i < classSession.members.length; i++) {
      if (classSession.members[i] === user.id) {
        classSession.currentCapacity -= 1;
        classSession.members.splice(user.id, 1); //https://stackoverflow.com/questions/3396088/how-do-i-remove-an-object-from-an-array-with-javascript
        classStore.store.save();
      } else {
        logger.debug('Not enrolled in exClass');
      }
      response.redirect('/classes/memberClassView');
    }
  },

  enrollInAllClasses(request, response) {
    const classId = request.params.classId;
    const classSession = classStore.getClassById(classId);
    const user = accounts.getCurrentUser(request);
    for (let i = 0; i < classSession.class.length; i++) {
      let thisClass = classSession.class[i];
      let enrolled = false;
      for (let j = 0; j < thisClass.members.length; j++) {
        if (thisClass.members[j] === user.id) {
          enrolled = true;
        }
      }
      if ((!enrolled) && (thisClass.currentCapacity < thisClass.capacity)) {
        thisClass.currentCapacity += 1;
        thisClass.members.push(user.id);
        classStore.store.save();
      } else {
        logger.debug('Unable to enroll');
      }
    }
    response.redirect('/classes/memberClassView');
  },
};

module.exports = classes;
