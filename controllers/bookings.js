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
    const user = userStore.getUserById(userId);
    const date = new Date(request.body.date);
    const memberBookings = user.bookings;
    let conflict = false;
    const trainerBooking = {
      bookingId: uuid(),
      date: date.toDateString(),
      time: request.body.time,
      userId: user.id,
      trainerId: trainer.id,
      firstName: trainer.firstName,
      lastName: trainer.lastName,
      mfirstName: user.firstName,
      mlastName: user.lastName,
    };
    for (let i = 0; i < memberBookings.length; i++) {
      if (trainerBooking.date === memberBookings[i].date) {
        if (trainerBooking.time === memberBookings[i].time) {
          conflict = true;
        }
      }
    }

    if (!conflict) {
      trainerStore.newBooking(trainer.id, trainerBooking);
      userStore.newBooking(user.id, trainerBooking);
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
      date: date.toDateString(),
      time: request.body.time,
      userId: user.id,
      trainerId: trainer.id,
      firstName: trainer.firstName,
      lastName: trainer.lastName,
      mfirstName: user.firstName,
      mlastName: user.lastName,
    };
    for (let i = 0; i < trainerBookings.length; i++) {
      if (memberBooking.date === trainerBookings[i].date) {
        if (memberBooking.time === trainerBookings[i].time) {
          conflict = true;
        }
      }
    }

    if (!conflict) {
      userStore.newBooking(user.id, memberBooking);
      trainerStore.newBooking(trainer.id, memberBooking);
      response.redirect('/bookings/memberBookings');
    } else {
      viewData.conflict = conflict;
      response.render('memberBookings', viewData);
    }
  },

  trainerUpdateBooking(request, response) {
    const trainer = accounts.getCurrentTrainer(request);
    const booking = request.params.bookingId;
    const bookingToUpdate = trainerStore.getBookingById(trainer.id, booking);
    //const users = userStore.getAllUsers();
    const viewData = {
      bookingToUpdate: bookingToUpdate,
      userId: request.params.userId,
    };
    logger.debug('about to render updateBooking');
    response.render('trainerBookingUpdate', viewData);
  },

  trainerEditBooking(request, response) {
    const trainer = accounts.getCurrentTrainer(request);
    const bookingId = request.params.bookingId;
    const user = userStore.getUserById(request.params.userId);
    const date = new Date(request.body.date);
    const trainerBooking = trainerStore.getBookingById(trainer.id, bookingId);
    const memberBooking = userStore.getBookingById(user, bookingId);
    let conflict = false;
    trainerBooking.date = date.toDateString();
    trainerBooking.time = request.body.time;
    memberBooking.date = date.toDateString();
    memberBooking.time = request.body.time;
    trainerStore.store.save();
    userStore.store.save();
    response.redirect('/bookings');
  },

  memberUpdateBooking(request, response) {
    const user = accounts.getCurrentUser(request);
    const booking = request.params.bookingId;
    const bookingToUpdate = userStore.getBookingByIdHelper(user.id, booking);
    const viewData = {
      bookingToUpdate: bookingToUpdate,
      trainerId: request.params.trainerId,
    };
    logger.debug('about to render updateBooking');
    response.render('memberBookingUpdate', viewData);
  },

  memberEditBooking(request, response) {
    const user = accounts.getCurrentUser(request);
    const bookingId = request.params.bookingId;
    const trainer = trainerStore.getTrainerById(request.params.trainerId);
    const date = new Date(request.body.date);
    const memberBooking = userStore.getBookingByIdHelper(user.id, bookingId);
    const trainerBooking = trainerStore.getBookingByIdHelper(trainer, bookingId);
    let conflict = false;
    memberBooking.date = date.toDateString();
    memberBooking.time = request.body.time;
    trainerBooking.date = date.toDateString();
    trainerBooking.time = request.body.time;
    userStore.store.save();
    trainerStore.store.save();
    response.redirect('/bookings/memberBookings');
  },
};

module.exports = bookings;
