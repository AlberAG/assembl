import React from 'react';
import { connect } from 'react-redux';
import { isDateExpired } from '../utils/globalFunctions';
import Survey from '../components/debate/survey';
import Thread from '../components/debate/thread';
import TwoColumns from '../components/debate/twoColumns';
import TokenVote from '../components/debate/tokenVote';

class Debate extends React.Component {
  getCurrentStepIdentifier() {
    const currentDate = new Date();
    const { debateData } = this.props.debate;
    let identifier = null;
    debateData.timeline.map((step) => {
      const startDate = new Date(step.start);
      const endDate = new Date(step.end);
      if (isDateExpired(currentDate, startDate) && isDateExpired(endDate, currentDate)) {
        identifier = step.identifier;
      }
      return identifier;
    });
    return identifier || 'Thread';
  }
  render() {
    const currentIdentifier = this.getCurrentStepIdentifier();
    return (
      <div className="debate">
        {currentIdentifier === 'Survey' &&
          <Survey />
        }
        {currentIdentifier === 'Thread' &&
          <Thread />
        }
        {currentIdentifier === 'TwoColumns' &&
          <TwoColumns />
        }
        {currentIdentifier === 'TokenVote' &&
          <TokenVote />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    debate: state.debate
  };
};

export default connect(mapStateToProps)(Debate);