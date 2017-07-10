import * as reducers from '../../../js/app/reducers/postsReducer';

describe('Posts reducers', () => {
  describe('topPostSubject reducer', () => {
    const { topPostSubject } = reducers;
    it('should return the initial state', () => {
      expect(topPostSubject(undefined, {})).toEqual('');
    });

    it('should return state by default', () => {
      const state = 'New subject';
      const expected = 'New subject';
      const actual = topPostSubject(state, {});
      expect(actual).toEqual(expected);
    });

    it('should handle UPDATE_TOP_POST_SUBJECT action type', () => {
      const state = 'New subject';
      const action = {
        type: 'UPDATE_TOP_POST_SUBJECT',
        topPostSubject: 'New subject'
      };
      const actual = topPostSubject(state, action);
      const expected = 'New subject';
      expect(actual).toEqual(expected);
    });
  });

  describe('topPostBody reducer', () => {
    const { topPostBody } = reducers;
    it('should return the initial state', () => {
      expect(topPostBody(undefined, {})).toEqual('');
    });

    it('should return state by default', () => {
      const state = 'New body';
      const expected = 'New body';
      const actual = topPostBody(state, {});
      expect(actual).toEqual(expected);
    });

    it('should handle UPDATE_TOP_POST_BODY action type', () => {
      const state = 'New body';
      const action = {
        type: 'UPDATE_TOP_POST_BODY',
        topPostBody: 'New body'
      };
      const actual = topPostBody(state, action);
      const expected = 'New body';
      expect(actual).toEqual(expected);
    });
  });

  describe('topPostFormStatus reducer', () => {
    const { topPostFormStatus } = reducers;
    it('should return the initial state', () => {
      expect(topPostFormStatus(undefined, {})).toEqual(false);
    });

    it('should return state by default', () => {
      const state = false;
      const expected = false;
      const actual = topPostFormStatus(state, {});
      expect(actual).toEqual(expected);
    });

    it('should handle UPDATE_TOP_POST_FORM_STATUS action type', () => {
      const state = true;
      const action = {
        type: 'UPDATE_TOP_POST_FORM_STATUS',
        isTopPostFormActive: true
      };
      const actual = topPostFormStatus(state, action);
      const expected = true;
      expect(actual).toEqual(expected);
    });
  });
});