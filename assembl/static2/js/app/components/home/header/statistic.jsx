// @flow
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { Translate } from 'react-redux-i18n';
import RootIdeaStats from '../../../graphql/RootIdeaStats.graphql';
import withLoadingIndicator from '../../../components/common/withLoadingIndicator';

const indexIsLast = (index, array) => {
  return index === array.length - 1;
};

class Statistic extends React.Component {
  static Element = ({ iconName, count, translateValue, isLast, width }) => {
    return (
      <div
        className={`inline${isLast ? '' : ' border-right'}`}
        style={{
          width: width
        }}
      >
        <div className="stat-box">
          <div className={`stat-icon assembl-icon-${iconName} white`}>&nbsp;</div>
          <div className="stat">
            <div className="stat-nb">{count}&nbsp;</div>
            <div className="stat-nb">
              <Translate value={translateValue} />
            </div>
          </div>
        </div>
      </div>
    );
  };
  static mapElementsPropsToComponents = (elemsProps) => {
    return elemsProps.map((elementProps, index, array) => {
      const elementsWidth = `${100 / array.length}%`;
      return <Statistic.Element key={index} {...elementProps} width={elementsWidth} isLast={indexIsLast(index, array)} />;
    });
  };
  render() {
    const { rootIdea, numParticipants, totalSentiments } = this.props.data;
    const elementsProps = [
      { iconName: 'sentiment-neutral', count: totalSentiments, translateValue: 'home.sentiments' },
      { iconName: 'profil', count: numParticipants, translateValue: 'home.participant' }
    ];
    if (rootIdea) {
      elementsProps.push({
        iconName: 'message',
        count: rootIdea.numPosts,
        translateValue: 'home.contribution'
      });
    }
    return (
      <div className="statistic">
        <div className="intermediary-container">{Statistic.mapElementsPropsToComponents(elementsProps)}</div>
      </div>
    );
  }
}

export default compose(graphql(RootIdeaStats), withLoadingIndicator({ textHidden: true, color: 'white' }))(Statistic);