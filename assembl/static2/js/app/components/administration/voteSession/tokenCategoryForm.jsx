// @flow
import React from 'react';
import { connect } from 'react-redux';
import { I18n, Translate } from 'react-redux-i18n';
import { BlockPicker as ColorPicker } from 'react-color';
import { getEntryValueForLocale } from '../../../utils/i18n';
import FormControlWithLabel from '../../common/formControlWithLabel';
import {
  updateTokenVoteCategoryTitle,
  updateTokenVoteCategoryColor,
  updateTokenTotalNumber
} from '../../../actions/adminActions/voteSession';
import { pickerColors } from '../../../constants';

type TokenCategoryFormProps = {
  title: string,
  color: string,
  totalNumber: number,
  index: number,
  handleTitleChange: Function,
  handleColorChange: Function,
  handleNumberChange: Function,
  tokenCategoryNumber: number
};

const DumbTokenCategoryForm = ({
  title,
  color,
  totalNumber,
  index,
  handleTitleChange,
  handleColorChange,
  handleNumberChange,
  tokenCategoryNumber
}: TokenCategoryFormProps) => (
  <div className="token-type-form">
    <Translate value="administration.token" number={index + 1} />
    <div className="margin-m">
      <FormControlWithLabel
        label={I18n.t('administration.tokenTitle')}
        required
        type="text"
        onChange={handleTitleChange}
        value={title}
      />
      <FormControlWithLabel
        label={I18n.t('administration.tokenNumber')}
        required
        type="number"
        onChange={handleNumberChange}
        value={totalNumber}
        formControlProps={{
          min: '1'
        }}
      />
      <label htmlFor="color-picker">{I18n.t('administration.tokenColor')}</label>
      <ColorPicker
        colors={pickerColors}
        onChange={handleColorChange}
        color={color}
        width="400px"
        id="color-picker"
        triangle="hide"
        className="no-box-shadow"
      />
    </div>
    {index + 1 !== tokenCategoryNumber && <div className="separator" />}
  </div>
);

const mapStateToProps = (state, { id, editLocale }) => {
  const { tokenCategoriesById } = state.admin.voteSession;
  const tokenCategory = tokenCategoriesById.get(id);
  const title = getEntryValueForLocale(tokenCategory.get('titleEntries'), editLocale);
  return {
    title: title,
    color: tokenCategory.get('color'),
    totalNumber: tokenCategory.get('totalNumber')
  };
};

const mapDispatchToProps = (dispatch, { moduleId, id, editLocale }) => ({
  handleTitleChange: e => dispatch(updateTokenVoteCategoryTitle(id, editLocale, e.target.value, moduleId)),
  handleNumberChange: (e) => {
    if (e.target.value > 0) {
      dispatch(updateTokenTotalNumber(id, e.target.value, moduleId));
    }
  },
  handleColorChange: color => dispatch(updateTokenVoteCategoryColor(id, color.hex, moduleId))
});

export { DumbTokenCategoryForm };

export default connect(mapStateToProps, mapDispatchToProps)(DumbTokenCategoryForm);