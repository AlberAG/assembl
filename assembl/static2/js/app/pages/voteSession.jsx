// @flow
import React from 'react';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { I18n, Translate } from 'react-redux-i18n';
import { Map } from 'immutable';

import VoteSessionQuery from '../graphql/VoteSession.graphql';
import AddTokenVoteMutation from '../graphql/mutations/addTokenVote.graphql';
import Header from '../components/common/header';
import Section from '../components/common/section';
import AvailableTokens from '../components/voteSession/availableTokens';
import Proposals from '../components/voteSession/proposals';
import { getDomElementOffset, isMobile } from '../utils/globalFunctions';
import { getPhaseId } from '../utils/timeline';
import { promptForLoginOr, displayAlert } from '../utils/utilityManager';
import withLoadingIndicator from '../components/common/withLoadingIndicator';
import MessagePage from '../components/common/messagePage';

export type TokenCategory = {|
  id: string,
  totalNumber: number,
  typename: string,
  title: ?string,
  titleEntries: ?Array<?LangStringEntryInput>,
  color: ?string
|};

export type TokenVoteSpecification = { ...tokenVoteSpecificationFragment, ...tokenVoteSpecificationResultsFragment };
export type NumberGaugeVoteSpecification = {
  ...numberGaugeVoteSpecificationFragment,
  ...numberGaugeVoteSpecificationResultsFragment
};
export type GaugeVoteSpecification = { ...gaugeVoteSpecificationFragment, ...gaugeVoteSpecificationResultsFragment };

export type VoteSpecification = TokenVoteSpecification | NumberGaugeVoteSpecification | GaugeVoteSpecification;

export type Proposal = {|
  id: string,
  title: ?string,
  description: ?string,
  titleEntries: ?Array<?LangStringEntryInput>,
  descriptionEntries: ?Array<?LangStringEntryInput>,
  order: ?number,
  modules: Array<VoteSpecification>,
  voteResults: {|
    numParticipants: number,
    participants: Array<?{|
      // The ID of the object.
      id: string,
      userId: number,
      displayName: ?string
    |}>
  |}
|};

type Props = {
  title: string,
  subTitle: string,
  headerImageUrl: string,
  instructionsSectionTitle: string,
  instructionsSectionContent: string,
  modules: Array<VoteSpecification>,
  propositionsSectionTitle: string,
  proposals: Array<Proposal>,
  addTokenVote: Function
};

export type RemainingTokensByCategory = Map<string, number>;

export type UserTokenVotesForVoteSpec = Map<string, number>; // key is tokenCategoryId
export type UserTokenVotesForProposal = Map<string, UserTokenVotesForVoteSpec>; // key is voteSpecId
export type UserGaugeVotesForProposal = Map<string, number>; // key is voteSpecId

export type UserTokenVotes = Map<string, UserTokenVotesForProposal>; // key is proposalId
export type UserGaugeVotes = Map<string, UserGaugeVotesForProposal>; // key is proposalId

type State = {
  userTokenVotes: UserTokenVotes,
  userGaugeVotes: UserGaugeVotes,
  availableTokensSticky: boolean
};

// $FlowFixMe: if voteType === 'token_vote_specification', we know it is a TokenVoteSpecification
type FindTokenVoteModule = (Array<VoteSpecification>) => ?TokenVoteSpecification;
export const findTokenVoteModule: FindTokenVoteModule = modules => modules.find(m => m.voteType === 'token_vote_specification');

// $FlowFixMe: if voteType === 'gauge_vote_specification', we know it is a GaugeVoteSpecification
type FilterGaugeVoteModules = (Array<VoteSpecification>) => Array<GaugeVoteSpecification>;
export const filterGaugeVoteModules: FilterGaugeVoteModules = modules =>
  modules.filter(module => module.voteType === 'gauge_vote_specification');

// $FlowFixMe: if voteType === 'number_gauge_vote_specification', we know it is a NumberGaugeVoteSpecification
type FilterNumberGaugeVoteModules = (Array<VoteSpecification>) => Array<NumberGaugeVoteSpecification>;
export const filterNumberGaugeVoteModules: FilterNumberGaugeVoteModules = modules =>
  modules.filter(module => module.voteType === 'number_gauge_vote_specification');

class DumbVoteSession extends React.Component<void, Props, State> {
  props: Props;

  state: State;

  availableTokensContainerRef: HTMLDivElement;

  constructor(props: Props) {
    super(props);
    this.state = {
      availableTokensSticky: false,
      userTokenVotes: Map(),
      userGaugeVotes: Map()
    };
  }

