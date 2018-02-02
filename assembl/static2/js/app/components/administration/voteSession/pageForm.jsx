// @flow
import React from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { FormGroup } from 'react-bootstrap';
import SectionTitle from '../sectionTitle';
import FormControlWithLabel from '../../common/formControlWithLabel';
import FileUploader from '../../common/fileUploader';
import TextWithHelper from '../../common/textWithHelper';
import { getEntryValueForLocale } from '../../../utils/i18n';
import {
  updateVoteSessionPageTitle,
  updateVoteSessionPageSubtitle,
  updateVoteSessionHeaderImage,
  updateVoteSessionPageInstructionsTitle,
  updateVoteSessionPageInstructionsContent,
  updateVoteSessionPagePropositionsTitle
} from '../../../actions/adminActions/voteSession';

type PageFormProps = {
  headerTitle: string,
  headerSubtitle: string,
  headerImgUrl: string,
  headerImgMimeType: string,
  instructionsTitle: string,
  instructionsContent: string,
  propositionSectionTitle: string,
  editLocale: string,
  handleHeaderTitleChange: Function,
  handleHeaderSubtitleChange: Function,
  handleHeaderImageChange: Function,
  handleInstructionsTitleChange: Function,
  handleInstructionsContentChange: Function,
  handlePropositionSectionTitleChange: Function
};

const PageForm = ({
  headerTitle,
  headerSubtitle,
  headerImgUrl,
  headerImgMimeType,
  instructionsTitle,
  instructionsContent,
  propositionSectionTitle,
  editLocale,
  handleHeaderTitleChange,
  handleHeaderSubtitleChange,
  handleHeaderImageChange,
  handleInstructionsTitleChange,
  handleInstructionsContentChange,
  handlePropositionSectionTitleChange
}: PageFormProps) => {
  const editLocaleInUppercase = editLocale.toUpperCase();
  const headerTitlePh = `${I18n.t('administration.ph.headerTitle')} ${editLocaleInUppercase}*`;
  const headerSubtitlePh = `${I18n.t('administration.ph.headerSubtitle')} ${editLocaleInUppercase}`;
  const instructionsTitlePh = `${I18n.t('administration.ph.instructionsTitle')} ${editLocaleInUppercase}*`;
  const instructionsContentPh = `${I18n.t('administration.ph.instructionsContent')} ${editLocaleInUppercase}*`;
  const propositionSectionTitlePh = `${I18n.t('administration.ph.propositionSectionTitle')} ${editLocaleInUppercase}*`;
  const headerImageFieldName = 'header-image';
  return (
    <div className="admin-box">
      <SectionTitle title={I18n.t('administration.voteSession.0')} annotation={I18n.t('administration.annotation')} />
      <div className="admin-content">
        <div className="form-container">
          <form>
            <TextWithHelper
              text={I18n.t('administration.headerTitle')}
              helperUrl="/static2/img/helpers/helper1.png"
              helperText={I18n.t('administration.helpers.voteSessionHeader')}
              classname="title"
            />
            <FormControlWithLabel
              label={headerTitlePh}
              onChange={handleHeaderTitleChange}
              required
              type="text"
              value={headerTitle}
            />
            <FormControlWithLabel
              label={headerSubtitlePh}
              onChange={handleHeaderSubtitleChange}
              type="text"
              value={headerSubtitle}
            />
            <FormGroup>
              <FileUploader
                mimeType={headerImgMimeType}
                name={headerImageFieldName}
                fileOrUrl={headerImgUrl}
                handleChange={handleHeaderImageChange}
                withPreview
              />
            </FormGroup>
          </form>
          <div className="separator" />
          <TextWithHelper
            text={I18n.t('administration.instructions')}
            helperUrl="/static2/img/helpers/helper2.png"
            helperText={I18n.t('administration.helpers.voteSessionInstructions')}
            classname="title"
          />
          <FormControlWithLabel
            label={instructionsTitlePh}
            onChange={handleInstructionsTitleChange}
            type="text"
            value={instructionsTitle}
          />
          <FormControlWithLabel
            key={`instructions-${editLocale}`}
            label={instructionsContentPh}
            onChange={handleInstructionsContentChange}
            type="rich-text"
            value={instructionsContent}
          />
          <div className="separator" />
          <TextWithHelper
            text={I18n.t('administration.propositionSectionTitle')}
            helperUrl="/static2/img/helpers/helper3.png"
            helperText={I18n.t('administration.helpers.voteSessionPropositionSection')}
            classname="title"
          />
          <FormControlWithLabel
            label={propositionSectionTitlePh}
            onChange={handlePropositionSectionTitleChange}
            required
            type="text"
            value={propositionSectionTitle}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, { editLocale }) => {
  const voteSession = state.admin.voteSession.page;
  const instructionsContent = getEntryValueForLocale(voteSession.get('instructionsSectionContentEntries'), editLocale);
  return {
    headerTitle: getEntryValueForLocale(voteSession.get('titleEntries'), editLocale),
    headerSubtitle: getEntryValueForLocale(voteSession.get('subTitleEntries'), editLocale),
    instructionsTitle: getEntryValueForLocale(voteSession.get('instructionsSectionTitleEntries'), editLocale),
    instructionsContent: instructionsContent ? instructionsContent.toJS() : null,
    propositionSectionTitle: getEntryValueForLocale(voteSession.get('propositionsSectionTitleEntries'), editLocale),
    headerImgUrl: voteSession.getIn(['headerImage', 'externalUrl']),
    headerImgMimeType: voteSession.getIn(['headerImage', 'mimeType'])
  };
};

const mapDispatchToProps = (dispatch, { editLocale }) => ({
  handleHeaderTitleChange: e => dispatch(updateVoteSessionPageTitle(editLocale, e.target.value)),
  handleHeaderSubtitleChange: e => dispatch(updateVoteSessionPageSubtitle(editLocale, e.target.value)),
  handleHeaderImageChange: value => dispatch(updateVoteSessionHeaderImage(value)),
  handleInstructionsTitleChange: e => dispatch(updateVoteSessionPageInstructionsTitle(editLocale, e.target.value)),
  handleInstructionsContentChange: value => dispatch(updateVoteSessionPageInstructionsContent(editLocale, value)),
  handlePropositionSectionTitleChange: e => dispatch(updateVoteSessionPagePropositionsTitle(editLocale, e.target.value))
});

export default connect(mapStateToProps, mapDispatchToProps)(PageForm);