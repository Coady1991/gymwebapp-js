'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const userStore = {

  store: new JsonStore('./models/user-store.json', { users: [] }),
  collection: 'users',

  getAllUsers() {
    return this.store.findAll(this.collection);
  },

  addUser(user) {
    this.store.add(this.collection, user);
    this.store.save();
  },

  getUserById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getUserByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  getUserAssessments(userId) {
    return this.store.findBy(this.collection, { userId: userId });
  },

  getAssessment(userId, assessmentId) {
    const user = this.getUserById(userId);
    for (let i = 0; i < user.assessments.length; i++) {
      if (user.assessments[i].assessmentid === assessmentId) {
        return user.assessments[i];
      }
    }
  },

  deleteUser(id) {
    const user = this.getUserById(id);
    this.store.remove(this.collection, user);
    this.store.save();
  },

  addAssessment(userId, assessment) {
    const user = this.getUserById(userId);
    user.assessments.unshift(assessment);
    this.store.save();
  },

  deleteAssessment(userId, assessmentId) {
    const user = this.getUserById(userId);
    console.log(user);
    _.remove(user.assessments, { assessmentid: assessmentId });
    this.store.save();
  },

  newBooking(userId, booking) {
    const user = this.getUserById(userId);
    user.bookings.push(booking);
    this.store.save();
  },

  getBookingById(user, bookingId) {
    //const user = this.getUserById(userId);
    for (let i = 0; i < user.bookings.length; i++) {
      if (user.bookings[i].bookingId === bookingId) {
        return user.bookings[i];
      }
    }
  },

  getBookingByIdHelper(userId, bookingId) {
    const user = this.getUserById(userId);
    for (let i = 0; i < user.bookings.length; i++) {
      if (user.bookings[i].bookingId === bookingId) {
        return user.bookings[i];
      }
    }
  },

  deleteBooking(userId, bookingId) {
    const user = this.getUserById(userId);
    _.remove(user.bookings, { bookingId: bookingId });
    this.store.save();
  },
};

module.exports = userStore;
