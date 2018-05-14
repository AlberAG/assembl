// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Translate, I18n } from 'react-redux-i18n';
import { Grid, Col, Button } from 'react-bootstrap';

import ConfiguredField, { type ConfiguredFieldType } from '../components/common/configuredField';
import ModifyPasswordForm from '../components/common/modifyPasswordForm';
import { get, getContextual } from '../utils/routeMap';
import { displayAlert } from '../utils/utilityManager';
import withLoadingIndicator from '../components/common/withLoadingIndicator';
import UserQuery from '../graphql/userQuery.graphql';
import ProfileFieldsQuery from '../graphql/ProfileFields.graphql';
import UpdateUserMutation from '../graphql/mutations/updateUser.graphql';
import UpdateProfileFieldMutation from '../graphql/mutations/updateProfileField.graphql';
import { browserHistory } from '../router';

type ProfileProps = {
  connectedUserId: string,
  creationDate: ?string,
  lang: string,
  slug: string,
  userId: string,
  id: string,
  hasPassword: boolean,
  name: string,
  params: Object,
  profileFields: Array<ConfiguredFieldType>,
  location: Object,
  updateProfileField: Function
};

type ProfileState = {
  passwordEditionOpen: boolean,
  values: {
    [string]: Object
  }
};

class Profile extends React.PureComponent<*, ProfileProps, ProfileState> {
  props: ProfileProps;

  state: ProfileState;

  defaultProps: {
    creationDate: null
  };

  static getDerivedStateFromProps(nextProps) {
    const values = nextProps.profileFields.filter(pf => pf.valueData).reduce(
      (result, pf) => ({
        ...result,
        [pf.id]: pf.valueData.value
      }),
      {}
    );

    return { values: values };
  }

  constructor(props) {
    super(props);
    this.state = {
      values: {},
      passwordEditionOpen: false
    };
  }

  componentDidMount() {
    const { connectedUserId, slug } = this.props;
    const { userId } = this.props.params;
    const { location } = this.props;
    if (!connectedUserId) {
      browserHistory.push(`${getContextual('login', { slug: slug })}?next=${location.pathname}`);
    } else if (connectedUserId !== userId) {
      browserHistory.push(get('home', { slug: slug }));
    }
  }

  handleSaveClick = () => {
    const { profileFields, updateProfileField } = this.props;
    profileFields.forEach((pf) => {
      const newValue = this.state.values[pf.id];
      if (newValue !== pf.valueData.value) {
        const variables = {
          configurableFieldId: pf.configurableField.id,
          id: pf.id,
          valueData: { value: newValue }
        };
        updateProfileField({ variables: variables })
          .then(() => {
            displayAlert('success', I18n.t('profile.saveSuccess'));
          })
          .catch((error) => {
            displayAlert('danger', error.message.replace('GraphQL error: ', ''));
          });
      }
    });
  };

  handlePasswordClick = () => {
    this.setState({ passwordEditionOpen: true });
  };

  handleFieldValueChange = (id, value) => {
    this.setState(prevState => ({
      ...prevState,
      values: {
        ...prevState.values,
        [id]: value
      }
    }));
  };

  render() {
    const { creationDate, hasPassword, lang, id, name } = this.props;
    const profileFields = this.props.profileFields;
    return (
      <div className="profile background-dark-grey">
        <div className="content-section">
          <Grid fluid>
            <div className="max-container">
              <Col xs={12} sm={3}>
                <div className="center">
                  <span className="assembl-icon-profil" />
                </div>
                <h2 className="dark-title-2 capitalized center">{name}</h2>
                {creationDate && (
                  <div className={`center member-since lang-${lang}`}>
                    <Translate value="profile.memberSince" date={I18n.l(creationDate, { dateFormat: 'date.format2' })} />
                  </div>
                )}
              </Col>
              <Col xs={12} sm={9}>
                <div className="border-left">
                  <h1 className="dark-title-1">
                    <Translate value="profile.panelTitle" />
                  </h1>
                  <h2 className="dark-title-2 margin-l">
                    <Translate value="profile.personalInfos" />
                  </h2>
                  <div className="profile-form center">
                    {profileFields &&
                      profileFields.map(pf => (
                        <ConfiguredField
                          key={pf.id}
                          configurableField={pf.configurableField}
                          handleValueChange={value => this.handleFieldValueChange(pf.id, value)}
                          value={this.state.values[pf.id]}
                        />
                      ))}
                    <Button className="button-submit button-dark margin-l" onClick={this.handleSaveClick}>
                      <Translate value="profile.save" />
                    </Button>
                  </div>
                  {hasPassword && (
                    <div>
                      <h2 className="dark-title-2 margin-l">
                        <Translate value="profile.password" />
                      </h2>
                      <div className="profile-form center">
                        {this.state.passwordEditionOpen ? (
                          <ModifyPasswordForm id={id} successCallback={() => this.setState({ passwordEditionOpen: false })} />
                        ) : (
                          <Button className="button-submit button-dark" onClick={this.handlePasswordClick}>
                            <Translate value="profile.changePassword" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            </div>
          </Grid>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ context, debate, i18n }, ownProps) => {
  const userId = ownProps.params.userId;
  return {
    slug: debate.debateData.slug,
    connectedUserId: context.connectedUserId,
    id: btoa(`AgentProfile:${userId}`),
    lang: i18n.locale
  };
};

export default compose(
  connect(mapStateToProps),
  graphql(ProfileFieldsQuery, {
    props: ({ data }) => {
      if (data.loading) {
        return { loading: true, profileFields: [] };
      }
      if (data.error) {
        // this is needed to properly redirect to home page in case of error
        return { error: data.error, profileFields: [] };
      }

      return {
        profileFields: data.profileFields
      };
    }
  }),
  graphql(UserQuery, {
    props: ({ data }) => {
      if (data.loading) {
        return { loading: true };
      }
      if (data.error) {
        // this is needed to properly redirect to home page in case of error
        return { error: data.error };
      }
      return {
        creationDate: data.user.creationDate,
        name: data.user.name,
        hasPassword: data.user.hasPassword
      };
    }
  }),
  graphql(UpdateUserMutation, { name: 'updateUser' }),
  graphql(UpdateProfileFieldMutation, { name: 'updateProfileField' }),
  withLoadingIndicator()
)(Profile);