'use strict';
/**
 * 
 * @module app.views.admin.adminMessageColumns
 */

var Assembl = require('../../app.js'),
    Ctx = require('../../common/context.js'),
    i18n = require('../../utils/i18n.js'),
    EditableField = require('../reusableDataFields/editableField.js'),
    CKEditorField = require('../reusableDataFields/ckeditorField.js'),
    Permissions = require('../../utils/permissions.js'),
    PanelSpecTypes = require('../../utils/panelSpecTypes.js'),
    MessagesInProgress = require('../../objects/messagesInProgress.js'),
    SegmentList = require('../segmentList.js'),
    IdeaMessageColumn = require('../../models/ideaMessageColumn.js'),
    LangString = require('../../models/langstring.js'),
    AgentViews = require('../agent.js'),
    WidgetLinks = require('../widgetLinks.js'),
    WidgetButtons = require('../widgetButtons.js'),
    CollectionManager = require('../../common/collectionManager.js'),
    AssemblPanel = require('../assemblPanel.js'),
    Marionette = require('../../shims/marionette.js'),
    AttachmentViews = require('../attachments.js'),
    ConfirmModal = require('../confirmModal.js'),
    AttachmentModels = require('../../models/attachments.js'),
    Growl = require('../../utils/growl.js'),
    $ = require('jquery'),
    _ = require('underscore'),
    Promise = require('bluebird');


var AdminMessageColumnsPanel = Marionette.LayoutView.extend({
  constructor: function AdminMessageColumnsPanel() {
    Marionette.LayoutView.apply(this, arguments);
  },
  template: '#tmpl-adminMessageColumns',

  ui: {
    activateColumns: '.js_activate_columns',
    addColumn: '.js_add_column',
    save: '.js_save',
    messageColumnsList: '.js_messageColumnsList',
  },

  regions: {
    messageColumnsList: '@ui.messageColumnsList',
  },

  events: {
    'click @ui.activateColumns': 'updateActivateColumns',
    'click @ui.addColumn': 'addColumn',
  },

  initialize: function(options) {
    var that = this,
        currentIdea = options.model,
        collectionManager = new CollectionManager(),
        columns = currentIdea.get('message_columns');
    if(this.isViewDestroyed()) {
      return;
    }
    this.model = currentIdea;
    if (columns === undefined || columns.length === 0) {
      this.createColumnsFromDefaults(currentIdea);
    }
  },

  createColumnsFromDefaults: function(currentIdea) {
    var columnCollection = new IdeaMessageColumn.Collection(undefined, {targetIdea: currentIdea}),
        prevColumn = null,
        i = 0,
        preferences = Ctx.getPreferences(),
        column_identifiers = preferences.default_column_identifiers,
        column_names = preferences.default_column_names;

    for (var i in column_identifiers) {
      var column, identifier = column_identifiers[i],
          name = new LangString.Model();
      name.initFromDict(column_names[identifier]);
      column = new IdeaMessageColumn.Model({
        idea: currentIdea.id,
        message_classifier: identifier,
        name: name,
      });
      columnCollection.add(column);
      prevColumn = column;
    }
    currentIdea.set('message_columns', columnCollection);
    // linearize saves
    function saveNext() {
      if (i < columnCollection.models.length) {
        var column = columnCollection.models[i];
        if (i > 0) {
          var prevColumn = columnCollection.models[i-1];
          column.set('previous_column', prevColumn.id);
        }
        i += 1;
        column.save(null, { success: saveNext, })
      } else {
        columnCollection.sort();
        Growl.showBottomGrowl(Growl.GrowlReason.SUCCESS,
              i18n.gettext("Columns saved"));
      }
    }
    i = 0;
    saveNext();
  },

  addColumn: function(ev) {
    var idea = this.model,
        columnCollection = idea.get('message_columns'),
        lastColumnId,
        column,
        name = new LangString.Model(),
        names = {},
        preferences = Ctx.getPreferences();
    if (columnCollection.length > 0) {
      lastColumnId = columnCollection.models[columnCollection.length-1].id;
    }
    _.map(preferences.preferred_locales, function(loc) {
      names[loc] = '';
    });
    name.initFromDict(names);
    column = new IdeaMessageColumn.Model({
      idea: idea.id,
      message_classifier: "",
      name: name,
      previous_column: lastColumnId,
    });
    columnCollection.add(column);
    column.save();
    ev.preventDefault();
  },

  serializeData: function() {
    return {
      active: this.model.get('message_view_override') != null,
    };
  },

  updateActivateColumns: function(ev) {
    var elm = $(e.target),
        active = elm.is(':checked'),
        idea = this.model;
    if (active) {
      idea.set('message_view_override', 'messageColumns');
      idea.set('messages_in_parent', false);
    } else {
      idea.set('message_view_override', null);
      idea.set('messages_in_parent', true);
    }
    idea.save();
  },

  onRender: function() {
    if (this.isViewDestroyed()) {
      return;
    }
    var idea = this.model,
        columns = idea.get('message_columns');
    this.showChildView(
      "messageColumnsList",
      new MessageColumnList({
        basePanel: this,
        idea: this.model,
        collection: columns,
      }));
  },
});


