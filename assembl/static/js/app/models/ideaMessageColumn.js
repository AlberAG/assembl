'use strict';
/**
 * Description of the columns of classified messages under an idea
 * @module app.models.ideaMessageColumn
 */
var _ = require('underscore'),
    Base = require('./base.js'),
    LangString = require('./langstring.js'),
    Ctx = require('../common/context.js');

/**
 * A category of classified messages under an idea
 * Frontend model for :py:class:`assembl.models.idea_msg_column.IdeaMessageColumn`
 * @class app.models.ideaMessageColumn.IdeaMessageColumnModel
 * @extends app.models.base.BaseModel
 */
var IdeaMessageColumnModel = Base.Model.extend({
  /**
   * @function app.models.ideaMessageColumn.IdeaMessageColumnModel.initialize
   */
  initialize: function(obj) {
    obj = obj || {};
    var that = this;
  },
  /**
   * Defaults
   * @type {Object}
   */
  defaults: {
    'idea': null,
    'message_classifier': '',
    'title': null,
    'name': null,
    'header': null,
    'synthesis_title': null,
    'color': null,
    'previous_column': null,
  },
  parse: function(rawModel) {
    if (rawModel.title !== undefined) {
      rawModel.title = new LangString.Model(rawModel.title, {parse: true});
    }
    if (rawModel.name !== undefined) {
      rawModel.name = new LangString.Model(rawModel.name, {parse: true});
    }
    if (rawModel.header !== undefined) {
      rawModel.header = new LangString.Model(rawModel.header, {parse: true});
    }
    if (rawModel.synthesis_title !== undefined) {
      rawModel.synthesis_title = new LangString.Model(rawModel.synthesis_title, {parse: true});
    }
    return rawModel;
  },
});
/**
 * The collection of categories of classified messages under an idea
 * @class app.models.ideaMessageColumn.IdeaLinkCollection
 * @extends app.models.base.BaseCollection
 */
var IdeaMessageColumnCollection = Base.Collection.extend({
  /**
   * The model
   * @type {IdeaMessageColumnModel}
   */
  model: IdeaMessageColumnModel,
  /**
   * @member {string} app.models.ideaMessageColumn.IdeaMessageColumnCollection.url
   */
  url: function() {
    return this.targetIdea.getApiV2Url() + '/message_columns';
  },

  initialize: function(models, options) {
    if (!options.targetIdea) {
      throw new Error("targetIdea must be provided to calculate url");
    }
    this.targetIdea = options.targetIdea;
  },

  comparator: function(e1, e2) {
    // Sorting a chained list.
    // in theory, this can fail if links of the chain are missing.
    // in practice, the collections are tiny, and this should not be an issue.
    // To be sure, re-sort once the collection is complete.
    var e1p = e1.get("previous_column"),
        e2p = e2.get("previous_column");
    if (e1.id == e2p) {
      return -1;
    } else if (e2.id == e1p) {
      return 1;
    } else if (e1p === null) {
      return -1;
    } else if (e2p === null) {
      return 1;
    } else {
      e1 = this.get(e1p);
      if (e1 !== undefined) {
        return this.comparator(e1, e2);
      }
      e2 = this.get(e2p);
      if (e2 !== undefined) {
        return this.comparator(e1, e2);
      }
      return undefined;
    }
  },

});

module.exports = {
  Model: IdeaMessageColumnModel,
  Collection: IdeaMessageColumnCollection,
};

