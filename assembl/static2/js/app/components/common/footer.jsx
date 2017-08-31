import React from 'react';
import { Link } from 'react-router';
import { Translate } from 'react-redux-i18n';
import { Grid } from 'react-bootstrap';
import { connect } from 'react-redux';
import Glyphicon from './glyphicon';

class Footer extends React.Component {
  render() {
    const { assemblVersion, debateData } = this.props;
    return (
      <Grid fluid className="background-dark relative" id="footer">
        <div className="max-container">
          <div className={debateData.socialMedias ? 'footer' : 'footer margin-xl'}>
            {debateData.socialMedias &&
              <div>
                <p>
                  <Translate value="footer.socialMedias" />
                </p>
                <div className="social-medias">
                  {debateData.socialMedias.map((sMedia, index) => {
                    return (
                      <Link to={sMedia.url} target="_blank" key={index}>
                        <i className={`assembl-icon-${sMedia.name}-circle`} size={30} />
                      </Link>
                    );
                  })}
                </div>
              </div>}
            {debateData.termsOfUseUrl &&
              <div className="terms">
                <Link to={debateData.termsOfUseUrl} target="_blank">
                  <Translate value="footer.terms" />
                </Link>
              </div>}
            <div className="copyright">
              ©{' '}
              <Link to="http://assembl.bluenove.com/" target="_blank">
                Assembl
              </Link>{' '}
              powered by{' '}
              <Link to="http://bluenove.com/" target="_blank">
                bluenove
              </Link>
            </div>
            {assemblVersion
              ? <div className="assembl-version">
                  v{assemblVersion}
              </div>
              : null}
          </div>
        </div>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    assemblVersion: state.context.assemblVersion,
    debateData: state.debate.debateData
  };
};

export default connect(mapStateToProps)(Footer);