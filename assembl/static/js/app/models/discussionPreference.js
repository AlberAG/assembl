"use strict";

var Backbone = require("../shims/backbone.js"),
    Ctx = require("../common/context.js");

// We do not use Base.Model.extend(), because we want to keep Backbone's default behaviour with model urls
// Generic case: preference value can be any json, not necessarily a dict.
// So put it in "value" attribute of this model.
var DiscussionIndividualPreferenceModel = Backbone.Model.extend({
  constructor: function DiscussionIndividualPreferenceModel() {
    Backbone.Model.apply(this, arguments);
  },
  parse: function(resp, options) {
    if (resp.value !== undefined && resp.id !== undefined)
      return resp;
    return {value: resp};
  },
  toJSON: function(options) {
    return _.clone(this.get("value"));
  },
});


// Subcase: pref is a dictionary, so we can use normal backbone
var DiscussionPreferenceDictionaryModel = Backbone.Model.extend({
  constructor: function DiscussionPreferenceDictionaryModel() {
    Backbone.Model.apply(this, arguments);
  },
  url: Ctx.getApiV2DiscussionUrl("settings"),
});


var DiscussionPreferenceCollection = Backbone.Collection.extend({
  constructor: function DiscussionPreferenceCollection() {
    Backbone.Collection.apply(this, arguments);
  },
  url: Ctx.getApiV2DiscussionUrl("settings"),
  model: DiscussionIndividualPreferenceModel,
  parse: function(resp, options) {
    // does this go through model.parse afterwards? That would be trouble.
    return _.values(_.mapObject(resp, function(v, k) {
      return {id: k, value: v};
    }));
  },
  toJSON: function(options) {
    var prefs = {};
    this.models.map(function(m) {
      prefs[m.id] = m.toJson(options);
    });
    return prefs;
  },
});


// TODO: Subset of editable? Assume viewable already filtered by backend.

var UserPreferenceRawCollection = DiscussionPreferenceCollection.extend({
  constructor: function UserPreferenceRawCollection() {
    DiscussionPreferenceCollection.apply(this, arguments);
  },
  urlRoot: Ctx.getApiV2DiscussionUrl("all_users/current/preferences"),
});


module.exports = {
  DictModel: DiscussionPreferenceDictionaryModel,
  DiscussionPreferenceCollection: DiscussionPreferenceCollection,
  UserPreferenceCollection: UserPreferenceRawCollection,
  Model: DiscussionIndividualPreferenceModel
};
