import React from 'react';
import { Translate } from 'react-redux-i18n';
import Ellipsis from '../svg/ellipsis';

class Loader extends React.Component {
  render() {
    return (
      <div className={this.props.textHidden ? 'loader' : 'loader margin-xxl'}>
        <div className={this.props.textHidden ? 'hidden' : ''}><Translate value="loading.wait" /></div>
        <Ellipsis />
      </div>
    );
  }
}

export default Loader;