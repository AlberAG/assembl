import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Row, Col, FormGroup, FormControl, Button } from 'react-bootstrap';
import { I18n, Translate } from 'react-redux-i18n';

import createPostMutation from '../../../graphql/mutations/createPost.graphql';
import { updateTopPostFormStatus, updateTopPostSubject, updateTopPostBody } from '../../../actions/postsActions';
import { displayAlert } from '../../../utils/utilityManager';

const TEXT_AREA_MAX_LENGTH = 1500;
const TEXT_AREA_ROWS = 12;
const TEXT_INPUT_MAX_LENGTH = 200;

const TopPostForm = ({
  ideaId,
  subject,
  updateSubject,
  body,
  updateBody,
  updateFormStatus,
  isFormActive,
  mutate,
  refetchIdea
}) => {
  const displayForm = (isActive) => {
    return updateFormStatus(isActive);
  };

  const emptySubject = () => {
    return updateSubject('');
  };

  const emptyBody = () => {
    return updateBody('');
  };

  const resetForm = () => {
    displayForm(false);
    emptySubject();
    emptyBody();
  };

  const variables = {
    ideaId: ideaId,
    subject: subject,
    body: body
  };

  const createTopPost = () => {
    displayAlert('success', I18n.t('loading.wait'));
    mutate({ variables: variables })
      .then(() => {
        refetchIdea();
        displayAlert('success', I18n.t('debate.survey.postSuccess'));
        resetForm();
      })
      .catch((error) => {
        displayAlert('danger', error);
      });
  };

  const handleInputFocus = () => {
    return displayForm(true);
  };

  const handleSubjectChange = (e) => {
    return updateSubject(e.target.value);
  };

  const handleBodyChange = (e) => {
    return updateBody(e.target.value);
  };

  return (
    <Row>
      <Col xs={0} sm={1} md={2} />
      <Col xs={12} sm={3} md={2} className="no-padding">
        <div className="start-discussion-icon">
          <span className="assembl-icon-discussion color" />
        </div>
        <div className="start-discussion">
          <h3 className="dark-title-3 no-margin">
            <Translate value="debate.thread.startDiscussion" />
          </h3>
        </div>
      </Col>
      <Col xs={12} sm={7} md={6} className="no-padding">
        <div className="form-container">
          <FormGroup>
            <FormControl
              type="text"
              placeholder={I18n.t('debate.subject')}
              maxLength={TEXT_INPUT_MAX_LENGTH}
              value={subject}
              onFocus={handleInputFocus}
              onChange={handleSubjectChange}
            />
            <div className={isFormActive ? 'margin-m' : 'hidden'}>
              <FormControl
                className="txt-area"
                componentClass="textarea"
                placeholder={I18n.t('debate.insert')}
                maxLength={TEXT_AREA_MAX_LENGTH}
                rows={TEXT_AREA_ROWS}
                value={body}
                onChange={handleBodyChange}
              />
              <button type="reset" className="button-cancel button-dark btn btn-default left margin-l" onClick={resetForm}>
                <Translate value="cancel" />
              </button>
              <Button className="button-submit button-dark btn btn-default right margin-l" onClick={createTopPost}>
                <Translate value="debate.post" />
              </Button>
            </div>
          </FormGroup>
        </div>
      </Col>
      <Col xs={0} sm={1} md={2} />
    </Row>
  );
};

const mapStateToProps = ({ posts }) => {
  return {
    subject: posts.topPostSubject,
    body: posts.topPostBody,
    isFormActive: posts.topPostFormStatus
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    updateFormStatus: (isFormActive) => {
      return dispatch(updateTopPostFormStatus(isFormActive));
    },
    updateSubject: (topPostSubject) => {
      return dispatch(updateTopPostSubject(topPostSubject));
    },
    updateBody: (topPostBody) => {
      return dispatch(updateTopPostBody(topPostBody));
    }
  };
};

TopPostForm.propTypes = {
  mutate: PropTypes.func.isRequired
};

const TopPostFormWithMutation = graphql(createPostMutation)(TopPostForm);

export default connect(mapStateToProps, mapDispatchToProps)(TopPostFormWithMutation);