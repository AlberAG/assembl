// @flow
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { I18n } from 'react-redux-i18n';
import ParticipantsCount from './participantsCount';
import TokenVotesResults from './tokenVotesResults';
import GaugeVotesResults from './gaugeVotesResults';
import {
  findTokenVoteModule,
  filterGaugeVoteModules,
  filterNumberGaugeVoteModules,
  type VoteSpecification
} from '../../pages/voteSession';

type Props = {
  modules: Array<VoteSpecification>,
  numParticipants: number
};

const getNumberBoxToDisplay: Function = (tokens, gauges) => {
  const gaugesLength = gauges ? gauges.length : 0;
  const count = tokens.length ? 2 : 1;
  return count + gaugesLength;
};

const getColumnSizes: Function = (numberBoxToDisplay) => {
  switch (numberBoxToDisplay) {
  case 1:
    return [12];
  case 2:
    return [6, 6];
  case 3:
    return [4, 4, 4];
  case 4:
    return [6, 6, 6, 6];
  case 5:
    return [6, 6, 4, 4, 4];
  case 6:
    return [4, 4, 4, 4, 4, 4];
  default:
    return [12];
  }
};

const VotesInProgress = ({ modules, numParticipants }: Props) => {
  const tokenVoteModule = modules ? findTokenVoteModule(modules) : null;
  const tokenCategories = tokenVoteModule ? tokenVoteModule.tokenCategories : [];
  const textGauges = filterGaugeVoteModules(modules);
  const numberGauges = filterNumberGaugeVoteModules(modules);
  const allGauges = [...textGauges, ...numberGauges];
  const numberBoxToDisplay: number = getNumberBoxToDisplay(tokenCategories, allGauges);
  const columnSizes: Array<number> = getColumnSizes(numberBoxToDisplay);
  let index = tokenVoteModule ? 2 : 0;
  return (
    <Row className="votes-in-progress background-grey">
      <Col xs={12} md={columnSizes[0]}>
        <ParticipantsCount count={numParticipants} />
      </Col>
      {tokenVoteModule &&
        tokenCategories.length > 0 && (
          <Col xs={12} md={columnSizes[1]}>
            <TokenVotesResults
              categories={tokenCategories}
              tokenVotes={tokenVoteModule.tokenVotes}
              numVotes={tokenVoteModule.numVotes}
              titleMsgId="debate.voteSession.currentTokenDistribution"
            />
          </Col>
        )}
      {textGauges.map((gauge) => {
        const colSize = columnSizes[index];
        index += 1;
        const title = gauge.averageLabel || '';
        return (
          <Col xs={12} md={colSize} key={gauge.id}>
            <GaugeVotesResults title={title} instructions={gauge.instructions} />
          </Col>
        );
      })}
      {numberGauges.map((gauge) => {
        const colSize = columnSizes[index];
        index += 1;
        const title = I18n.t('debate.voteSession.valueWithUnit', { num: gauge.averageResult, unit: gauge.unit || '' });
        return (
          <Col xs={12} md={colSize} key={gauge.id}>
            <GaugeVotesResults title={title} instructions={gauge.instructions} />
          </Col>
        );
      })}
    </Row>
  );
};

export default VotesInProgress;