import React from 'react';
import { connect } from 'react-redux';
import Header from './header';

const TextWithHeaderPage = ({ debateData, headerTitle, text }) => {
  return (
    <div className="large-text-paragraph">
      <Header title={headerTitle} imgUrl={debateData.headerBackgroundUrl} />
      <div className="max-container margin-xxl">
        <div className="page-body">
          <div className="ellipsis-content justify">{text}</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    debateData: state.debate.debateData
  };
};

export default connect(mapStateToProps)(TextWithHeaderPage);