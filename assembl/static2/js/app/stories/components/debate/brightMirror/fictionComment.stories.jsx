// @flow
import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, text, number, object } from '@storybook/addon-knobs';
/* eslint-enable */

// import components
import { FictionComment } from '../../../../components/debate/brightMirror/fictionComment';
import type {
  FictionCommentExtraProps,
  FictionCommentBaseProps,
  FictionCommentGraphQLProps
} from '../../../../components/debate/brightMirror/fictionComment';

// import existing storybook data
import { defaultCircleAvatar } from './circleAvatar.stories';

const defaultFictionCommentCallbacks: FictionCommentExtraProps = {
  submitCommentCallback: action('submitCommentCallback'),
  expandedFromTree: true,
  expandCollapseCallbackFromTree: action('expandCollapseCallbackFromTree')
};

export const defaultFictionComment: FictionCommentBaseProps = {
  numChildren: 999,
  fictionCommentCallbacks: defaultFictionCommentCallbacks
};

export const defaultFictionCommentGraphQL: FictionCommentGraphQLProps = {
  authorFullname: 'Helen Aguilar',
  publishedDate: '2018-07-09',
  displayedPublishedDate: 'August 8th, 2018',
  commentParentId: 'dummyId',
  commentContent:
    'Est et rerum. Ut sed voluptatem possimus. Ut cumque magni sapiente voluptatem ut rerum aut harum quo. Non delectus quo.',
  circleAvatar: { ...defaultCircleAvatar }
};

const playground = {
  ...defaultFictionComment,
  ...defaultFictionCommentGraphQL
};

storiesOf('FictionComment', module)
  .addDecorator(withKnobs)
  .add('default', withInfo()(() => <FictionComment {...defaultFictionComment} {...defaultFictionCommentGraphQL} />))
  .add(
    'playground',
    withInfo()(() => (
      <FictionComment
        authorFullname={text('Author fullname', playground.authorFullname)}
        publishedDate={text('Published date', playground.publishedDate)}
        displayedPublishedDate={text('Displayed published date', playground.displayedPublishedDate)}
        commentParentId={text('Comment parent id', playground.commentParentId)}
        commentContent={text('Comment content', playground.commentContent)}
        circleAvatar={object('circleAvatar', playground.circleAvatar)}
        numChildren={number('Number of comments', playground.numChildren)}
        fictionCommentCallbacks={playground.fictionCommentCallbacks}
      />
    ))
  );