  componentWillMount() {
    window.addEventListener('scroll', this.setAvailableTokensSticky);
    this.setMyVotes();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.setAvailableTokensSticky);
  }

  setMyVotes() {
    const { proposals } = this.props;
    let userTokenVotes = Map();
    let userGaugeVotes = Map();
    proposals.forEach((proposal) => {
      const tokenModules = proposal.modules
        ? proposal.modules.filter(module => module.voteType === 'token_vote_specification')
        : [];
      const gaugeModules = proposal.modules
        ? proposal.modules.filter(module => module.voteType !== 'token_vote_specification')
        : [];
      tokenModules.forEach((tokenModule) => {
        tokenModule.myVotes.forEach((myVote) => {
          // $FlowFixMe: issue with generated type, myVote can be {} from the generated type, but not in reality.
          userTokenVotes = userTokenVotes.setIn([myVote.proposalId, tokenModule.id, myVote.tokenCategoryId], myVote.voteValue);
        });
      });
      gaugeModules.forEach((gaugeModule) => {
        gaugeModule.myVotes.forEach((myVote) => {
          // $FlowFixMe: issue with generated type, myVote can be {} from the generated type, but not in reality.
          userGaugeVotes = userGaugeVotes.setIn([myVote.proposalId, gaugeModule.id], myVote.selectedValue);
        });
      });
    });
    this.setState({
      userTokenVotes: userTokenVotes,
      userGaugeVotes: userGaugeVotes
    });
  }

  setAvailableTokensSticky = () => {
    if (this.availableTokensContainerRef && !isMobile.any()) {
      const availableTokensDivOffset = getDomElementOffset(this.availableTokensContainerRef).top;
      if (availableTokensDivOffset <= window.scrollY) {
        this.setState({ availableTokensSticky: true });
      } else {
        this.setState({ availableTokensSticky: false });
      }
    }
  };

  voteForProposalToken = (proposalId: string, tokenVoteModuleId: string, categoryId: string, value: number): void => {
    const setVote = () =>
      this.setState({
        userTokenVotes: this.state.userTokenVotes.setIn([proposalId, tokenVoteModuleId, categoryId], value)
      });
    promptForLoginOr(setVote)();
  };

  voteForProposalGauge = (proposalId: string, voteSpecificationId: string, value: number): void => {
    const setVote = () =>
      this.setState({
        userGaugeVotes: this.state.userGaugeVotes.setIn([proposalId, voteSpecificationId], value)
      });
    promptForLoginOr(setVote)();
  };

  getRemainingTokensByCategory: (?TokenVoteSpecification) => RemainingTokensByCategory = (module) => {
    let remainingTokensByCategory = Map();
    if (module && module.tokenCategories) {
      module.tokenCategories.forEach((category) => {
        if (category) {
          remainingTokensByCategory = remainingTokensByCategory.set(category.id, category.totalNumber);
        }
      });
    }
    this.state.userTokenVotes.forEach((voteSpecs) => {
      voteSpecs.forEach((tokenCategories) => {
        tokenCategories.forEach((voteValue, tokenCategoryId) => {
          remainingTokensByCategory = remainingTokensByCategory.updateIn([tokenCategoryId], val => val - voteValue);
        });
      });
    });
    return remainingTokensByCategory;
  };

  setAvailableTokensRef = (el: HTMLDivElement) => {
    this.availableTokensContainerRef = el;
  };

  displaySubmitButton: void => boolean = () => {
    const tokenVotesSum = this.state.userTokenVotes
      .valueSeq()
      .flatMap(v => v.valueSeq().flatMap(v2 => v2.valueSeq()))
      .reduce((sum, x) => sum + x, 0);

    return tokenVotesSum > 0;
  };

  submitTokenVote = () => {
    const { addTokenVote } = this.props;
    this.state.userTokenVotes.forEach((voteSpecs, proposalId) => {
      voteSpecs.forEach((tokenCategories, voteSpecId) => {
        tokenCategories.forEach((voteValue, tokenCategoryId) => {
          addTokenVote({
            variables: {
              voteSpecId: voteSpecId,
              proposalId: proposalId,
              tokenCategoryId: tokenCategoryId,
              voteValue: voteValue
            }
          })
            .then(() => {
              displayAlert('success', I18n.t('debate.survey.postSuccess'));
            })
            .catch((error) => {
              displayAlert('danger', error.message);
            });
        });
      });
    });
  };

  render() {
    const {
      title,
      subTitle,
      headerImageUrl,
      instructionsSectionTitle,
      instructionsSectionContent,
      propositionsSectionTitle,
      proposals,
      modules
    } = this.props;

    if (!title || title.length === 0) {
      return (
        <MessagePage
          title={I18n.t('debate.voteSession.noVoteSession.title')}
          text={I18n.t('debate.voteSession.noVoteSession.text')}
        />
      );
    }

    const tokenVoteModule = findTokenVoteModule(modules);
    const remainingTokensByCategory = this.getRemainingTokensByCategory(tokenVoteModule);
    return (
      <div className="votesession-page">
        <Header title={title} subtitle={subTitle} imgUrl={headerImageUrl} additionalHeaderClasses="left" />
        <Grid fluid className="background-light">
          <Section
            title={instructionsSectionTitle}
            containerAdditionalClassNames={this.state.availableTokensSticky ? ['no-margin'] : null}
          >
            <Row>
              <Col
                mdOffset={!this.state.availableTokensSticky ? 3 : null}
                smOffset={!this.state.availableTokensSticky ? 1 : null}
                md={8}
                sm={10}
                className="no-padding"
              >
                <div dangerouslySetInnerHTML={{ __html: instructionsSectionContent }} className="vote-instructions" />
                {tokenVoteModule &&
                  tokenVoteModule.tokenCategories && (
                    <div ref={this.setAvailableTokensRef}>
                      <AvailableTokens
                        sticky={this.state.availableTokensSticky}
                        remainingTokensByCategory={remainingTokensByCategory}
                        tokenCategories={tokenVoteModule.tokenCategories}
                      />
                    </div>
                  )}
              </Col>
            </Row>
          </Section>
        </Grid>
        <Grid fluid className="background-grey">
          <Section title={propositionsSectionTitle} className={this.state.availableTokensSticky ? 'extra-margin-top' : null}>
            <Row>
              <Col mdOffset={1} md={10} smOffset={1} sm={10}>
                <Proposals
                  proposals={proposals}
                  remainingTokensByCategory={remainingTokensByCategory}
                  userGaugeVotes={this.state.userGaugeVotes}
                  userTokenVotes={this.state.userTokenVotes}
                  voteForProposalToken={this.voteForProposalToken}
                  voteForProposalGauge={this.voteForProposalGauge}
                />
              </Col>
            </Row>
            <Row className="form-actions center">
              <Col mdOffset={1} md={10} smOffset={1} sm={10}>
                {this.displaySubmitButton() ? (
                  <Button className="button-submit button-dark" onClick={this.submitTokenVote}>
                    <Translate value="debate.voteSession.submit" />
                  </Button>
                ) : null}
              </Col>
            </Row>
          </Section>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  debate: state.debate,
  lang: state.i18n.locale
});

