import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';

import TextWithHeaderPage from '../components/common/textWithHeaderPage';
import withLoadingIndicator from '../components/common/withLoadingIndicator';
import TermsAndLegalNotice from '../graphql/TermsAndLegalNotice.graphql';

const mapStateToProps = (state) => {
  return {
    lang: state.i18n.locale
  };
};

const withData = graphql(TermsAndLegalNotice, {
  props: ({ data }) => {
    if (data.loading) {
      return {
        loading: true
      };
    }

    if (data.error) {
      return {
        hasError: true
      };
    }

    return {
      hasError: data.error,
      loading: data.loading,
      text: data.legalNoticeAndTerms.legalNotice || '',
      headerTitle: I18n.t('legalNotice.headerTitle')
    };
  }
});

export default compose(connect(mapStateToProps), withData, withLoadingIndicator())(TextWithHeaderPage);