// @flow
import React, { Fragment, Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
// Graphql imports
import { compose, graphql } from 'react-apollo';
import BrightMirrorFictionQuery from '../graphql/BrightMirrorFictionQuery.graphql';
// Route helpers imports
import { browserHistory } from '../router';
import { get } from '../utils/routeMap';
// Components imports
import FictionHeader from '../components/debate/brightMirror/fictionHeader';
import FictionToolbar from '../components/debate/brightMirror/fictionToolbar';
import FictionBody from '../components/debate/brightMirror/fictionBody';
import BackButton from '../components/debate/common/backButton';
import FictionCommentForm from '../components/debate/brightMirror/fictionCommentForm';
// Utils imports
import { displayAlert } from '../utils/utilityManager';
import { getConnectedUserId } from '../utils/globalFunctions';
import Permissions, { connectedUserCan } from '../utils/permissions';
// Constant imports
import { FICTION_DELETE_CALLBACK, EMPTY_STRING, PublicationStates } from '../constants';
// Type imports
import type { CircleAvatarProps } from '../components/debate/brightMirror/circleAvatar';
import type { FictionHeaderProps } from '../components/debate/brightMirror/fictionHeader';
import type { FictionToolbarProps } from '../components/debate/brightMirror/fictionToolbar';
import type { FictionBodyProps } from '../components/debate/brightMirror/fictionBody';
import type { FictionCommentFormProps } from '../components/debate/brightMirror/fictionCommentForm';
// import type { FictionCommentFormResultType } from '../components/debate/brightMirror/fictionCommentForm';

// Define types
export type BrightMirrorFictionProps = {
  /** URL slug */
  slug: string,
  /** Fiction phase */
  phase: string,
  /** Fiction theme identifier */
  themeId: string,
  /** Fiction identifier */
  fictionId: string
};

type BrightMirrorFictionReduxProps = {
  /** Fiction locale fetched from mapStateToProps */
  contentLocale: string
  /** Fiction locale mapping fetched from mapStateToProps */
};

export type BrightMirrorFictionData = {
  /** Fiction object formatted through GraphQL  */
  fiction: BrightMirrorFictionFragment,
  /** GraphQL flag that checks the query/mutation state */
  loading: boolean,
  /** GraphQL error object used to handle fetching errors */
  error: any
};

type BrightMirrorFictionGraphQLProps = {
  /** Fiction data information fetched from GraphQL */
  brightMirrorFictionData: BrightMirrorFictionData
};

type LocalBrightMirrorFictionProps = BrightMirrorFictionProps & BrightMirrorFictionReduxProps & BrightMirrorFictionGraphQLProps;

type BrightMirrorFictionState = {
  /** Fiction title */
  title: string,
  /** Fiction content */
  content: string,
  /** GraphQL loading flag */
  loading: boolean
  /** Fiction publication state */
  publicationState: string
};

export class BrightMirrorFiction extends Component<LocalBrightMirrorFictionProps, BrightMirrorFictionState> {
  // Lifecycle functions
  constructor(props: LocalBrightMirrorFictionProps) {
    super(props);
    this.state = {
      // title: props.brightMirrorFictionData.fiction.subject ? props.brightMirrorFictionData.fiction.subject : EMPTY_STRING,
      // content: props.brightMirrorFictionData.fiction.body ? props.brightMirrorFictionData.fiction.body : EMPTY_STRING
      title: EMPTY_STRING,
      content: EMPTY_STRING,
      loading: props.brightMirrorFictionData.loading
      publicationState: props.data.fiction.publicationState || PublicationStates.PUBLISHED
    };
  }

  componentWillReceiveProps(nextProps: LocalBrightMirrorFictionProps) {
    // Sync state
    this.setState({
      title: nextProps.brightMirrorFictionData.fiction.subject ? nextProps.brightMirrorFictionData.fiction.subject : EMPTY_STRING,
      content: nextProps.brightMirrorFictionData.fiction.body ? nextProps.brightMirrorFictionData.fiction.body : EMPTY_STRING,
      loading: nextProps.brightMirrorFictionData.loading
    });
  }

  // Define callback functions
  // submitCommentHandler = (callbackResult: FictionCommentFormResultType) => {
  //   // const { post, error } = callbackResult;
  //   const { error } = callbackResult;

  //   if (error !== undefined) {
  //     displayAlert('success', I18n.t('debate.thread.postSuccess'));
  //     // Update UI
  //   } else {
  //     displayAlert('danger', `${error}`);
  //   }
  // };

  render() {
    const { title, content, loading, publicationState } = this.state;
    // Display nothing/loader when graphQL is still loading datas
    if (loading) return null;

    const { brightMirrorFictionData, contentLocale, fictionId, phase, slug, themeId } = this.props;
    // Handle fetching error
    if (brightMirrorFictionData.error) {
      displayAlert('danger', I18n.t('error.loading'));
      return null;
    }

    // Define variables
    const { fiction } = brightMirrorFictionData;
    const getDisplayName = () => (fiction.creator && fiction.creator.displayName ? fiction.creator.displayName : EMPTY_STRING);
    const displayName = fiction.creator && fiction.creator.isDeleted ? I18n.t('deletedUser') : getDisplayName();

    // Define user permission
    const USER_ID_NOT_FOUND = -9999;
    const userId = fiction.creator ? fiction.creator.userId : USER_ID_NOT_FOUND;
    const userCanDelete =
      (getConnectedUserId() === String(userId) && connectedUserCan(Permissions.DELETE_MY_POST)) ||
      connectedUserCan(Permissions.DELETE_POST);
    const userCanEdit = getConnectedUserId() === String(userId) && connectedUserCan(Permissions.EDIT_MY_POST);

    // Define callback functions - TODO: move the logic out of render
    const deleteFictionCallback = () => {
      // Route to fiction list page
      const fictionListParams = { slug: slug, phase: phase, themeId: themeId };
      const fictionListURL = get('idea', fictionListParams);
      // Set a callback state in order to display a delete fiction confirmation message
      browserHistory.push({
        pathname: fictionListURL,
        state: { callback: FICTION_DELETE_CALLBACK }
      });
    };
    const modifyFictionCallback = (subject, body, state) => {
      this.setState({ title: subject, content: body, publicationState: state });
    };
    const backBtnCallback = () => {
      browserHistory.push(`${get('idea', { slug: slug, phase: phase, themeId: themeId })}`);
    };
    // Define components props
    const circleAvatarProps: CircleAvatarProps = {
      username: displayName,
      src:
        fiction.creator && fiction.creator.image && fiction.creator.image.externalUrl
          ? fiction.creator.image.externalUrl
          : EMPTY_STRING
    };

    const fictionHeaderProps: FictionHeaderProps = {
      authorFullname: displayName,
      publishedDate: fiction.creationDate ? fiction.creationDate.toString() : EMPTY_STRING,
      displayedPublishedDate: I18n.l(fiction.creationDate, { dateFormat: 'date.format' }),
      circleAvatar: { ...circleAvatarProps }
    };

    const fictionToolbarProps: FictionToolbarProps = {
      fictionId: fictionId,
      title: title,
      originalBody: content,
      lang: contentLocale,
      publicationState: publicationState,
      userCanEdit: userCanEdit,
      userCanDelete: userCanDelete,
      onModifyCallback: modifyFictionCallback,
      onDeleteCallback: deleteFictionCallback
    };

    const fictionBodyProps: FictionBodyProps = {
      title: title,
      content: content
    };

    const fictionCommentFormProps: FictionCommentFormProps = {
      onCancelCommentCallback: undefined,
      onSubmitCommentCallback: undefined
    };

    // const fictionThreadViewProps: FictionThreadViewProps = {
    //   contentLocale: contentLocale,
    //   ideaId: themeId,
    //   parentId: fictionId,
    //   onSubmitCommentCallback: this.submitCommentHandler
    // };

    return (
      <Fragment>
        <div className="bright-mirror-fiction background-fiction-default">
          <BackButton handleClick={backBtnCallback} linkClassName="back-btn" />
          <Grid fluid>
            <Row>
              <Col xs={12}>
                <article>
                  <FictionHeader {...fictionHeaderProps} />
                  <FictionToolbar {...fictionToolbarProps} />
                  <FictionBody {...fictionBodyProps} />
                </article>
              </Col>
            </Row>
          </Grid>
        </div>
        <Grid fluid className="bright-mirror-thread">
          <Row>
            <Col xs={12}>
              <article>
                <FictionCommentForm {...fictionCommentFormProps} />
                <p>FictionCommentList</p>
              </article>
            </Col>
          </Row>
        </Grid>
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  contentLocale: state.i18n.locale
});
export default compose(
  connect(mapStateToProps),
  graphql(BrightMirrorFictionQuery, {
    name: 'brightMirrorFictionData',
    // GraphQL needed input variables
    options: ({ fictionId, contentLocale }) => ({
      variables: {
        id: fictionId,
        contentLocale: contentLocale
      }
    })
  })
)(BrightMirrorFiction);