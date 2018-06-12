import { fromJS, Map } from 'immutable';

import * as reducers from '../../../../js/app/reducers/adminReducer';

describe('Admin reducers', () => {
  describe('editLocale reducer', () => {
    const { editLocale } = reducers;
    it('should return the initial state', () => {
      expect(editLocale(undefined, {})).toEqual('fr');
    });

    it('should return state by default', () => {
      const state = 'en';
      const expected = 'en';
      const actual = editLocale(state, {});
      expect(actual).toEqual(expected);
    });

    it('should handle UPDATE_EDIT_LOCALE action type', () => {
      const state = 'en';
      const action = {
        type: 'UPDATE_EDIT_LOCALE',
        newLocale: 'fr'
      };
      const actual = editLocale(state, action);
      const expected = 'fr';
      expect(actual).toEqual(expected);
    });
  });

  describe('thematicsById reducer', () => {
    const { thematicsById, thematicsHaveChanged } = reducers;
    it('should return the initial state', () => {
      const action = {};
      expect(thematicsById(undefined, action)).toEqual(Map());
    });

    it('should return the current state for other actions', () => {
      const action = { type: 'FOOBAR' };
      const oldState = Map({ '1': { id: '1', titleEntries: [] } });
      expect(thematicsById(oldState, action)).toEqual(oldState);
    });

    it('should handle ADD_QUESTION_TO_THEMATIC action type', () => {
      const action = { id: '1', locale: 'fr', type: 'ADD_QUESTION_TO_THEMATIC' };
      const oldState = fromJS({
        '1': {
          _hasChanged: false,
          questions: [
            {
              titleEntries: [{ localeCode: 'en', value: 'My title' }, { localeCode: 'fr', value: 'Mon titre' }]
            }
          ]
        }
      });
      const expected = fromJS({
        '1': {
          _hasChanged: true,
          questions: [
            {
              titleEntries: [{ localeCode: 'en', value: 'My title' }, { localeCode: 'fr', value: 'Mon titre' }]
            },
            {
              titleEntries: [{ localeCode: 'fr', value: '' }]
            }
          ]
        }
      });
      const newState = thematicsById(oldState, action);
      expect(newState).toEqual(expected);
    });

    it('should handle CREATE_NEW_THEMATIC action type', () => {
      const action = {
        id: '-278290',
        type: 'CREATE_NEW_THEMATIC'
      };
      const oldState = fromJS({
        '0': {
          id: '0',
          order: 2.0,
          _toDelete: false
        },
        '1': {
          id: '1',
          order: 4.0,
          _toDelete: false
        },
        '2': {
          id: '2',
          order: 5.0,
          _toDelete: true
        }
      });
      const expected = {
'0': {
          id: '0',
          order: 2.0,
          _toDelete: false
        },
        '1': {
          id: '1',
          order: 4.0,
          _toDelete: false
        },
        '2': {
          id: '2',
          order: 5.0,
          _toDelete: true
        },
        '-278290': {
          _hasChanged: false,
          _isNew: true,
          _toDelete: false,
          order: 5.0,
          id: '-278290',
          img: {
            externalUrl: ''
          },
          questions: [],
          titleEntries: [],
          video: null
        }
      };
      const newState = thematicsById(oldState, action);
      expect(newState.toJS()).toEqual(expected);
    });

    it('should handle MOVE_THEMATIC_UP action type', () => {
      const thematic1 = fromJS({
        _hasChanged: false,
        _isNew: false,
        _toDelete: false,
        order: 1.0,
        id: 'thematic1',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const thematic2 = fromJS({
        _hasChanged: false,
        _isNew: false,
        _toDelete: false,
        order: 2.0,
        id: 'thematic2',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const thematic3 = fromJS({
        _hasChanged: false,
        _isNew: false,
        _toDelete: false,
        order: 3.0,
        id: 'thematic3',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const state = Map({ thematic1: thematic1, thematic2: thematic2, thematic3: thematic3 });
      const action = {
        id: 'thematic3',
        type: 'MOVE_THEMATIC_UP'
      };
      const expectedThematic1 = fromJS({
        _hasChanged: false,
        _isNew: false,
        _toDelete: false,
        order: 1.0,
        id: 'thematic1',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const expectedThematic2 = fromJS({
        _hasChanged: true,
        _isNew: false,
        _toDelete: false,
        order: 3.0,
        id: 'thematic2',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const expectedThematic3 = fromJS({
        _hasChanged: true,
        _isNew: false,
        _toDelete: false,
        order: 2.0,
        id: 'thematic3',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const expected = Map({ thematic1: expectedThematic1, thematic2: expectedThematic2, thematic3: expectedThematic3 });
      let result = thematicsById(state, action);
      expect(result).toEqual(expected);
      result = thematicsHaveChanged(false, action);
      expect(result).toEqual(true);
    });

    it('should handle MOVE_THEMATIC_DOWN action type', () => {
      const thematic1 = fromJS({
        _hasChanged: false,
        _isNew: false,
        _toDelete: false,
        order: 1.0,
        id: 'thematic1',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const thematic2 = fromJS({
        _hasChanged: false,
        _isNew: false,
        _toDelete: false,
        order: 2.0,
        id: 'thematic2',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const thematic3 = fromJS({
        _hasChanged: false,
        _isNew: false,
        _toDelete: false,
        order: 3.0,
        id: 'thematic3',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const state = Map({ thematic1: thematic1, thematic2: thematic2, thematic3: thematic3 });
      const action = {
        id: 'thematic2',
        type: 'MOVE_THEMATIC_DOWN'
      };
      const expectedThematic1 = fromJS({
        _hasChanged: false,
        _isNew: false,
        _toDelete: false,
        order: 1.0,
        id: 'thematic1',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const expectedThematic2 = fromJS({
        _hasChanged: true,
        _isNew: false,
        _toDelete: false,
        order: 3.0,
        id: 'thematic2',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const expectedThematic3 = fromJS({
        _hasChanged: true,
        _isNew: false,
        _toDelete: false,
        order: 2.0,
        id: 'thematic3',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const expected = Map({ thematic1: expectedThematic1, thematic2: expectedThematic2, thematic3: expectedThematic3 });
      let result = thematicsById(state, action);
      expect(result).toEqual(expected);
      result = thematicsHaveChanged(false, action);
      expect(result).toEqual(true);
    });

    it('should handle MOVE_THEMATIC_UP action type (deleted thematic in between)', () => {
      const thematic1 = fromJS({
        _hasChanged: false,
        _isNew: false,
        _toDelete: false,
        order: 1.0,
        id: 'thematic1',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const thematic2 = fromJS({
        _hasChanged: false,
        _isNew: false,
        _toDelete: true,
        order: 2.0,
        id: 'thematic2',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const thematic3 = fromJS({
        _hasChanged: false,
        _isNew: false,
        _toDelete: false,
        order: 3.0,
        id: 'thematic3',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const state = Map({ thematic1: thematic1, thematic2: thematic2, thematic3: thematic3 });
      const action = {
        id: 'thematic3',
        type: 'MOVE_THEMATIC_UP'
      };
      const expectedThematic1 = fromJS({
        _hasChanged: true,
        _isNew: false,
        _toDelete: false,
        order: 2.0,
        id: 'thematic1',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const expectedThematic2 = fromJS({
        _hasChanged: false,
        _isNew: false,
        _toDelete: true,
        order: 2.0,
        id: 'thematic2',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const expectedThematic3 = fromJS({
        _hasChanged: true,
        _isNew: false,
        _toDelete: false,
        order: 1.0,
        id: 'thematic3',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const expected = Map({ thematic1: expectedThematic1, thematic2: expectedThematic2, thematic3: expectedThematic3 });
      let result = thematicsById(state, action);
      expect(result).toEqual(expected);
      result = thematicsHaveChanged(false, action);
      expect(result).toEqual(true);
    });

    it('should handle MOVE_THEMATIC_DOWN action type (deleted thematic in between)', () => {
      const thematic1 = fromJS({
        _hasChanged: false,
        _isNew: false,
        _toDelete: false,
        order: 1.0,
        id: 'thematic1',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const thematic2 = fromJS({
        _hasChanged: false,
        _isNew: false,
        _toDelete: true,
        order: 2.0,
        id: 'thematic2',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const thematic3 = fromJS({
        _hasChanged: false,
        _isNew: false,
        _toDelete: false,
        order: 3.0,
        id: 'thematic3',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const state = Map({ thematic1: thematic1, thematic2: thematic2, thematic3: thematic3 });
      const action = {
        id: 'thematic1',
        type: 'MOVE_THEMATIC_DOWN'
      };
      const expectedThematic1 = fromJS({
        _hasChanged: true,
        _isNew: false,
        _toDelete: false,
        order: 2.0,
        id: 'thematic1',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const expectedThematic2 = fromJS({
        _hasChanged: false,
        _isNew: false,
        _toDelete: true,
        order: 2.0,
        id: 'thematic2',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const expectedThematic3 = fromJS({
        _hasChanged: true,
        _isNew: false,
        _toDelete: false,
        order: 1.0,
        id: 'thematic3',
        img: {
          externalUrl: ''
        },
        questions: [],
        titleEntries: [],
        video: null
      });
      const expected = Map({ thematic1: expectedThematic1, thematic2: expectedThematic2, thematic3: expectedThematic3 });
      let result = thematicsById(state, action);
      expect(result).toEqual(expected);
      result = thematicsHaveChanged(false, action);
      expect(result).toEqual(true);
    });

    it('should handle DELETE_THEMATIC action type');

    it('should handle REMOVE_QUESTION action type', () => {
      const action = { thematicId: '1', index: '1', type: 'REMOVE_QUESTION' };
      const oldState = fromJS({
        '1': {
          _hasChanged: false,
          questions: [
            {
              titleEntries: [{ localeCode: 'en', value: 'Why?' }, { localeCode: 'fr', value: 'Pourquoi?' }]
            },
            {
              titleEntries: [{ localeCode: 'en', value: 'When?' }, { localeCode: 'fr', value: 'Quand?' }]
            },
            {
              titleEntries: [{ localeCode: 'en', value: 'How?' }, { localeCode: 'fr', value: 'Comment?' }]
            }
          ]
        }
      });
      const expected = fromJS({
        '1': {
          _hasChanged: true,
          questions: [
            {
              titleEntries: [{ localeCode: 'en', value: 'Why?' }, { localeCode: 'fr', value: 'Pourquoi?' }]
            },
            {
              titleEntries: [{ localeCode: 'en', value: 'How?' }, { localeCode: 'fr', value: 'Comment?' }]
            }
          ]
        }
      });
      const newState = thematicsById(oldState, action);
      expect(newState).toEqual(expected);
    });

    it('should handle UPDATE_THEMATIC_IMG_URL action type', () => {
      const file = new File([''], 'toto.png', { type: 'image/png' });
      const action = { id: '1', value: file, type: 'UPDATE_THEMATIC_IMG_URL' };
      const oldState = fromJS({
        '1': {
          _hasChanged: false,
          img: {
            externalUrl: ''
          }
        }
      });
      const expected = {
        '1': {
          _hasChanged: true,
          img: {
            externalUrl: file,
            mimeType: 'image/png'
          }
        }
      };
      const newState = thematicsById(oldState, action);
      expect(newState.toJS()).toEqual(expected);
    });

    it('should handle UPDATE_THEMATIC_IMG_URL action type when img is null', () => {
      const file = new File([''], 'toto.png', { type: 'image/png' });
      const action = { id: '1', value: file, type: 'UPDATE_THEMATIC_IMG_URL' };
      const oldState = fromJS({
        '1': {
          _hasChanged: false,
          img: null
        }
      });
      const expected = {
        '1': {
          _hasChanged: true,
          img: {
            mimeType: 'image/png',
            externalUrl: file
          }
        }
      };
      const newState = thematicsById(oldState, action);
      expect(newState.toJS()).toEqual(expected);
    });

    it('should handle UPDATE_QUESTION_TITLE action type', () => {
      const action = { thematicId: '1', index: '1', locale: 'en', value: 'What?', type: 'UPDATE_QUESTION_TITLE' };
      const oldState = fromJS({
        '1': {
          _hasChanged: false,
          questions: [
            {
              titleEntries: [{ localeCode: 'en', value: 'Why?' }, { localeCode: 'fr', value: 'Pourquoi?' }]
            },
            {
              titleEntries: [{ localeCode: 'en', value: 'When?' }, { localeCode: 'fr', value: 'Quand?' }]
            },
            {
              titleEntries: [{ localeCode: 'en', value: 'How?' }, { localeCode: 'fr', value: 'Comment?' }]
            }
          ]
        }
      });
      const expected = fromJS({
        '1': {
          _hasChanged: true,
          questions: [
            {
              titleEntries: [{ localeCode: 'en', value: 'Why?' }, { localeCode: 'fr', value: 'Pourquoi?' }]
            },
            {
              titleEntries: [{ localeCode: 'en', value: 'What?' }, { localeCode: 'fr', value: 'Quand?' }]
            },
            {
              titleEntries: [{ localeCode: 'en', value: 'How?' }, { localeCode: 'fr', value: 'Comment?' }]
            }
          ]
        }
      });
      const newState = thematicsById(oldState, action);
      expect(newState).toEqual(expected);
    });

    it('should handle UPDATE_THEMATIC_TITLE action type', () => {
      const action = {
        id: '1',
        locale: 'fr',
        value: 'Nouveau titre',
        type: 'UPDATE_THEMATIC_TITLE'
      };
      const oldState = fromJS({
        '0': {},
        '1': {
          _hasChanged: false,
          titleEntries: [{ localeCode: 'en', value: 'My title' }, { localeCode: 'fr', value: 'Mon titre' }]
        }
      });
      const expected = fromJS({
        '0': {},
        '1': {
          _hasChanged: true,
          titleEntries: [{ localeCode: 'en', value: 'My title' }, { localeCode: 'fr', value: 'Nouveau titre' }]
        }
      });
      const newState = thematicsById(oldState, action);
      expect(newState).toEqual(expected);
    });

    it('should handle UPDATE_THEMATIC_TITLE action type with a new locale', () => {
      const action = {
        id: '1',
        locale: 'de',
        value: 'Mein Titel',
        type: 'UPDATE_THEMATIC_TITLE'
      };
      const oldState = fromJS({
        '0': {},
        '1': {
          _hasChanged: false,
          titleEntries: [{ localeCode: 'en', value: 'My title' }, { localeCode: 'fr', value: 'Mon titre' }]
        }
      });
      const expected = fromJS({
        '0': {},
        '1': {
          _hasChanged: true,
          titleEntries: [
            { localeCode: 'en', value: 'My title' },
            { localeCode: 'fr', value: 'Mon titre' },
            { localeCode: 'de', value: 'Mein Titel' }
          ]
        }
      });
      const newState = thematicsById(oldState, action);
      expect(newState).toEqual(expected);
    });

    it('should handle UPDATE_THEMATICS action type');

    it('should handle TOGGLE_VIDEO action type', () => {
      const action = {
        id: '1',
        value: 'foobar',
        type: 'TOGGLE_VIDEO'
      };
      const oldState = fromJS({
        '1': {
          _hasChanged: false,
          video: {
            descriptionEntriesTop: [],
            descriptionEntriesBottom: [],
            descriptionEntriesSide: [],
            htmlCode: 'foobar',
            titleEntries: [{ localeCode: 'fr', value: 'Mon titre' }]
          }
        }
      });
      const expected = fromJS({
        '1': {
          _hasChanged: true,
          video: null
        }
      });
      const newState = thematicsById(oldState, action);
      expect(newState).toEqual(expected);

      const reducedTwiceExpected = fromJS({
        '1': {
          _hasChanged: true,
          video: {
            descriptionEntriesTop: [],
            descriptionEntriesBottom: [],
            descriptionEntriesSide: [],
            htmlCode: '',
            titleEntries: []
          }
        }
      });
      const reducedTwiceState = thematicsById(newState, action);
      expect(reducedTwiceState).toEqual(reducedTwiceExpected);
    });

    it('should handle UPDATE_VIDEO_HTML_CODE action type', () => {
      const action = {
        id: '1',
        value: 'new code',
        type: 'UPDATE_VIDEO_HTML_CODE'
      };
      const oldState = fromJS({
        '1': {
          _hasChanged: false,
          video: {
            descriptionEntriesTop: [],
            descriptionEntriesBottom: [],
            descriptionEntriesSide: [],
            htmlCode: 'old code',
            titleEntries: []
          }
        }
      });
      const expected = fromJS({
        '1': {
          _hasChanged: true,
          video: {
            descriptionEntriesTop: [],
            descriptionEntriesBottom: [],
            descriptionEntriesSide: [],
            htmlCode: 'new code',
            titleEntries: []
          }
        }
      });
      const newState = thematicsById(oldState, action);
      expect(newState).toEqual(expected);
    });

    it('should handle UPDATE_VIDEO_DESCRIPTION_TOP action type', () => {
      const action = {
        id: '1',
        locale: 'en',
        value: 'My new top description',
        type: 'UPDATE_VIDEO_DESCRIPTION_TOP'
      };
      const oldState = fromJS({
        '1': {
          _hasChanged: false,
          video: {
            descriptionEntriesTop: [],
            descriptionEntriesBottom: [],
            descriptionEntriesSide: [],
            htmlCode: '',
            titleEntries: []
          }
        }
      });
      const expected = fromJS({
        '1': {
          _hasChanged: true,
          video: {
            descriptionEntriesTop: [
              {
                localeCode: 'en',
                value: 'My new top description'
              }
            ],
            descriptionEntriesBottom: [],
            descriptionEntriesSide: [],
            htmlCode: '',
            titleEntries: []
          }
        }
      });
      const newState = thematicsById(oldState, action);
      expect(newState).toEqual(expected);
    });

    it('should handle UPDATE_VIDEO_DESCRIPTION_BOTTOM action type', () => {
      const action = {
        id: '1',
        locale: 'en',
        value: 'My new bottom description',
        type: 'UPDATE_VIDEO_DESCRIPTION_BOTTOM'
      };
      const oldState = fromJS({
        '1': {
          _hasChanged: false,
          video: {
            descriptionEntriesTop: [],
            descriptionEntriesBottom: [],
            descriptionEntriesSide: [],
            htmlCode: '',
            titleEntries: []
          }
        }
      });
      const expected = fromJS({
        '1': {
          _hasChanged: true,
          video: {
            descriptionEntriesTop: [],
            descriptionEntriesBottom: [
              {
                localeCode: 'en',
                value: 'My new bottom description'
              }
            ],
            descriptionEntriesSide: [],
            htmlCode: '',
            titleEntries: []
          }
        }
      });
      const newState = thematicsById(oldState, action);
      expect(newState).toEqual(expected);
    });

    it('should handle UPDATE_VIDEO_TITLE action type', () => {
      const action = {
        id: '1',
        locale: 'en',
        value: 'My better title',
        type: 'UPDATE_VIDEO_TITLE'
      };
      const oldState = fromJS({
        '1': {
          _hasChanged: false,
          video: {
            descriptionEntriesTop: [],
            descriptionEntriesBottom: [],
            descriptionEntriesSide: [],
            htmlCode: '',
            titleEntries: [{ localeCode: 'fr', value: 'Ma vidéo' }, { localeCode: 'en', value: 'My video' }]
          }
        }
      });
      const expected = fromJS({
        '1': {
          _hasChanged: true,
          video: {
            descriptionEntriesTop: [],
            descriptionEntriesBottom: [],
            descriptionEntriesSide: [],
            htmlCode: '',
            titleEntries: [{ localeCode: 'fr', value: 'Ma vidéo' }, { localeCode: 'en', value: 'My better title' }]
          }
        }
      });
      const newState = thematicsById(oldState, action);
      expect(newState).toEqual(expected);
    });
  });
});