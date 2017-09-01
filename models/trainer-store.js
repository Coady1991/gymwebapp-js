'use strict';
const logger = require('../utils/logger');
const _ = require('lodash');
const JsonStore = require('./json-store');

const trainerStore = {

  store: new JsonStore('./models/trainer-store.json', { trainers: [] }),
  collection: 'trainers',

  getAllTrainers() {
    return this.store.findAll(this.collection);
  },

  addTrainer(trainer) {
    this.store.add(this.collection, trainer);
    this.store.save();
  },

  getTrainerById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getTrainerByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  newBooking(trainerId, booking) {
    const trainer = this.getTrainerById(trainerId);
    trainer.bookings.push(booking);
    this.store.save();
  },

  getBookingById(trainerId, bookingId) {
    const trainer = this.getTrainerById(trainerId);
    for (let i = 0; i < trainer.bookings.length; i++) {
      if (trainer.bookings[i].bookingId === bookingId) {
        return trainer.bookings[i];
      }
    }
  },

  getBookingByIdHelper(trainer, bookingId) {
    for (let i = 0; i < trainer.bookings.length; i++) {
      if (trainer.bookings[i].bookingId === bookingId) {
        return trainer.bookings[i];
      }
    }
  },

  deleteBooking(trainerId, bookingId) {
    const trainer = this.getTrainerById(trainerId);
    _.remove(trainer.bookings, { bookingId: bookingId });
    this.store.save();
  },
};

module.exports = trainerStore;
