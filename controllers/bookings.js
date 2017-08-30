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
    };
    logger.info('about to render memberBookingView');
    response.render('memberBookings', viewData);
  },
};

module.exports = bookings;
