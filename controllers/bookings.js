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
    const userId = request.body.user;
    const member = userStore.getUserById(userId);
    const date = new Date(request.body.date);
    const trainerBooking = {
      bookingId: uuid(),
      userId: member.id,
      date: date.toDateString(),
      time: request.body.time,
    };
    trainerStore.newBooking(trainer.id, trainerBooking);
    response.redirect('/bookings/');
  },

  addMemberBooking(request, response) {
    console.log(request.body);
    const user = accounts.getCurrentUser(request);
    const loggedInUser = accounts.getCurrentUser(request);
    const trainers = trainerStore.getAllTrainers();
    const memberAssessBooking = userStore.bookings;
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
    };
    for (let i = 0; i < trainerBookings.length; i++) {
      if (memberBooking.date === trainerBookings[i].date) {
        if (memberBooking.time == trainerBookings[i].time) {
          conflict = true;
        }
      }
    }
    if (!conflict) {
      userStore.newBooking(user.id, memberBooking);
      response.redirect('/bookings/memberBookings');
    }
    else {
      viewData.conflict = conflict;
      response.render('memberBookings', viewData);
    }
  }
};

module.exports = bookings;
