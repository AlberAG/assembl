// @flow
import React from 'react';
import { connect } from 'react-redux';
import { I18n, Translate } from 'react-redux-i18n';
import range from 'lodash/range';
import { SplitButton, MenuItem, Radio } from 'react-bootstrap';
import Helper from '../../common/helper';
import { getEntryValueForLocale } from '../../../utils/i18n';
import FormControlWithLabel from '../../common/formControlWithLabel';
import NumberGaugeForm from './numberGaugeForm';
import TextGaugeForm from './textGaugeForm';
import {
  updateGaugeVoteInstructions,
  updateGaugeVoteNbTicks,
  updateGaugeVoteIsNumber
} from '../../../actions/adminActions/voteSession';

type GaugeFormProps = {
  id: string,
  editLocale: string,
  instructions: string,
  nbTicks: number,
  isNumberGauge: boolean,
  handleInstructionsChange: Function,
  handleNbTicksSelectChange: Function,
  handleNumberGaugeCheck: Function,
  handleNumberGaugeUncheck: Function
};

const DumbGaugeForm = ({
  id,
  editLocale,
  instructions,
  nbTicks,
  isNumberGauge,
  handleInstructionsChange,
  handleNbTicksSelectChange,
  handleNumberGaugeCheck,
  handleNumberGaugeUncheck
}: GaugeFormProps) => (
  <div className="gauges-vote-form">
    <div className="flex">
      <FormControlWithLabel
        value={instructions}
        label={I18n.t('administration.gaugeVoteInstructions')}
        required
        type="text"
        onChange={handleInstructionsChange}
      />
      <Helper
        helperUrl="/static2/img/helpers/helper6.png"
        helperText={I18n.t('administration.helpers.gaugeVoteInstructions')}
        additionalTextClasses="helper-text-only"
      />
    </div>
    <div className="flex">
      <label htmlFor={`dropdown-${id}`}>
        <Translate value="administration.nbTicks" />
      </label>
      <Helper helperUrl="/static2/img/helpers/helper2.png" helperText={'administration.nbTicksHelper'} />
    </div>
    <SplitButton
      title={nbTicks}
      id={`dropdown-${id}`}
      required
      onSelect={(eventKey) => {
        handleNbTicksSelectChange(eventKey);
      }}
    >
      {range(10).map(value => (
        <MenuItem key={`gauge-notch-${value + 1}`} eventKey={value + 1}>
          {value + 1}
        </MenuItem>
      ))}
    </SplitButton>
    <Radio onChange={handleNumberGaugeUncheck} checked={!isNumberGauge}>
      <Translate value="administration.textValue" />
    </Radio>
    <Radio onChange={handleNumberGaugeCheck} checked={isNumberGauge}>
      <Translate value="administration.numberValue" />
    </Radio>
    {isNumberGauge ? <NumberGaugeForm id={id} editLocale={editLocale} /> : <TextGaugeForm id={id} editLocale={editLocale} />}
    <div className="separator" />
  </div>
);

const mapStateToProps = (state, { id, editLocale }) => {
  const module = state.admin.voteSession.modulesById.get(id);
  const instructions = getEntryValueForLocale(module.get('instructionsEntries'), editLocale);
  return {
    instructions: instructions,
    nbTicks: module.get('nbTicks'),
    isNumberGauge: module.get('isNumberGauge')
  };
};

const mapDispatchToProps = (dispatch, { id, editLocale }) => ({
  handleInstructionsChange: e => dispatch(updateGaugeVoteInstructions(id, editLocale, e.target.value)),
  handleNbTicksSelectChange: value => dispatch(updateGaugeVoteNbTicks(id, value)),
  handleNumberGaugeCheck: () => dispatch(updateGaugeVoteIsNumber(id, true)),
  handleNumberGaugeUncheck: () => dispatch(updateGaugeVoteIsNumber(id, false))
});

export { DumbGaugeForm };

export default connect(mapStateToProps, mapDispatchToProps)(DumbGaugeForm);