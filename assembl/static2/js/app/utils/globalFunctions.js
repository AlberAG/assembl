import Translations from './translations';

class GlobalFunctions {
  static getLocale(browserLanguage) {
    let locale = browserLanguage.split('-')[0].toLowerCase();
    if (!Translations[locale]) locale = 'en';
    return locale;
  }
  static getAvalaibleLocales(locale, translations) {
    const locArray = [];
    Object.keys(translations).map((key) => {
      if (key !== locale) locArray.push(key);
      return locArray;
    });
    return locArray;
  }
  static getDiscussionId() {
    const discussionId = document.getElementById('discussion-id') ? document.getElementById('discussion-id').value : null;
    return discussionId;
  }
  static getConnectedUserId() {
    const userId = document.getElementById('user-id') ? document.getElementById('user-id').value : null;
    return userId;
  }
  static getLatestDate(object, key) {
    const sortedDate = object.map((item) => {
      const date = item[key];
      return new Date(date).getTime();
    }).sort();
    return new Date(sortedDate[sortedDate.length - 1]);
  }
}

export default GlobalFunctions;