export { DumbVoteSession };

export default compose(
  connect(mapStateToProps),
  graphql(VoteSessionQuery, {
    options: ({ debate, lang }) => ({
      variables: { discussionPhaseId: getPhaseId(debate.debateData.timeline, 'voteSession'), lang: lang }
    }),
    props: ({ data, ownProps }) => {
      const defaultHeaderImage = ownProps.debate.debateData.headerBackgroundUrl || '';
      if (data.loading) {
        return {
          loading: true
        };
      }
      if (data.error) {
        return {
          hasErrors: true
        };
      }

      if (!data.voteSession) {
        return {
          loading: data.loading,
          title: '',
          subTitle: '',
          headerImageUrl: '',
          instructionsSectionTitle: '',
          instructionsSectionContent: '',
          modules: [],
          propositionsSectionTitle: '',
          proposals: []
        };
      }

      const {
        title,
        subTitle,
        headerImage,
        instructionsSectionTitle,
        instructionsSectionContent,
        propositionsSectionTitle,
        modules, // we still need to get templates here for AvailableTokens component
        proposals
      } = data.voteSession;

      return {
        loading: data.loading,
        headerImageUrl: headerImage ? headerImage.externalUrl : defaultHeaderImage,
        title: title,
        subTitle: subTitle,
        instructionsSectionTitle: instructionsSectionTitle,
        instructionsSectionContent: instructionsSectionContent,
        propositionsSectionTitle: propositionsSectionTitle,
        modules: modules,
        proposals: proposals,
        noVoteSession: false
      };
    }
  }),
  graphql(AddTokenVoteMutation, {
    name: 'addTokenVote'
  }),
  withLoadingIndicator()
)(DumbVoteSession);