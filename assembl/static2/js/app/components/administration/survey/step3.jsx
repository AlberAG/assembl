// @flow
import React from 'react';
import { compose, graphql } from 'react-apollo';

import ExportSection from '../exportSection';
import { get } from '../../../utils/routeMap';
import DiscussionPreferenceLanguage from '../../../graphql/DiscussionPreferenceLanguage.graphql';
import withLoadingIndicator from '../../common/withLoadingIndicator';

type Language = {
  locale: string
};

type Props = {
  debateId: string,
  languages: Array<Language>
};

type State = {
  exportLocale: ?string,
  translate: boolean
};

class Step3 extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      exportLocale: null,
      translate: false
    };
  }

  handleExportLocaleChange = (locale: string) => {
    this.setState({ exportLocale: locale });
  };

  handleTranslationChange = (shouldTranslate: boolean) => {
    this.setState({ translate: shouldTranslate });
  };

  render() {
    const { debateId, languages } = this.props;
    const { translate } = this.state;
    const exportLocale = this.state.exportLocale || (languages && languages[0].locale);
    const translation = translate && exportLocale ? `?lang=${exportLocale}` : '?'; // FIXME: using '' instead of '?' does not work
    const exportLink = get('exportSurveyData', { debateId: debateId, translation: translation });
    return (
      <ExportSection
        withLanguageOptions
        handleExportLocaleChange={this.handleExportLocaleChange}
        handleTranslationChange={this.handleTranslationChange}
        exportLink={exportLink}
        translate={translate}
        exportLocale={exportLocale}
        languages={languages}
        annotation="surveyAnnotation"
      />
    );
  }
}
export default compose(
  graphql(DiscussionPreferenceLanguage, {
    options: ({ locale }) => ({
      variables: {
        inLocale: locale
      }
    }),
    props: ({ data }) => {
      if (data.loading) {
        return {
          loading: true
        };
      }

      if (data.error) {
        return {
          hasErrors: true,
          loading: false
        };
      }
      return {
        hasErrors: false,
        languages: data.discussionPreferences.languages
      };
    }
  }),
  withLoadingIndicator()
)(Step3);