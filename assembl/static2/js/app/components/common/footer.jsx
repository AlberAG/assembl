import React from 'react';
import { Link } from 'react-router';
import { Translate } from 'react-redux-i18n';
import { Grid } from 'react-bootstrap';
import { connect } from 'react-redux';
import Glyphicon from './glyphicon';

class Footer extends React.Component {
  render() {
    const { debateData } = this.props.debate;
    return (
      <Grid fluid className="background-dark relative">
        <div className="max-container">
          <div className={debateData.socialMedias ? 'footer' : 'footer margin-xl'}>
            {debateData.socialMedias &&
              <div>
                <p><Translate value="footer.socialMedias" /></p>
                <div className="social-medias">
                  {debateData.socialMedias.map((sMedia) => {
                    return (
                      <Link to={sMedia.url} target="_blank" key={sMedia.name}>
                        <Glyphicon glyph={sMedia.name} color="white" size={30} desc={sMedia.name} />
                      </Link>
                    );
                  })}
                </div>
              </div>}
            {debateData.termsOfUseUrl &&
              <div className="terms">
                <Link to={debateData.termsOfUseUrl} target="_blank"><Translate value="footer.terms" /></Link>
              </div>}
            <div className="copyright">
              © <Link to="http://assembl.bluenove.com/" target="_blank">Assembl</Link> powered by{' '}
              <Link to="http://bluenove.com/" target="_blank">bluenove</Link>
            </div>
          </div>
        </div>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    debate: state.debate
  };
};

export default connect(mapStateToProps)(Footer);