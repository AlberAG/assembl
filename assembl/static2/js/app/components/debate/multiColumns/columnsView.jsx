import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Tree from '../../common/tree';

class ColumnsView extends React.Component {
  orderPostsByMessageClassifier(posts) {
    const columnsArray = {};
    let keyName = '';
    posts.forEach((post) => {
      keyName = post.messageClassifier;
      columnsArray[keyName] = [];
    });

    posts.forEach((post) => {
      keyName = post.messageClassifier;
      columnsArray[keyName].push({ ...post });
    });

    return columnsArray;
  }
  render() {
    const {
      contentLocaleMapping,
      lang,
      data,
      initialRowIndex,
      InnerComponent,
      InnerComponentFolded,
      noRowsRenderer,
      SeparatorComponent
    } = this.props;
    const columnsArray = this.orderPostsByMessageClassifier(data);
    return (
      <Grid fluid className="background-grey no-padding">
        <div className="max-container">
          <div className="columns-view">
            <Row>
              {Object.keys(columnsArray).map((classifier, index) => {
                return (
                  <Col xs={12} md={12 / Object.keys(columnsArray).length} key={`col-${index}`}>
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