import * as actions from '../../../../js/app/actions/adminActions/voteSession';

import {
  UPDATE_VOTE_SESSION_PAGE_TITLE,
  UPDATE_VOTE_SESSION_PAGE_SUBTITLE,
  UPDATE_VOTE_SESSION_PAGE_INSTRUCTIONS_TITLE,
  UPDATE_VOTE_SESSION_PAGE_INSTRUCTIONS_CONTENT,
  UPDATE_VOTE_SESSION_PAGE_PROPOSITIONS_TITLE,
  UPDATE_VOTE_SESSION_PAGE_IMAGE,
  UPDATE_VOTE_SESSION_PUBLIC_VOTE
} from '../../../../js/app/actions/actionTypes';

describe('voteSession admin actions', () => {
  describe('updateVoteSessionPageTitle action', () => {
    const { updateVoteSessionPageTitle } = actions;
    it('should return an UPDATE_VOTE_SESSION_PAGE_TITLE action type', () => {
      const actual = updateVoteSessionPageTitle('en', 'Title of the Vote Session Page in english');
      const expected = {
        locale: 'en',
        value: 'Title of the Vote Session Page in english',
        type: UPDATE_VOTE_SESSION_PAGE_TITLE
      };
      expect(actual).toEqual(expected);
    });
  });
  describe('updateVoteSessionPageSubtitle action', () => {
    const { updateVoteSessionPageSubtitle } = actions;
    it('should return an UPDATE_VOTE_SESSION_PAGE_SUBTITLE action type', () => {
      const actual = updateVoteSessionPageSubtitle('en', 'Subtitle of the Vote Session Page in english');
      const expected = {
        locale: 'en',
        value: 'Subtitle of the Vote Session Page in english',
        type: UPDATE_VOTE_SESSION_PAGE_SUBTITLE
      };
      expect(actual).toEqual(expected);
    });
  });
  describe('updateVoteSessionPageInstructionsTitle', () => {
    const { updateVoteSessionPageInstructionsTitle } = actions;
    it('should return an UPDATE_VOTE_SESSION_PAGE_SUBTITLE action type', () => {
      const actual = updateVoteSessionPageInstructionsTitle(
        'en',
        'Title of the instructions for the Vote Session Page in english'
      );
      const expected = {
        locale: 'en',
        value: 'Title of the instructions for the Vote Session Page in english',
        type: UPDATE_VOTE_SESSION_PAGE_INSTRUCTIONS_TITLE
      };
      expect(actual).toEqual(expected);
    });
  });
  describe('updateVoteSessionPageInstructionsContent', () => {
    const { updateVoteSessionPageInstructionsContent } = actions;
    it('should return an UPDATE_VOTE_SESSION_PAGE_SUBTITLE action type', () => {
      const actual = updateVoteSessionPageInstructionsContent(
        'en',
        'Content of the instructions for the Vote Session Page in english'
      );
      const expected = {
        locale: 'en',
        value: 'Content of the instructions for the Vote Session Page in english',
        type: UPDATE_VOTE_SESSION_PAGE_INSTRUCTIONS_CONTENT
      };
      expect(actual).toEqual(expected);
    });
  });
  describe('updateVoteSessionPagePropositionsTitle', () => {
    const { updateVoteSessionPagePropositionsTitle } = actions;
    it('should return an UPDATE_VOTE_SESSION_PAGE_PROPOSITIONS_TITLE action type', () => {
      const actual = updateVoteSessionPagePropositionsTitle(
        'en',
        'Title of the propositions section for the vote session page in english'
      );
      const expected = {
        locale: 'en',
        value: 'Title of the propositions section for the vote session page in english',
        type: UPDATE_VOTE_SESSION_PAGE_PROPOSITIONS_TITLE
      };
      expect(actual).toEqual(expected);
    });
  });
  describe('updateVoteSessionHeaderImage', () => {
    const { updateVoteSessionHeaderImage } = actions;
    it('should return an UPDATE_VOTE_SESSION_PAGE_IMAGE action type', () => {
      const actual = updateVoteSessionHeaderImage({ name: 'foo.jpg', type: 'image/jpeg' });
      const expected = {
        value: { name: 'foo.jpg', type: 'image/jpeg' },
        type: UPDATE_VOTE_SESSION_PAGE_IMAGE
      };
      expect(actual).toEqual(expected);
    });
  });
});