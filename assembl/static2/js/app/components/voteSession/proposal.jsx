// @flow
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Map } from 'immutable';

import TokenVoteForProposal from './tokenVoteForProposal';
import GaugeVoteForProposal from './gaugeVoteForProposal';
import { findTokenVoteModule, type UserTokenVotes, type VoteSpecification } from '../../pages/voteSession';

type Props = {
  description: ?string,
  id: string,
  modules: ?Array<VoteSpecification>,
  title: ?string,
  tokenVotes: UserTokenVotes,
  voteForProposal: Function
};

const Proposal = ({ description, id, modules, title, tokenVotes, voteForProposal }: Props) => {
  const tokenVoteModule = modules ? findTokenVoteModule(modules) : null;
  return (
    <div className="theme-box">
      <Row className="proposal">
        <Col xs={6} md={6}>
          <h3 className="dark-title-3">{title}</h3>
          <p>{description}</p>
        </Col>
        <Col xs={6} md={6}>
          {tokenVoteModule && (
            <TokenVoteForProposal
              key={tokenVoteModule.id}
              instructions={tokenVoteModule.instructions}
              proposalId={id}
              tokenCategories={tokenVoteModule.tokenCategories}
              tokenVotes={tokenVotes.get(id, Map())}
              voteForProposal={voteForProposal}
            />
          )}
          {modules &&
            modules
              .filter(module => module.voteType === 'gauge_vote_specification')
              // $FlowFixMe
              .map(module => <GaugeVoteForProposal key={module.id} {...module} />)}
        </Col>
      </Row>
    </div>
  );
};

export default Proposal;