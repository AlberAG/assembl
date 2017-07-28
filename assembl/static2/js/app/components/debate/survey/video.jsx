import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Grid, Row, Col } from 'react-bootstrap';

class Video extends React.Component {
  render() {
    const { title, descriptionTop, descriptionBottom, descriptionSide, htmlCode } = this.props;
    return (
      <section className="video-section relative">
        {htmlCode &&
          <Grid fluid className="background-light">
            <div className="max-container">
              <div className="video-title-section">
                <div className="title-hyphen">&nbsp;</div>
                <h1 className="dark-title-1">
                  {title || I18n.t('debate.survey.titleVideo')}
                </h1>
              </div>
              <div className="content-section">
                {descriptionTop && 
                  <Row>
                    <Col xs={12} sm={4}>
                      <div className={descriptionSide? "video-description-layer video-left" : "video-description-layer"}>{descriptionTop}</div>
                    </Col>
                  </Row>
                }
                <Row>
                  <Col xs={0} sm={descriptionSide ? 1 : 3} />
                  {descriptionSide &&
                    <Col xs={12} sm={4}>
                      <div className="video-description">
                        <div><span className="assembl-icon-pepite color2">&nbsp;</span></div>
                        <div className="description-txt">{descriptionSide}</div>
                        <div className="box-hyphen left">&nbsp;</div>
                      </div>
                    </Col>}
                  <Col xs={12} sm={descriptionSide ? 5 : 6} className={descriptionSide ? 'video-col' : 'col-centered no-padding'}>
                    <div className="video-container" id="video-vid">
                      <iframe src={htmlCode} frameBorder="0" width="560" height="315" />
                    </div>
                  </Col>
                  <Col xs={0} sm={descriptionSide ? 2 : 3} />
                </Row>
                <Row>
                  {descriptionBottom &&
                    <Col xs={12} sm={4}>
                      <div className={descriptionSide? "video-description-layer video-left" : "video-description-layer"}>{descriptionBottom}</div>
                    </Col>}
                </Row>
              </div>
            </div>
          </Grid>}
      </section>
    );
  }
}

export default Video;