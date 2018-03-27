// @flow
import React from 'react';
import addPostExtractMutation from '../../graphql/mutations/addPostExtract.graphql'; // eslint-disable-line
import updateExtractMutation from '../../graphql/mutations/updateExtract.graphql'; // eslint-disable-line
import deleteExtractMutation from '../../graphql/mutations/deleteExtract.graphql'; // eslint-disable-line
import HarvestingAnchor from './harvestingAnchor';
import HarvestingBox from './harvestingBox';

type Props = {
  extracts: Object, // TODO change type
  isHarvesting: boolean,
  cancelHarvesting: Function
};

type State = {
  showHarvestingBox: boolean
};

class HarvestingMenu extends React.Component<void, Props, State> {
  props: Props;

  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      showHarvestingBox: false
    };
  }

  handleClick = (): void => {
    this.setState({
      showHarvestingBox: true
    });
  };

  handleMouseDown = (event: SyntheticMouseEvent) => {
    // This would otherwise clear the selection
    event.preventDefault();
    return false;
  };

  render() {
    const { cancelHarvesting, isHarvesting, extracts } = this.props;
    const { showHarvestingBox } = this.state;
    return (
      <div>
        {extracts && extracts.length > 0 && isHarvesting
          ? extracts.map((extract, index) => (
            <HarvestingBox key={extract.id} cancelHarvesting={cancelHarvesting} extract={extract} index={index} />
          ))
          : null}
        {showHarvestingBox && isHarvesting && <HarvestingBox cancelHarvesting={cancelHarvesting} extract={null} index={0} />}
        {isHarvesting && <HarvestingAnchor handleClick={this.handleClick} handleMouseDown={this.handleMouseDown} />}
      </div>
    );
  }
}

export default HarvestingMenu;