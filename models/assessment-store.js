'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const assessmentStore = {

  store: new JsonStore('./models/assessment-store.json', { assessmentsList: [] }),
  collection: 'assessmentsList',

  getAllAssessments() {
    return this.store.findAll(this.collection);
  },

  getAssessmentList(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getUserAssessments(userid) {
    return this.store.findBy(this.collection, { userid: userid });
  },

  addAssessmentList(assessment) {
    this.store.add(this.collection, assessment);
    this.store.save();
  },

  /*addAssessment(id, assessment) {
    const assessmentNew = this.getAssessmentList(id);
    assessmentNew.assessments.push(assessment);
    this.store.save();
  },*/

  deleteAssessment(id) {
    const assessment = this.getAssessmentList(id);
    this.store.remove(this.collection, assessment);
    this.store.save();
  },

  /*removeAssessment(id, assessmentId) {
    const user = this.getUserById(id);
    _.remove(user.assessments, { id: assessmentId });
    this.store.save();
  },*/
};

module.exports = assessmentStore;