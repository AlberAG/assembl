'use strict';
/**
 * 
 * @module app.views.messageList
 */

var Backbone = require('backbone'),
    Marionette = require("../shims/marionette.js"),
    Raven = require('raven-js'),
    ObjectTreeRenderVisitor = require('./visitors/objectTreeRenderVisitor.js'),
    objectTreeRenderVisitorReSort = require('./visitors/objectTreeRenderVisitorReSort.js'),
    MessageFamilyView = require('./messageFamily.js'),
    MessageListHeaderView = require('./messageListHeader.js'),
    _ = require('underscore'),
    $ = require('jquery'),
    Assembl = require('../app.js'),
    Ctx = require('../common/context.js'),
    Message = require('../models/message.js'),
    i18n = require('../utils/i18n.js'),
    PostQuery = require('./messageListPostQuery.js'),
    Permissions = require('../utils/permissions.js'),
    Announcements = require('./announcements.js'),
    MessageSendView = require('./messageSend.js'),
    MessagesInProgress = require('../objects/messagesInProgress.js'),
    PanelSpecTypes = require('../utils/panelSpecTypes.js'),
    scrollUtils = require('../utils/scrollUtils.js'),
    AssemblPanel = require('./assemblPanel.js'),
    CKEditorField = require('./reusableDataFields/ckeditorField.js'),
    BaseMessageListMixin = require('./baseMessageList.js'),
    CollectionManager = require('../common/collectionManager.js'),
    Widget = require('../models/widget.js'),
    Promise = require('bluebird');


/**
 * @class app.views.messageColumnsPanel.MessageColumnsPanel
 */
var MessageColumnsPanel = AssemblPanel.extend({
  constructor: function MessageColumnsPanel() {
    AssemblPanel.apply(this, arguments);
  },

  template: '#tmpl-messageColumns',
  panelType: PanelSpecTypes.MESSAGE_COLUMNS,
  className: 'panel messageColumns',
  lockable: true,
  gridSize: AssemblPanel.prototype.MESSAGE_PANEL_GRID_SIZE,
  minWidth: 450,
  debugPaging: false,
  debugScrollLogging: false,
  columnsView: undefined,
  _renderId: 0,
  ui: {
    ideaColumnHeader: ".js_ideaColumnHeader",
    ideaAnnouncement: ".js_ideaAnnouncement",
    messageColumnsList: ".js_messageColumnsList"
  },

  regions: {
    messageColumnsList: '@ui.messageColumnsList',
    ideaAnnouncement: '@ui.ideaAnnouncement'
  },

  initialize: function(options) {
    AssemblPanel.prototype.initialize.apply(this, arguments);
    var that = this,
        current_idea = this.getGroupState().get('currentIdea'),
        collectionManager = new CollectionManager();
    if(this.isViewDestroyed()) {
      return;
    }
    collectionManager.getUserLanguagePreferencesPromise(Ctx).then(function(ulp) {
      that.translationData = ulp.getTranslationData();
    });
    this.setCurrentIdea(current_idea);
    this.listenTo(this.getGroupState(), "change:currentIdea", function(groupState) {
      that.setCurrentIdea(groupState.get('currentIdea'));
      that.attachmentCollection = that.currentIdea.get('attachments');
      that.render();
    });
    this.listenTo(Assembl.vent, 'messageList:showMessageById', function(id, callback) {
      that.showMessageById(id, callback);
    });

    this.attachmentCollection = current_idea.get('attachments');
    // this.listenTo(this.attachmentCollection, 'add remove change', function(){
    //   console.log("Listening to attachment collection");
    //   that.render();
    // });

  },
  setCurrentIdea: function(idea) {
    if (this.isViewDestroyed()) {
      return;
    }
    if (idea == null) {
      idea = this.currentIdea || this.getGroupState().get("currentIdea");
    }
    if (this.currentIdea === idea) {
      return;
    }
    if (idea != null) {
      this.announcementPromise = idea.getApplicableAnnouncementPromise();
    }
    this.currentIdea = idea;
  },

  onRender: function() {
    if (this.isViewDestroyed()) {
      return;
    }
    var that = this,
        idea = this.currentIdea;
    if (idea == undefined) {
      // after message send, somehow...
      idea = this.getGroupState().get("currentIdea");
      this.setCurrentIdea(idea);
    }
    if (idea == undefined) {
      console.warn("WHY is the idea undefined?");
      return;
    }
    var columns = idea.get("message_columns");
    if (columns === undefined || columns.length === 0) {
      console.log("TODO: this view should not be alive.");
      return;
    }
    // first approximation
    // this.ui.ideaColumnHeader.html(idea.get("shortTitle"));
    this.announcementPromise.then(function(announcement) {
      if (that.isViewDestroyed() || announcement === undefined) {
        return;
      }
      var announcementMessageView = new Announcements.AnnouncementMessageView({model: announcement});
      that.showChildView('ideaAnnouncement', announcementMessageView);
      that.ui.ideaAnnouncement.removeClass('hidden');
      var attachmentModel = that.attachmentCollection.getSingleAttachment();
      if (attachmentModel){
        var announcementImgBackgroundLink = attachmentModel.get('external_url');
        $('.js_ideaAnnouncement').addClass('background-annoucement');
        that.ui.ideaAnnouncement.css({'background-image':'url('+announcementImgBackgroundLink+')'});
      }
    });
    
    // TODO: What if translation data is not ready by now?
    this.showChildView(
      "messageColumnsList",
      new MessageColumnList({
        basePanel: this,
        idea: this.currentIdea,
        translationData: this.translationData,
        collection: columns,
      }));
  },
  getTitle: function() {
    return i18n.gettext('Messages');
  },
});

