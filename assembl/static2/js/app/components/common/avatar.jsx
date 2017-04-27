import React from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import Loader from './loader';

class ProfileIcon extends React.Component {
  render() {
    const { debateData } = this.props.debate;
    const { rootPath, connectedUserId, connectedUserName } = this.props.context;
    return (
      <div className="right avatar">
        {!connectedUserId &&
          <Link to={`${rootPath}${debateData.slug}/login?next=${rootPath}${debateData.slug}/home`}>
            <span className="connection">
              <Translate value="navbar.connexion" />
            </span>
          </Link>
        }
        {connectedUserId && connectedUserName && 
            <div>
              <span className="assembl-icon-profil grey">&nbsp;</span>
              <DropdownButton bsStyle="link" title={connectedUserName} id="user-dropdown">
                <LinkContainer to={`${rootPath}${debateData.slug}/profile/${connectedUserName}`}>
                  <MenuItem><Translate value="navbar.profile" /></MenuItem>
                </LinkContainer>
                <MenuItem href={`/logout?next=${rootPath}${debateData.slug}/home`}><Translate value="navbar.logout" /></MenuItem>
              </DropdownButton>
            </div>
        }
      </div>
    );
  };
};

const mapStateToProps = (state) => {
  return {
    debate: state.debate,
    context: state.context
  };
};

export default connect(mapStateToProps)(ProfileIcon);