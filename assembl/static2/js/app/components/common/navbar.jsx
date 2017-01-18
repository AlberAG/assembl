import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import { Grid, Row, Navbar, Glyphicon } from 'react-bootstrap';
import ProfileIcon from './profileIcon';
import LanguageMenu from './languageMenu';

class NavBar extends React.Component {
  render() {
    const { debateData } = this.props.debate;
    return (
      <Grid fluid>
        <Row>
          <Navbar fixedTop fluid>
            <div className="nav-bar">
              <div className="left burger-menu">
                <div className="black-icon"><Glyphicon glyph="align-justify" /></div>
              </div>
              <div className="left navbar-logo">
                <img src={debateData.logo} alt="logo" />
              </div>
              <div className="left nav-menu">
                <Link className="navbar-item-menu" activeClassName="active" to={`/v2/${debateData.slug}/home`}>
                  <Translate value="navbar.home" />
                </Link>
                <Link className="navbar-item-menu" activeClassName="active" to={`/v2/${debateData.slug}/debate`}>
                  <Translate value="navbar.debate" />
                </Link>
                <Link className="navbar-item-menu" activeClassName="active" to={`/v2/${debateData.slug}/community`}>
                  <Translate value="navbar.community" />
                </Link>
              </div>
              <div className="right">
                <div className="navbar-icons">
                  <div className="white-icon"><Glyphicon glyph="question-sign" /></div>
                  <LanguageMenu />
                  <ProfileIcon />
                </div>
              </div>
            </div>
          </Navbar>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    debate: state.debate
  };
};

export default connect(mapStateToProps)(NavBar);