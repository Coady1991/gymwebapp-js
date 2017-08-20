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
    return this.store.findOneBy(this.collection, { classid: classId });
  },

  deleteClass(id) {
    const classes = this.getClassById(id);
    this.store.remove(this.collection, classes);
    this.store.save();
  },
};

module.exports = classStore;
