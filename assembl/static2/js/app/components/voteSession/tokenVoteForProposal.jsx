// @flow
import React from 'react';
import { Button, OverlayTrigger } from 'react-bootstrap';

import Circle from '../svg/circle';
import { resetTokensTooltip } from '../common/tooltips';
import { type TokenVotesForProposal } from '../../pages/voteSession';

type TokenCategory = {|
  id: string,
  totalNumber: number,
  typename: string,
  title: ?string,
  titleEntries: ?Array<?LangStringEntryInput>,
  color: ?string
|};

type Props = {
  instructions: ?string,
  proposalId: string,
  tokenCategories: ?Array<?TokenCategory>,
  tokenVotes: TokenVotesForProposal,
  voteForProposal: Function
};

const TokenVoteForProposal = ({ instructions, proposalId, tokenCategories, tokenVotes, voteForProposal }: Props) => (
  <div>
    {instructions}
    {tokenCategories &&
      tokenCategories.map((category) => {
        if (category) {
          const { color, id, title, totalNumber } = category;
          const currentVote = tokenVotes.get(category.id, 0);
          return (
            <div key={id}>
              <p>{title}</p>
              <div className="tokens">
                {[...Array(totalNumber).keys()].map(n => (
                  <Button key={n + 1} className="admin-icons" onClick={() => voteForProposal(proposalId, id, n + 1)}>
                    <Circle size="35px" strokeColor={color} fillColor={n + 1 <= currentVote ? color : undefined} />
                  </Button>
                ))}
                <OverlayTrigger placement="top" overlay={resetTokensTooltip}>
                  <Button onClick={() => voteForProposal(proposalId, id, 0)}>
                    <span className="assembl-icon-delete grey" />
                  </Button>
                </OverlayTrigger>
              </div>
            </div>
          );
        }

        return null;
      })}
  </div>
);

export default TokenVoteForProposal;