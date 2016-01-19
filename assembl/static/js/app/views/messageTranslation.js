var Marionette = require('../shims/marionette.js'),
    Backbone = require('../shims/backbone.js'),
    Ctx = require('../common/context.js'),
    CollectionManager = require('../common/collectionManager.js'),
    i18n = require('../utils/i18n.js'),
    _ = require('../shims/underscore.js'),
    $ = require('../shims/jquery.js'),
    Types = require('../utils/types.js'),
    LanguagePreference = require('../models/languagePreference.js');

/**
 * Date: Jan 14, 2016
 * Assumption: Currently, we are NOT showing the translation view if the SUBJECT of a message and only
 * the subject of the message is translated. Rather 'gung ho', but this is the reality. 
 */

var userTranslationStates = {
    CONFIRM: 'confirm',
    DENY: 'deny'
}

var TranslationView = Marionette.ItemView.extend({
    template: '#tmpl-loader',

    ui: {
        showOriginal: '.js_translation_show_original', //Show original region
        setLangPref: '.js_translation_question', //Question region
        showOriginalString: '.js_trans_show_origin',
        showTranslatedString: '.js_trans_show_translated',
        langChoiceConfirm: '.js_language_of_choice_confirm',
        langChoiceCancel: '.js_language_of_choice_deny',
        confirmLangPref: '.js_translate_all_confirm_msg',
        langTo: '.js_translate_to_language',
        gotoSettings: '.js_load_profile_settings',
    },

    events: {
        'click @ui.showOriginalString': 'showOriginal',
        'click @ui.showTranslatedString': 'showTranslated',
        'click @ui.langChoiceConfirm': 'updateLanguagePreferenceConfirm',
        'click @ui.langChoiceCancel': 'updateLanguagePreferenceDeny',
        'click @ui.gotoSettings': 'loadProfile'
    },

    initialize: function(options){
        this.message = options.messageModel;
        this.messageView = options.messageView;
        var that = this;
        var cm = new CollectionManager();
        cm.getUserLanguagePreferencesPromise()
            .then(function(preferences){
                var localeToLangNameCache = Ctx.getJsonFromScriptTag('translation-locale-names'),
                    bestSuggestedTranslation = that.message.get('body').best(preferences);

                var translatedFromLocale = bestSuggestedTranslation.getTranslatedFromLocale(),
                    translatedFromLocaleName = localeToLangNameCache[translatedFromLocale],
                    translatedTo = bestSuggestedTranslation.getBaseLocale(),
                    translatedToName = localeToLangNameCache[translatedTo];
                if ( !(translatedToName) ){
                    console.error("The language " + translatedToName + " is not a part of the locale cache!");
                    translatedToName = translatedTo;
                }
                if ( !(translatedFromLocaleName) ){
                    console.error("The language " + translatedFromLocale + " is not a part of the locale cache!");
                    translatedFromLocaleName = translatedFromLocale;
                }
                that.translatedTo = {locale: translatedTo, name: translatedToName};
                that.translatedFrom = {locale: translatedFromLocale, name: translatedFromLocaleName};
                that.langCache = localeToLangNameCache;
                that.languagePreferences = preferences; //Should be sorted already
                that.template = '#tmpl-message_translation';
                that.render();
            });
    },

    _localesAsSortedList: null,
    localesAsSortedList: function() {
        if (this._localesAsSortedList === null) {
            var localeToLangName = Ctx.getJsonFromScriptTag('translation-locale-names'),
                localeList = _.map(localeToLangName, function(name, loc) {
                    return [loc, name];
                });
            localeList = _.sortBy(localeList, function(x) {return x[1];});
            Object.getPrototypeOf(this)._localesAsSortedList = localeList;
        }
        return this._localesAsSortedList;
    },

    showOriginal: function(e){
        console.log('Showing the original');
        this.messageView.useOriginalContent = true;
        this.messageView.render();
    },

    showTranslated: function(e){
        this.messageView.useOriginalContent = false;
        this.messageView.render();
    },

    updateLanguagePreference: function(state){
        var that = this,
            langPrefLocale = $(this.ui.langTo).val(),

            createModel = function(locale, translateTo, preferenceColllection){

                commitChanges = {
                    success: function(model, resp, options) {
                        //Ensure that this is in the right order
                        that.languagePreferences.add(model, {merge: true});
                        //this.triggerMethod("translation:defined", 'full_message_list');
                        var cm = that.languagePreferences.collectionManager.getAllMessageStructureCollectionPromise()
                            .then(function(messageStructures){
                                return Promise.resolve(messageStructures.fetch());
                            })
                            .then(function(messages){
                                that.messageView.messageListView.render();
                            });
                    },
                    error: function(model, resp, options) {
                        console.error("Failed to save user language preference of " + model + " to the database", resp);
                    }
                }

                var user_id = Ctx.getCurrentUser().id,
                    existingModel = preferenceColllection.filter(function(model){
                        return (model.get('user_id') === user_id) && (model.get('locale_name') === locale) && (model.get('source_of_evidence') === 0)
                    });
                if (!(_.isEmpty(existingModel)) ) {
                    var model = existingModel[0];
                    model.save({
                        locale_name: locale,
                        translate_to_name: translateTo,
                    }, commitChanges)
                }
                var hash = {
                    locale_name: locale,
                    source_of_evidence: 0,
                    user: Ctx.getCurrentUser().id,
                    "@type": Types.LANGUAGE_PREFERENCE
                }
                if (translateTo){
                    hash.translate_to_name = translateTo;
                }
                var langPref = new LanguagePreference.Model(hash, {collection: that.languagePreferences});
                langPref.save(null, commitChanges)
            };

        if (state === userTranslationStates.CONFIRM) {
            createModel(this.translatedFrom.locale, langPrefLocale, this.languagePreferences);
        }

        if (state === userTranslationStates.DENY) {
            createModel(this.translatedFrom.locale, null, this.languagePreferences);
        }
    },

    updateLanguagePreferenceConfirm: function(e){
        this.updateLanguagePreference(userTranslationStates.CONFIRM);
    },

    updateLanguagePreferenceDeny: function(e) {
        this.updateLanguagePreference(userTranslationStates.DENY);
    },

    serializeData: function(){
        if (this.template !== "#tmpl-loader") {
            return {
                translationQuestion: i18n.sprintf(i18n.gettext("Translate all messages from %s to "), this.translatedFrom.name),
                supportedLanguages: this.localesAsSortedList(),
                translatedTo: this.translatedTo,
                translatedFromLocale: this.translatedFrom
            };
        }
    },

    onRender: function(){
        //Whenever a TranslationView is rendered, the message was translated.
        if (this.template !== '#tmpl-loader') {
            var original = this.message.get('body').original(),
                current = this.message.get('body').best(this.languagePreferences);

            //Showing the correct statement
            if (this.messageView.useOriginalContent) {
                this.$(this.ui.showOriginalString).addClass('hidden');
                this.$(this.ui.showTranslatedString).removeClass('hidden');
            }
            else {
                this.$(this.ui.showTranslatedString).addClass('hidden');
                this.$(this.ui.showOriginalString).removeClass('hidden');
            }

            if (current.isMachineTranslation()){
                var doit = this.languagePreferences.filter(function(ulp){
                    return ulp.isTranslateTo(current.getBaseLocale());
                });
                if (doit) {
                    //This could be slow and cause the user to first see the question
                    this.$(this.ui.setLangPref).addClass('hidden');
                }
            }
        }
    }

});

module.exports = TranslationView;