/**
 * @class app.views.messageColumnsPanel.BaseMessageColumnView
 * @extends Marionette.LayoutView
 * @extends app.views.baseMessageList.BaseMessageListMixin
 */
var BaseMessageColumnView = BaseMessageListMixin(Marionette.LayoutView);


/**
 * A single column of messages
 * @class app.views.messageColumnsPanel.MessageColumnView
 * @extends app.views.messageColumnsPanel.BaseMessageColumnView
 */
var MessageColumnView = BaseMessageColumnView.extend({
  constructor: function MessageColumnView() {
    BaseMessageColumnView.apply(this, arguments);
  },
  message_template: '#tmpl-messageColumn',

  isCurrentViewStyleThreadedType: function() {
    return false;
  },
  getTargetMessageViewStyleFromMessageListConfig: function() {
    return Ctx.AVAILABLE_MESSAGE_VIEW_STYLES.FULL_BODY;
  },
  ui: {
    panelBody: ".subpanel-body",
    messageColumnHeader: '.js_messageColumnHeader',
    messageColumnDescription: '.js_messageColumnDescription',
    topPostRegion: '.js_topPostRegion',
    messageFamilyList: '.js_messageFamilies_region',
    pendingMessage: '.pendingMessage',
    messageList: '.messageList-list',
    topArea: '.js_messageList-toparea',
    bottomArea: '.js_messageList-bottomarea',
    contentPending: '.real-time-updates',
    messageCount: '.js_messageCount',
  },
  regions: {
    messageFamilyList: '@ui.messageFamilyList',
    topPostRegion: '@ui.topPostRegion',
    messageColumnDescription: '@ui.messageColumnDescription',
  },
  initialize: function(options) {
    BaseMessageColumnView.prototype.initialize.apply(this, arguments);
    var that = this,
    collectionManager = new CollectionManager();
    this.idea = options.idea;
    this.showMessageByIdInProgress = false;
    this.basePanel = options.basePanel;
    this.setCurrentIdea(this.idea);
    this.translationData = options.translationData;
    this.messagesIdsPromise = this.currentQuery.getResultMessageIdCollectionPromise();
    this.setViewStyle(this.ViewStyles.REVERSE_CHRONOLOGICAL);

    this.messagesIdsPromise.then(function() {
      if (that.isViewDestroyed()) {
        return;
      }
      that.template = that.message_template;
      that.render();
    });
  },

  setCurrentIdea: function(idea) {
    this.currentQuery.initialize();
    this.currentQuery.addFilter(this.currentQuery.availableFilters.POST_IS_IN_CONTEXT_OF_IDEA, this.idea.getId());
    this.currentQuery.addFilter(this.currentQuery.availableFilters.POST_CLASSIFIED_UNDER, this.model.get("message_classifier"));
    this.setViewStyle(this.ViewStyles.REVERSE_CHRONOLOGICAL);
  },

  getGroupState: function() {
    return this.basePanel.getGroupState();
  },

  getContainingGroup: function() {
    return this.basePanel.getContainingGroup();
  },

  unblockPanel: function() {
    this.basePanel.unblockPanel();
  },

  /**
   * Synchronizes the panel with the currently selected idea (possibly none)
   */
  syncWithCurrentIdea: function() {
    this.render();
  },

  serializeData: function() {
    var data = BaseMessageColumnView.prototype.serializeData.apply(this, arguments);
    _.extend(data, {
      column: this.model,
      numColumns: this.model.collection.length,
      canPost: Ctx.getCurrentUser().can(Permissions.ADD_POST),
      color: this.model.get('color') || 'black',
    });
    return data;
  },

  processIsEnded: function() {
    // heuristic: process is ended if header has content.
    var header = this.model.get('header');
    return header != undefined && header.length > 0;
  },

  onRender: function() {
    if (this.isViewDestroyed()) {
      return;
    }
    BaseMessageColumnView.prototype.onRender.apply(this, arguments);
    var that = this,
        canEdit = Ctx.getCurrentUser().can(Permissions.ADMIN_DISCUSSION),
        renderId = _.clone(this._renderId);

    if (this.processIsEnded() || canEdit) {
      this.messageColumnDescription.show(new CKEditorField({
        model: this.model,
        modelProp: 'header',
        canEdit: canEdit,
      }));
    }
    this.messagesIdsPromise.then(function(resultMessageIdCollection) {
      if (that.isViewDestroyed()) {
        return;
      }

      if (renderId != that._renderId) {
        console.log("messageList:onRender() structure collection arrived too late, this is render %d, and render %d is already in progress.  Aborting.", renderId, that._renderId);
        return;
      }

      that.destroyAnnotator();

      that.ui.messageCount.html(i18n.sprintf(
        i18n.gettext("%d messages “%s”"),
        resultMessageIdCollection.length,
        that.model.get('name').bestValue(that.translationData)));

      //Some messages may be present from before
      that.ui.messageFamilyList.empty();
      that.clearRenderedMessages();

      that.render_real();
      that.ui.panelBody.scroll(function() {
        var msgBox = that.$('.messagelist-replybox').height(),
        scrollH = $(this)[0].scrollHeight - (msgBox + 25),
        panelScrollTop = $(this).scrollTop() + $(this).innerHeight();

        //This event cannot be bound in ui, because backbone binds to
        //the top element and scroll does not propagate
        that.$(".panel-body").scroll(that, that.scrollLogger);
      });
    });
  },

  showTopPostBox: function(options) {
    if (this.processIsEnded()) {
      return;
    }
    _.extend(options, {
      allow_setting_subject: false,
      message_classifier: this.model.get('message_classifier'),
      reply_idea: this.idea,
      show_target_context_with_choice: false,
      message_send_title: i18n.sprintf("Send a new %s proposal", this.model.get('name').bestValue(this.translationData)),
    });
    // Todo: use those options in messageSendView. Maybe use a more lightweight view also?
    this.newTopicView = new MessageSendView(options);
    this.topPostRegion.show(this.newTopicView);
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
    // propagate options to MessageColumnViews
    this.childViewOptions = options;
  },
  childView: MessageColumnView,
});


module.exports = MessageColumnsPanel;
