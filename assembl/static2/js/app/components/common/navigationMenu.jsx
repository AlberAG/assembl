import React from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import { Link } from 'react-router';
import { Routes } from '../../routes'; 

class NavigationMenu extends React.Component {
  render() {
    const { debateData } = this.props.debate;
    //TODO: When turnling url into Link, do not forget activeClassName="active"
    return (
      <div>
        <a className='navbar-menu-item' href={Routes.getFullPath('oldDebate', {slug: debateData.slug})}>
          <Translate value="navbar.debate" />
        </a>
        <Link className="navbar-menu-item" activeClassName="active"
              to={Routes.get('community', {slug: debateData.slug})}>
          <Translate value="navbar.community" />
        </Link>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    debate: state.debate
  };
};

export default connect(mapStateToProps)(NavigationMenu);