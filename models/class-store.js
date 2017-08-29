'use strict'

const _ = require('lodash');
const JsonStore = require('./json-store');

const classStore = {

  store: new JsonStore('./models/class-store.json', { classes: [] }),
  collection: 'classes',

  getAllClasses() {
    return this.store.findAll(this.collection);
  },

  addClass(newClass) {
    this.store.add(this.collection, newClass);
    this.store.save();
  },

  getClassById(classId) {
    return this.store.findOneBy(this.collection, { classId: classId });
  },

  deleteClass(classId) {
    const thisClass = this.getClassById(classId);
    this.store.remove(this.collection, thisClass);
    this.store.save();
  },
};

module.exports = classStore;
