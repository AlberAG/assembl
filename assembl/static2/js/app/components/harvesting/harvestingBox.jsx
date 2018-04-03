// @flow
import React from 'react';
import ARange from 'annotator_range'; // eslint-disable-line
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Button, OverlayTrigger } from 'react-bootstrap';
import { Translate, I18n } from 'react-redux-i18n';
import classnames from 'classnames';
import moment from 'moment';

import addPostExtractMutation from '../../graphql/mutations/addPostExtract.graphql';
import updateExtractMutation from '../../graphql/mutations/updateExtract.graphql';
import deleteExtractMutation from '../../graphql/mutations/deleteExtract.graphql';
import withLoadingIndicator from '../../components/common/withLoadingIndicator';
import { getConnectedUserId, getConnectedUserName } from '../../utils/globalFunctions';
import AvatarImage from '../common/avatarImage';
import TaxonomyOverflowMenu from './taxonomyOverflowMenu';
import FormControlWithLabel from '../common/formControlWithLabel';
import { displayAlert, displayModal, closeModal } from '../../utils/utilityManager';
import {
  validateExtractTooltip,
  editExtractTooltip,
  deleteExtractTooltip,
  nuggetExtractTooltip,
  qualifyExtractTooltip
} from '../common/tooltips';

type Props = {
  extract: ?Extract,
  postId: string,
  contentLocale: string,
  selection: ?Object,
  ideaId: string,
  setHarvestingBoxDisplay: Function,
  cancelHarvesting: Function,
  addPostExtract: Function,
  updateExtract: Function,
  deleteExtract: Function,
  refetchPost: Function
};

type State = {
  disabled: boolean,
  checkIsActive: boolean,
  isNugget: boolean,
  isEditable: boolean,
  editableExtract: string,
  nature: ?string,
  action: ?string
};

class DumbHarvestingBox extends React.Component<void, Props, State> {
  props: Props;

  state: State;

  menu: any;

  constructor(props: Props) {
    super(props);
    const { extract } = this.props;
    const isExtract = extract !== null;
    const isNugget = extract ? extract.important : false;
    this.state = {
      disabled: !isExtract,
      checkIsActive: isExtract,
      isNugget: isNugget,
      isEditable: false,
      editableExtract: extract ? extract.body : '',
      nature: null,
      action: null
    };
  }

  setEditMode = (): void => {
    const { isEditable } = this.state;
    this.setState({ isEditable: !isEditable });
  };

  editExtract = (value: string): void => {
    this.setState({ editableExtract: value });
  };

  qualifyExtract = (category: string, qualifier: string): void => {
    this.menu.hide();
    console.log(category, qualifier); // eslint-disable-line
  };

  updateHarvestingNugget = (): void => {
    const { extract, ideaId, updateExtract } = this.props;
    const { isNugget, editableExtract, nature, action } = this.state;
    const variables = {
      extractId: extract ? extract.id : null,
      ideaId: ideaId,
      body: editableExtract,
      important: !isNugget,
      extractNature: nature,
      extractAction: action
    };
    displayAlert('success', I18n.t('loading.wait'));
    updateExtract({ variables: variables })
      .then(() => {
        this.setState({
          isNugget: !isNugget
        });
        displayAlert('success', I18n.t('harvesting.harvestingSuccess'));
      })
      .catch((error) => {
        displayAlert('danger', `${error}`);
      });
  };

  updateHarvestingBody = (): void => {
    const { extract, ideaId, updateExtract } = this.props;
    const { isNugget, editableExtract, nature, action } = this.state;
    const variables = {
      extractId: extract ? extract.id : null,
      ideaId: ideaId,
      body: editableExtract,
      important: isNugget,
      extractNature: nature,
      extractAction: action
    };
    displayAlert('success', I18n.t('loading.wait'));
    updateExtract({ variables: variables })
      .then(() => {
        this.setState({
          isEditable: false
        });
        displayAlert('success', I18n.t('harvesting.harvestingSuccess'));
      })
      .catch((error) => {
        displayAlert('danger', `${error}`);
      });
  };

  confirmHarvestingDeletion = (): void => {
    const modalTitle = <Translate value="harvesting.deleteExtract" />;
    const body = <Translate value="harvesting.confirmDeleteExtract" />;
    const footer = [
      <Button key="delete" onClick={this.deleteHarvesting} className="button-submit button-dark">
        <Translate value="debate.confirmDeletionButtonDelete" />
      </Button>,
      <Button key="cancel" onClick={closeModal} className="button-cancel button-dark">
        <Translate value="debate.confirmDeletionButtonCancel" />
      </Button>
    ];
    const includeFooter = true;
    return displayModal(modalTitle, body, includeFooter, footer);
  };

  deleteHarvesting = (): void => {
    const { extract, deleteExtract, refetchPost } = this.props;
    const variables = {
      extractId: extract ? extract.id : null
    };
    closeModal();
    displayAlert('success', I18n.t('loading.wait'));
    deleteExtract({ variables: variables })
      .then(() => {
        refetchPost();
        displayAlert('success', I18n.t('harvesting.harvestingDeleted'));
      })
      .catch((error) => {
        displayAlert('danger', `${error}`);
      });
  };

