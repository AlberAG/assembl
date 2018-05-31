// @flow
/* eslint-disable  react/no-unused-prop-types */
import * as React from 'react';
import { I18n, Translate } from 'react-redux-i18n';
import { Link } from 'react-router';
import { FormGroup, Radio, FormControl } from 'react-bootstrap';
import SectionTitle from './sectionTitle';

type ExportSectionProps = {
  languages?: Array<Object>,
  handleTranslationChange?: (shouldTranslate: boolean) => void,
  handleExportLocaleChange?: (locale: string) => void,
  withLanguageOptions?: boolean,
  exportLink: string,
  exportLocale?: string,
  translate?: boolean,
  annotation: string
};

type ExportLanguageDropDownProps = {
  languages?: Array<Object>,
  onSelect: Function,
  activeKey?: string
};

class ExportSection extends React.Component<ExportSectionProps> {
  static defaultProps = {
    handleTranslationChange: undefined,
    handleExportLocaleChange: undefined,
    languages: undefined,
    withLanguageOptions: false,
    exportLocale: undefined,
    translate: false,
    annotation: 'defaultAnnotation'
  };

  static ExportLanguageDropDown = ({ languages, onSelect, activeKey }: ExportLanguageDropDownProps) => {
    const activeLanguage = languages ? languages.filter(language => language.locale === activeKey)[0] : null;
    return (
      <FormControl
        className="export-language-dropdown"
        componentClass="select"
        onChange={({ target: { value } }) => {
          onSelect(value);
        }}
        value={activeLanguage ? activeLanguage.locale : null}
      >
        {languages &&
          languages.map(lang => (
            <option key={`locale-${lang.locale}`} value={lang.locale}>
              {lang.name}
            </option>
          ))}
      </FormControl>
    );
  };

  render() {
    const {
      languages,
      handleTranslationChange,
      handleExportLocaleChange,
      withLanguageOptions,
      exportLink,
      translate,
      exportLocale,
      annotation
    } = this.props;
    return (
      <div className="admin-box admin-export-section">
        <SectionTitle
          title={I18n.t('administration.export.sectionTitle')}
          annotation={I18n.t(`administration.export.${annotation}`)}
        />
        <div className="admin-content">
          {withLanguageOptions &&
            handleTranslationChange &&
            handleExportLocaleChange && (
              <FormGroup>
                <Radio
                  checked={!translate}
                  onChange={() => {
                    handleTranslationChange(false);
                  }}
                >
                  <Translate value="administration.export.noExportLanguage" />
                </Radio>
                <Radio
                  checked={translate}
                  onChange={() => {
                    handleTranslationChange(true);
                  }}
                >
                  <Translate value="administration.export.translateTheMessagesIn" />
                  {translate && (
                    <ExportSection.ExportLanguageDropDown
                      languages={languages}
                      onSelect={handleExportLocaleChange}
                      activeKey={exportLocale}
                    />
                  )}
                </Radio>
              </FormGroup>
            )}

          <br />
          <Link className="button-link button-dark margin-l" href={exportLink}>
            <Translate value="administration.export.link" />
          </Link>
        </div>
      </div>
    );
  }
}

export default ExportSection;