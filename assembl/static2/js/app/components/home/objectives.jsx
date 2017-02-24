import React from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-bootstrap';
import MapStateToProps from '../../store/mapStateToProps';

class Objectives extends React.Component {
  render() {
    const { debateData } = this.props.debate;
    const { rootPath } = this.props.context;
    return (
      <section className="objectives-section">
        <Grid fluid className="background-light">
          <div className="max-container">
            <div className="title-section">
              <div className="title-hyphen">&nbsp;</div>
              <h1 className="dark-title-1">
                <Translate value="home.objectivesTitle" />
              </h1>
            </div>
            <div className="content-section">
              <div className="content-margin">
                <Row>
                  <Col xs={12} sm={12} md={6}>
                    <div className="text text-column">{debateData.objectives}</div>
                  </Col>
                  <Col xs={12} sm={6} md={3}>
                    <div className="objectives-img" style={{ backgroundImage: `url(${debateData.config.home.objectives.img1Url})` }}>&nbsp;</div>
                  </Col>
                  <Col xs={12} sm={6} md={3}>
                    <div className="objectives-img" style={{ backgroundImage: `url(${debateData.config.home.objectives.img2Url})` }}>&nbsp;</div>
                  </Col>
                </Row>
              </div>
              <div className="center inline full-size margin-xxl">
                <Link className="button-link button-dark" to={`${rootPath}${debateData.slug}/debate`}>
                  <Translate value="home.accessButton" />
                </Link>
              </div>
            </div>
          </div>
        </Grid>
      </section>
    );
  }
}

export default connect(MapStateToProps)(Objectives);