  validateHarvesting = (): void => {
    const { postId, selection, contentLocale, addPostExtract, setHarvestingBoxDisplay } = this.props;
    if (!selection) {
      return;
    }
    const selectionText = selection.toString();
    const annotatorRange = ARange.sniff(selection.getRangeAt(0));
    if (!annotatorRange) {
      return;
    }
    const serializedAnnotatorRange = annotatorRange.serialize(document, 'annotation');
    if (!serializedAnnotatorRange) {
      return;
    }
    const variables = {
      contentLocale: contentLocale,
      postId: postId,
      body: selectionText,
      important: false,
      xpathStart: serializedAnnotatorRange.start,
      xpathEnd: serializedAnnotatorRange.end,
      offsetStart: serializedAnnotatorRange.startOffset,
      offsetEnd: serializedAnnotatorRange.endOffset
    };
    displayAlert('success', I18n.t('loading.wait'));
    addPostExtract({ variables: variables })
      .then(() => {
        this.setState({
          disabled: false,
          checkIsActive: true
        });
        setHarvestingBoxDisplay();
        window.getSelection().removeAllRanges();
      })
      .catch((error) => {
        displayAlert('danger', `${error}`);
      });
  };

  render() {
    const { selection, cancelHarvesting, extract, contentLocale } = this.props;
    const { disabled, checkIsActive, isNugget, isEditable, editableExtract } = this.state;
    const isExtract = extract !== null;
    const selectionText = selection ? selection.toString() : '';
    const harvesterUserName =
      extract && extract.creator && extract.creator.displayName ? extract.creator.displayName : getConnectedUserName();
    const harvesterUserId = extract && extract.creator && extract.creator.userId ? extract.creator.userId : getConnectedUserId();

    return (
      <div className={classnames('theme-box', 'harvesting-box', { 'active-box': checkIsActive })}>
        <div className="harvesting-box-header">
          <div className="harvesting-status">
            {disabled ? (
              <div className="harvesting-in-progress">
                <span className="confirm-harvest-button assembl-icon-catch" />
                <div className="harvesting-status-label">
                  <div>
                    <Translate value="harvesting.harvestSelection" />
                  </div>
                  <div>
                    <Translate value="harvesting.inProgress" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="validated-harvesting">
                <span className="confirm-harvest-button assembl-icon-catch" />
                <div className="harvesting-status-label">
                  <div>
                    <Translate value="harvesting.harvestSelection" />
                  </div>
                  <div>
                    <Translate value="harvesting.validated" />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="button-bar">
            <OverlayTrigger placement="top" overlay={validateExtractTooltip}>
              <Button disabled={disabled} className={classnames({ active: checkIsActive })}>
                <span className="assembl-icon-check grey" />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={editExtractTooltip}>
              <Button disabled={disabled} onClick={this.setEditMode} className={classnames({ active: isEditable })}>
                <span className="assembl-icon-edit grey" />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={deleteExtractTooltip}>
              <Button disabled={disabled} onClick={this.confirmHarvestingDeletion}>
                <span className="assembl-icon-delete grey" />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={nuggetExtractTooltip}>
              <Button disabled={disabled} onClick={this.updateHarvestingNugget} className={classnames({ active: isNugget })}>
                <span className="assembl-icon-pepite grey" />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              ref={(m) => {
                this.menu = m;
              }}
              trigger="click"
              rootClose
              placement="right"
              overlay={TaxonomyOverflowMenu(this.qualifyExtract)}
            >
              <OverlayTrigger placement="top" overlay={qualifyExtractTooltip}>
                <span className="assembl-icon-ellipsis-vert grey pointer" />
              </OverlayTrigger>
            </OverlayTrigger>
          </div>
          <div className="profile">
            <AvatarImage userId={harvesterUserId} userName={harvesterUserName} />
            <div className="harvesting-infos">
              <div className="username">{harvesterUserName}</div>
              {isExtract &&
                extract &&
                extract.creationDate && (
                  <div className="harvesting-date" title={extract.creationDate}>
                    {moment(extract.creationDate)
                      .locale(contentLocale)
                      .fromNow()}
                  </div>
                )}
              {!isExtract && (
                <div className="harvesting-date">
                  <Translate value="harvesting.now" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="harvesting-box-body">
          {isExtract && extract && !isEditable && <div>{extract.body}</div>}
          {isExtract &&
            extract &&
            isEditable && (
              <FormControlWithLabel
                componentClass="textarea"
                className="text-area"
                value={editableExtract}
                onChange={e => this.editExtract(e.target.value)}
              />
            )}
          {!isExtract && <div>{selectionText}</div>}
        </div>
        {(disabled || isEditable) && (
          <div className="harvesting-box-footer">
            <Button
              className="button-submit button-dark"
              onClick={isEditable ? this.updateHarvestingBody : this.validateHarvesting}
            >
              <Translate value="common.attachFileForm.submit" />
            </Button>
            <Button className="button-cancel button-dark" onClick={isEditable ? this.setEditMode : cancelHarvesting}>
              <Translate value="debate.confirmDeletionButtonCancel" />
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export { DumbHarvestingBox };

const mapStateToProps = state => ({
  contentLocale: state.i18n.locale
});

export default compose(
  connect(mapStateToProps),
  graphql(addPostExtractMutation, {
    name: 'addPostExtract'
  }),
  graphql(updateExtractMutation, {
    name: 'updateExtract'
  }),
  graphql(deleteExtractMutation, {
    name: 'deleteExtract'
  }),
  withLoadingIndicator()
)(DumbHarvestingBox);