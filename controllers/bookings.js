'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts.js');
const userStore = require('../models/user-store');
const classStore = require('../models/class-store');
const trainerStore = require('../models/trainer-store');
const analytics = require('../utils/analytics');
const uuid = require('uuid');

const bookings = {
  index(request, response) {
    logger.info('bookings view rendering');
    const trainer = accounts.getCurrentTrainer(request);
    const user = userStore.getAllUsers();
    const assessBookings = trainerStore.bookings;
    const viewData = {
      title: 'Trainer Bookings',
      trainer: trainer,
      user: user,
      assessBookings: assessBookings,
      conflict: false,
    };
    logger.info('about to render trainerBookings');
    response.render('trainerBookings', viewData);
  },

  memberBookingView(request, response) {
    logger.info('memberBookingView rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const trainer = trainerStore.getAllTrainers();
    const memberAssessBooking = userStore.bookings;
    const viewData = {
      user: loggedInUser,
      trainer: trainer,
      memberAssessBooking: memberAssessBooking,
      conflict: false,
    };
    logger.info('about to render memberBookingView');
    response.render('memberBookings', viewData);
  },

  addTrainerBooking(request, response) {
    console.log(request.body);
    const trainer = accounts.getCurrentTrainer(request);
    const users = userStore.getAllUsers();
    const assessBookings = trainer.bookings;
    const viewData = {
      title: 'Trainer Bookings',
      trainer: trainer,
      user: users,
      assessBookings: assessBookings,
      conflict: false,
    };
    const userId = request.body.user;
    const member = userStore.getUserById(userId);
    const date = new Date(request.body.date);
    const memberBookings = member.bookings;
    let conflict = false;
    const trainerBooking = {
      bookingId: uuid(),
      userId: member.id,
      date: date.toDateString(),
      time: request.body.time,
      firstName: member.firstName,
      lastName: member.lastName,
    };
    for (let i = 0; i < memberBookings.length; i++) {
      if (trainerBooking.date === memberBookings[i].date) {
        if (trainerBooking.time === memberBookings[i].time) {
          conflict = true;
        } else {
          for (let j = 0; j < assessBookings.length; j++) {
            if (trainerBooking.date === assessBookings[j].date) {
              if (trainerBooking.date === assessBookings[j].date) {
                conflict = true;
              }
            }
          }
        }
      }
    }

    if (!conflict) {
      trainerStore.newBooking(trainer.id, trainerBooking);
      response.redirect('/bookings');
    } else {
      viewData.conflict = conflict;
      response.render('trainerBookings', viewData);
    }
  },

  addMemberBooking(request, response) {
    console.log(request.body);
    const user = accounts.getCurrentUser(request);
    const loggedInUser = accounts.getCurrentUser(request);
    const trainers = trainerStore.getAllTrainers();
    const memberAssessBooking = user.bookings;
    let viewData = {
      user: loggedInUser,
      trainer: trainers,
      memberAssessBooking: memberAssessBooking,
    };
    const trainerId = request.body.trainer;
    const trainer = trainerStore.getTrainerById(trainerId);
    const date = new Date(request.body.date);
    const trainerBookings = trainer.bookings;
    let conflict = false;
    const memberBooking = {
      bookingId: uuid(),
      trainerId: trainer.id,
      date: date.toDateString(),
      time: request.body.time,
      firstName: trainer.firstName,
      lastName: trainer.lastName,
    };
    for (let i = 0; i < trainerBookings.length; i++) {
      if (memberBooking.date === trainerBookings[i].date) {
        if (memberBooking.time === trainerBookings[i].time) {
          conflict = true;
        } else {
          for (let j = 0; j < memberAssessBooking.length; j++) {
            if (memberBooking.date === memberAssessBooking[j].date) {
              if (memberBooking.date === memberAssessBooking[j].date) {
                conflict = true;
              }
            }
          }
        }
      }
    }

    if (!conflict) {
      userStore.newBooking(user.id, memberBooking);
      response.redirect('/bookings/memberBookings');
    } else {
      viewData.conflict = conflict;
      response.render('memberBookings', viewData);
    }
  },
};

module.exports = bookings;
