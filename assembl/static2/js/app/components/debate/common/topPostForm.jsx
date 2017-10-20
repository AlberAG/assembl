// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { FormGroup, Button } from 'react-bootstrap';
import { I18n, Translate } from 'react-redux-i18n';
import classNames from 'classnames';
import type { RawContentState } from 'draft-js';

import createPostMutation from '../../../graphql/mutations/createPost.graphql';
import uploadDocumentMutation from '../../../graphql/mutations/uploadDocument.graphql';
import { convertRawContentStateToHTML, rawContentStateIsEmpty } from '../../../utils/draftjs';
import { displayAlert, inviteUserToLogin, promptForLoginOr } from '../../../utils/utilityManager';
import { getConnectedUserId } from '../../../utils/globalFunctions';
import { TextInputWithRemainingChars } from '../../common/textInputWithRemainingChars';
import RichTextEditor from '../../common/richTextEditor';
import attachmentsPlugin from '../../common/richTextEditor/attachmentsPlugin';

export const TEXT_INPUT_MAX_LENGTH = 140;
export const TEXT_AREA_MAX_LENGTH = 3000;

type TopPostFormProps = {
  contentLocale: string,
  createPost: Function,
  ideaId: string,
  refetchIdea: Function,
  uploadDocument: Function,
  ideaOnColumn: boolean,
  messageClassifier: string
};

type TopPostFormState = {
  body: null | RawContentState,
  isActive: boolean,
  subject: string,
  submitting: boolean
};

class TopPostForm extends React.Component<*, TopPostFormProps, TopPostFormState> {
  props: TopPostFormProps;
  state: TopPostFormState;

  constructor() {
    super();
    this.state = {
      body: null,
      isActive: false,
      subject: '',
      submitting: false
    };
  }

  displayForm = (isActive) => {
    this.setState({
      isActive: isActive
    });
  };

  resetForm = () => {
    this.displayForm(false);
    this.setState({ subject: '' });
    this.setState({ body: null });
  };

  createTopPost = () => {
    const { contentLocale, createPost, ideaId, refetchIdea, uploadDocument, messageClassifier, ideaOnColumn } = this.props;
    const { body, subject } = this.state;
    this.setState({ submitting: true });
    const bodyIsEmpty = !body || rawContentStateIsEmpty(body);
    if ((subject || this.props.ideaOnColumn) && !bodyIsEmpty) {
      // first, we upload each attachment
      const uploadDocumentsPromise = attachmentsPlugin.uploadNewAttachments(body, uploadDocument);
      uploadDocumentsPromise.then((result) => {
        const variables = {
          contentLocale: contentLocale,
          ideaId: ideaId,
          subject: subject || null,
          messageClassifier: messageClassifier || null,
          // use the updated content state with new entities
          body: convertRawContentStateToHTML(result.contentState),
          attachments: result.documentIds
        };
        displayAlert('success', I18n.t('loading.wait'));

        createPost({ variables: variables })
          .then(() => {
            refetchIdea();
            displayAlert('success', I18n.t('debate.thread.postSuccess'));
            this.resetForm();
            this.setState({ submitting: false });
          })
          .catch((error) => {
            displayAlert('danger', error);
            this.setState({ submitting: false });
          });
      });
    } else if (!subject && !ideaOnColumn) {
      displayAlert('warning', I18n.t('debate.thread.fillSubject'));
      this.setState({ submitting: false });
    } else if (bodyIsEmpty) {
      displayAlert('warning', I18n.t('debate.thread.fillBody'));
      this.setState({ submitting: false });
    }
  };

  handleInputFocusOneColumn = promptForLoginOr(() => {
    return this.displayForm(true);
  });

  handleInputFocusXColumns = () => {
    const isUserConnected = getConnectedUserId();
    if (!isUserConnected) {
      inviteUserToLogin();
    }
  };

  handleInputFocus = () => {
    if (this.props.ideaOnColumn) {
      this.handleInputFocusXColumns();
    } else {
      this.handleInputFocusOneColumn();
    }
  };

  updateBody = (newValue) => {
    this.setState({
      body: newValue
    });
  };

  handleSubjectChange = (e) => {
    this.setState({
      subject: e.target.value
    });
  };

  getClassNames() {
    const { ideaOnColumn } = this.props;
    return classNames(['button-submit', 'button-dark', 'btn', 'btn-default', 'right', !ideaOnColumn ? 'margin-l' : 'margin-m']);
  }

  render() {
    return (
      <div className="form-container">
        <FormGroup>
          {!this.props.ideaOnColumn
            ? <TextInputWithRemainingChars
              value={this.state.subject}
              label={I18n.t('debate.subject')}
              maxLength={TEXT_INPUT_MAX_LENGTH}
              handleTxtChange={this.handleSubjectChange}
              handleInputFocus={this.handleInputFocus}
            />
            : null}
          {this.state.isActive || this.props.ideaOnColumn
            ? <div className="margin-m">
              <RichTextEditor
                rawContentState={this.state.body}
                handleInputFocus={this.handleInputFocus}
                maxLength={TEXT_AREA_MAX_LENGTH}
                placeholder={I18n.t('debate.insert')}
                updateContentState={this.updateBody}
                withAttachmentButton
              />
              {!this.props.ideaOnColumn
                ? <Button className="button-cancel button-dark btn btn-default left margin-l" onClick={this.resetForm}>
                  <Translate value="cancel" />
                </Button>
                : null}
              <Button
                className={this.getClassNames()}
                onClick={this.createTopPost}
                style={{ marginBottom: '30px' }}
                disabled={this.state.submitting}
              >
                <Translate value="debate.post" />
              </Button>
            </div>
            : null}
        </FormGroup>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    contentLocale: state.i18n.locale
  };
};

export default compose(
  connect(mapStateToProps),
  graphql(createPostMutation, { name: 'createPost' }),
  graphql(uploadDocumentMutation, { name: 'uploadDocument' })
)(TopPostForm);