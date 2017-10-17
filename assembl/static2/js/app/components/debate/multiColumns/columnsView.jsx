import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { I18n } from 'react-redux-i18n';

import BoxWithHyphen from '../../common/boxWithHyphen';
import Tree from '../../common/tree';
import { MIN_WIDTH_COLUMN } from '../../../constants';
import { multiColumnMapping } from '../../../utils/mapping';

class ColumnsView extends React.Component {
  orderPostsByMessageClassifier() {
    const { messageColumns, posts } = this.props;
    const columnsArray = {};
    let keyName = '';
    messageColumns.forEach((col) => {
      keyName = col.messageClassifier;
      columnsArray[keyName] = [];
      posts.forEach((post) => {
        if (post.messageClassifier === keyName) {
          columnsArray[keyName].push(post);
        }
      });
    });

    return columnsArray;
  }

  getSynthesisTitle = (classifier, colName) => {
    const { ideaTitle } = this.props;
    const mapping = multiColumnMapping(ideaTitle).columnsView;

    return mapping[classifier] || I18n.t('multiColumns.synthesis.colName', { colName: colName });
  };

  render() {
    const {
      contentLocaleMapping,
      lang,
      messageColumns,
      initialRowIndex,
      InnerComponent,
      InnerComponentFolded,
      noRowsRenderer,
      SeparatorComponent,
      isColumnViewInline
    } = this.props;
    const columnsArray = this.orderPostsByMessageClassifier();
    const noSynthesis = messageColumns.every((col) => {
      return col.header && col.header.length < 1;
    });

    return (
      <Grid fluid className="background-grey no-padding">
        <div className="max-container">
          <div className="columns-view">
            <Row className={isColumnViewInline ? 'columns-view-inline' : ''}>
              {Object.keys(columnsArray).map((classifier, index) => {
                const synthesisTitle = this.getSynthesisTitle(classifier, messageColumns[index].name);
                const synthesisBody = messageColumns[index].header || I18n.t('multiColumns.synthesis.noSynthesisYet');
                const hyphenStyle = { borderTopColor: messageColumns[index].color };
                return (
                  <Col
                    xs={12}
                    md={12 / Object.keys(columnsArray).length}
                    key={`col-${classifier}`}
                    style={isColumnViewInline ? { width: `${MIN_WIDTH_COLUMN}px` } : {}}
                  >
                    {!noSynthesis
                      ? <div id={`synthesis-${classifier}`} className="box synthesis">
                        <Row className="no-margin">
                          <div className="posts column-post">
                            <Col xs={12} md={11} className="post-left">
                              <BoxWithHyphen
                                additionalContainerClassNames="column-synthesis"
                                title={synthesisTitle}
                                body={synthesisBody}
                                hyphenStyle={hyphenStyle}
                              />
                            </Col>
                            <Col xs={12} md={1} className="post-right">
                              <div className="post-icons">
                                <span className="assembl-icon-share color" />
                              </div>
                              <div className="clear">&nbsp;</div>
                            </Col>
                          </div>
                        </Row>
                      </div>
                      : null}

                    <Tree
                      contentLocaleMapping={contentLocaleMapping}
                      lang={lang}
                      data={columnsArray[classifier]}
                      initialRowIndex={initialRowIndex}
                      InnerComponent={InnerComponent}
                      InnerComponentFolded={InnerComponentFolded}
                      noRowsRenderer={noRowsRenderer}
                      SeparatorComponent={SeparatorComponent}
                    />
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
      </Grid>
    );
  }
}

export default ColumnsView;