var MessageColumnView = Marionette.LayoutView.extend({
  constructor: function MessageColumnView() {
    Marionette.LayoutView.apply(this, arguments);
  },
  template: '#tmpl-adminMessageColumn',
  ui: {
    columnId: '.js_column_id',
    columnName: '.js_column_name',
    columnUp: '.js_column_up',
    columnDown: '.js_column_down',
    columnDelete: '.js_column_delete',
  },
  regions: {
    columnName: '@ui.columnName',
  },
  events: {
    'click @ui.columnUp': 'reorderColumnUp',
    'click @ui.columnDown': 'reorderColumnDown',
    'click @ui.columnDelete': 'deleteColumn',
  },
  getIndex: function() {
    return _.indexOf(this.model.collection.models, this.model);
  },
  serializeData: function() {
    return {
      column: this.model,
      index: this.getIndex(),
      collsize: this.model.collection.length,
    };
  },
  onRender: function() {
    /*
    this.showChildView(
      "columnName",
      new LangStringEditView({
        model: this.model.name,
      }));
    */
  },
  reorderColumnUp: function(ev) {
    var index = this.getIndex(),
        previousModel = this.model.collection.at(index-1);
    this.model.set('previous_column', previousModel.get('previous_column'));
    previousModel.set('previous_column', this.model.id);
    this.model.collection.sort();
    this.model.save(null, {success: function() {
      previousModel.save();
    }});

    ev.preventDefault();
  },
  reorderColumnDown: function(ev) {
    var index = this.getIndex(),
        nextModel = this.model.collection.at(index+1);
    nextModel.set('previous_column', this.model.get('previous_column'));
    this.model.set('previous_column', nextModel.id);
    this.model.collection.sort();
    this.model.save();
    nextModel.save();
    ev.preventDefault();
  },
  deleteColumn: function(ev) {
    var index = this.getIndex();
    if (index < this.model.collection.length - 2) {
      var nextModel = this.model.collection.at(index+1);
      nextModel.set('previous_column', this.model.get('previous_column'));
      nextModel.save();
    }
    this.model.destroy();
    ev.preventDefault();
  },

});


/**
 * The collections of columns to be seen on this idea
 * @class app.views.messageColumnsPanel.MessageColumnList
 */
var MessageColumnList = Marionette.CollectionView.extend({
  constructor: function MessageColumnList() {
    Marionette.CollectionView.apply(this, arguments);
  },
  initialize: function(options) {
    this.options = options;
  },
  childView: MessageColumnView,
});


/*
  The results modal view
  It is barely a simple container for the real view: TokenResultView
 */
var AdminMessageColumnsModal = Backbone.Modal.extend({
  constructor: function AdminMessageColumnsModal() {
    Backbone.Modal.apply(this, arguments);
  },

  template: '#tmpl-modalWithoutIframe',
  className: 'modal-define-columns popin-wrapper',
  cancelEl: '.close, .js_close',

  ui: {
    body: '.js_modal-body',
  },

  onRender: function() {
    var resultView = new AdminMessageColumnsPanel({
      model: this.model,
    });
    this.$(this.ui.body).html(resultView.render().el);
  },

  serializeData: function() {
    return {
      modal_title: i18n.gettext('Define columns'),
    };
  },

});

module.exports = AdminMessageColumnsModal;
