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

  addAssessment(userId, assessment) {
    const user = this.getUserById(userId);
    user.assessments.unshift(assessment);
    this.store.save();
  },

  deleteAssessment(userId, assessmentId) {
    const user = this.getUserById(userId);
    console.log(user);
    _.remove(user.assessments, { id: assessmentId });
    this.store.save();
  },
};

module.exports = userStore;
