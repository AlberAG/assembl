// @flow
import React from 'react';
import { Translate } from 'react-redux-i18n';

import { getDomElementOffset } from '../../../../utils/globalFunctions';
import Attachments from '../../../common/attachments';
import ProfileLine from '../../../common/profileLine';
import PostActions from '../../common/postActions';
import AnswerForm from '../../thread/answerForm';
import Nuggets from '../../thread/nuggets';
import RelatedIdeas from './relatedIdeas';
import PostBody from './postBody';
import HarvestingMenu from '../../../harvesting/harvestingMenu';
import type { Props as PostProps } from './index';

type Props = PostProps & {
  body: string,
  subject: string,
  handleEditClick: Function,
  modifiedSubject: React.Element<*>,
  isHarvesting: boolean
};

type State = {
  showAnswerForm: boolean,
  displayHarvestingMenu: boolean,
  harvestingAnchorPosition: Object
};

class PostView extends React.PureComponent<void, Props, State> {
  props: Props;

  state: State;

  answerTextarea: HTMLTextAreaElement;

  postView: HTMLElement;

  constructor(props: Props) {
    super(props);
    const { extracts } = this.props.data.post;
    const isExtracts = extracts.length > 0;
    this.state = {
      showAnswerForm: false,
      displayHarvestingMenu: isExtracts,
      harvestingAnchorPosition: { x: 0, y: 0 }
    };
  }

  handleAnswerClick = () => {
    this.setState({ showAnswerForm: true }, this.props.measureTreeHeight);
    setTimeout(() => {
      if (!this.answerTextarea) return;
      const txtareaOffset = getDomElementOffset(this.answerTextarea).top;
      window.scrollTo({ top: txtareaOffset - this.answerTextarea.clientHeight, left: 0, behavior: 'smooth' });
    }, 200);
  };

  hideAnswerForm = () => {
    this.setState({ showAnswerForm: false }, this.props.measureTreeHeight);
  };

  recomputeTreeHeightOnImagesLoad = (el: HTMLElement) => {
    // recompute the tree height after images are loaded
    if (el) {
      const images = el.getElementsByTagName('img');
      Array.from(images).forEach(img =>
        img.addEventListener('load', () => {
          this.props.measureTreeHeight(400);
        })
      );
    }
  };

  getAnchorPosition() {
    const selection = document.getSelection();
    const selectionRange = selection ? selection.getRangeAt(0) : null;
    const selectionPositionY = selectionRange ? selectionRange.getBoundingClientRect().top : 0;
    const anchorPositionX = selectionRange ? selectionRange.getBoundingClientRect().left : 0;
    const anchorPositionY = selectionPositionY - this.postView.getBoundingClientRect().top;
    return { x: anchorPositionX, y: anchorPositionY };
  }

  handleMouseUpWhileHarvesting = (): void => {
    const { isHarvesting, translate } = this.props;
    if (isHarvesting && !translate) {
      const harvestingAnchorPosition = this.getAnchorPosition();
      this.setState({ displayHarvestingMenu: true, harvestingAnchorPosition: harvestingAnchorPosition });
    } else {
      this.setState({ displayHarvestingMenu: false });
    }
  };

  cancelHarvesting = (): void => {
    this.setState({ displayHarvestingMenu: false });
    window.getSelection().removeAllRanges();
  };

  render() {
    const {
      bodyMimeType,
      dbId,
      indirectIdeaContentLinks,
      creator,
      modificationDate,
      sentimentCounts,
      mySentiment,
      attachments,
      extracts
    } = this.props.data.post;
    const {
      borderLeftColor,
      handleEditClick,
      contentLocale,
      id,
      lang,
      ideaId,
      refetchIdea,
      // creationDate is retrieved by IdeaWithPosts query, not PostQuery
      creationDate,
      fullLevel,
      numChildren,
      routerParams,
      debateData,
      nuggetsManager,
      rowIndex,
      originalLocale,
      identifier,
      body,
      subject,
      modifiedSubject,
      multiColumns,
      isHarvesting
    } = this.props;
    const translate = contentLocale !== originalLocale;

    const completeLevelArray = fullLevel ? [rowIndex, ...fullLevel.split('-').map(string => Number(string))] : [rowIndex];

    const answerTextareaRef = (el: HTMLTextAreaElement) => {
      this.answerTextarea = el;
    };

    const boxStyle = {
      borderLeftColor: borderLeftColor
    };

    let canReply = !multiColumns;
    // If we're in thread mode, check if the first idea associated to the post is multi columns.
    if (!multiColumns && indirectIdeaContentLinks && indirectIdeaContentLinks.length > 0) {
      canReply = indirectIdeaContentLinks[0].idea.messageViewOverride !== 'messageColumns';
    }

    const { displayHarvestingMenu, harvestingAnchorPosition } = this.state;

    const { refetch } = this.props.data;

    return (
      <div
        ref={(p) => {
          this.postView = p;
        }}
      >
        {!multiColumns && (
          <Nuggets
            extracts={extracts}
            postId={id}
            nuggetsManager={nuggetsManager}
            completeLevel={completeLevelArray.join('-')}
            isHarvesting={isHarvesting}
          />
        )}
        {displayHarvestingMenu && (
          <HarvestingMenu
            postId={id}
            cancelHarvesting={this.cancelHarvesting}
            isHarvesting={isHarvesting}
            extracts={extracts}
            harvestingAnchorPosition={harvestingAnchorPosition}
            ideaId={ideaId}
            refetchPost={refetch}
          />
        )}
        <div className="box" style={boxStyle}>
          <div className="post-row">
            <div className="post-left" onMouseUp={this.handleMouseUpWhileHarvesting}>
              {creator && (
                <ProfileLine
                  userId={creator.userId}
                  userName={creator.displayName}
                  creationDate={creationDate}
                  locale={lang}
                  modified={modificationDate !== null}
                />
              )}
              <PostBody
                body={body}
                dbId={dbId}
                extracts={extracts}
                bodyMimeType={bodyMimeType}
                contentLocale={contentLocale}
                id={id}
                lang={lang}
                subject={modifiedSubject}
                originalLocale={originalLocale}
                translate={translate}
                translationEnabled={debateData.translationEnabled}
                bodyDivRef={this.recomputeTreeHeightOnImagesLoad}
                isHarvesting={isHarvesting}
              />

              <Attachments attachments={attachments} />

              {!multiColumns && (
                <div>
                  <RelatedIdeas indirectIdeaContentLinks={indirectIdeaContentLinks} />

                  <div className="answers annotation">
                    <Translate value="debate.thread.numberOfResponses" count={numChildren} />
                  </div>
                </div>
              )}
            </div>
            <div className="post-right">
              <PostActions
                creatorUserId={creator.userId}
                postId={id}
                handleEditClick={handleEditClick}
                sentimentCounts={sentimentCounts}
                mySentiment={mySentiment}
                numChildren={numChildren}
                routerParams={routerParams}
                debateData={debateData}
                postSubject={subject.replace('Re: ', '')}
                identifier={identifier}
              />
            </div>
          </div>
        </div>
        {canReply && (
          <div className={this.state.showAnswerForm ? 'answer-form' : 'collapsed-answer-form'}>
            <AnswerForm
              parentId={id}
              ideaId={ideaId}
              refetchIdea={refetchIdea}
              textareaRef={answerTextareaRef}
              hideAnswerForm={this.hideAnswerForm}
              handleAnswerClick={this.handleAnswerClick}
              identifier={identifier}
            />
          </div>
        )}
      </div>
    );
  }
}

export default PostView;