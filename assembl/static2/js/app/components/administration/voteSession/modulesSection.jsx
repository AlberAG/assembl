// @flow
import React from 'react';
import { I18n, Translate } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Checkbox, SplitButton, MenuItem, Radio } from 'react-bootstrap';
import range from 'lodash/range';
import SectionTitle from '../sectionTitle';
import Helper from '../../common/helper';
import TokensForm from './tokensForm';
import GaugeForm from './gaugeForm';
import {
  createTokenVoteModule,
  createGaugeVoteModule,
  deleteVoteModule,
  updateVoteSessionPageSeeCurrentVotes
} from '../../../actions/adminActions/voteSession';

type ModulesSectionProps = {
  tokenModules: Object,
  gaugeModules: Object,
  editLocale: string,
  handleTokenCheckBoxChange: Function,
  handleGaugeCheckBoxChange: Function,
  handleGaugeSelectChange: Function,
  handleSeeCurrentVotesChange: Function,
  seeCurrentVotes: boolean
};

const DumbModulesSection = ({
  tokenModules,
  editLocale,
  handleTokenCheckBoxChange,
  gaugeModules,
  handleGaugeCheckBoxChange,
  handleGaugeSelectChange,
  handleSeeCurrentVotesChange,
  seeCurrentVotes
}: ModulesSectionProps) => {
  const tokenModuleChecked = tokenModules.size > 0;
  const gaugeModuleChecked = gaugeModules.size > 0;
  const tModule = tokenModules.toJS();
  const gModule = gaugeModules.toJS();
  const newId = Math.round(Math.random() * -1000000).toString();

  return (
    <div className="admin-box">
      <SectionTitle title={I18n.t('administration.voteSession.1')} annotation={I18n.t('administration.annotation')} />
      <div className="admin-content">
        <div className="form-container">
          <div className="vote-modules-form">
            <Checkbox
              checked={tokenModuleChecked}
              onChange={() => {
                handleTokenCheckBoxChange(tokenModuleChecked, tModule[0], newId);
              }}
            >
              <Helper
                label={I18n.t('administration.voteWithTokens')}
                helperUrl="/static2/img/helpers/helper4.png"
                helperText={I18n.t('administration.tokenVoteCheckbox')}
                classname="inline checkbox-title"
              />
            </Checkbox>
            {tokenModules.map(id => <TokensForm key={id} id={id} editLocale={editLocale} />)}
            <Checkbox
              checked={gaugeModuleChecked}
              onChange={() => {
                handleGaugeCheckBoxChange(gaugeModuleChecked, gModule, newId);
              }}
            >
              <Helper
                label={I18n.t('administration.voteWithGauges')}
                helperUrl="/static2/img/helpers/helper3.png" // TODO: add an actual screenshot
                helperText={I18n.t('administration.gaugeVoteCheckbox')}
                classname="inline checkbox-title"
              />
            </Checkbox>
            {gaugeModuleChecked ? (
              <div>
                <div className="flex">
                  <label htmlFor="input-dropdown-addon">
                    <Translate value="administration.gaugeNumber" />
                  </label>
                  <Helper helperUrl="/static2/img/helpers/helper2.png" helperText={I18n.t('administration.defineGaugeNumer')} />
                </div>
                <SplitButton
                  title={gaugeModules.size}
                  id="input-dropdown-addon"
                  required
                  onSelect={(eventKey) => {
                    handleGaugeSelectChange(eventKey, gaugeModules.size, newId, gModule);
                  }}
                >
                  {range(10).map(value => (
                    <MenuItem key={`gauge-item-${value + 1}`} eventKey={value + 1}>
                      {value + 1}
                    </MenuItem>
                  ))}
                </SplitButton>
              </div>
            ) : null}
            {gaugeModules.map((id, index) => <GaugeForm key={id} index={index} id={id} editLocale={editLocale} />)}
            <div className="margin-m">
              <label htmlFor="seeCurrentVotes">
                <Translate value="administration.seeCurrentVotes" />
              </label>
              <Radio
                id="seeCurrentVotes"
                onChange={() => {
                  handleSeeCurrentVotesChange(true);
                }}
                checked={seeCurrentVotes}
                name="seeCurrentVotes"
              >
                <Translate value="yes" />
              </Radio>
              <Radio
                onChange={() => {
                  handleSeeCurrentVotesChange(false);
                }}
                checked={!seeCurrentVotes}
                name="seeCurrentVotes"
              >
                <Translate value="no" />
              </Radio>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ admin }) => {
  const { modulesInOrder, modulesById, page } = admin.voteSession;
  const { editLocale } = admin;
  return {
    tokenModules: modulesInOrder.filter(
      id => modulesById.getIn([id, 'type']) === 'tokens' && !modulesById.getIn([id, '_toDelete'])
    ),
    gaugeModules: modulesInOrder.filter(
      id => modulesById.getIn([id, 'type']) === 'gauge' && !modulesById.getIn([id, '_toDelete'])
    ),
    editLocale: editLocale,
    seeCurrentVotes: page.get('seeCurrentVotes')
  };
};

const mapDispatchToProps = dispatch => ({
  handleTokenCheckBoxChange: (checked, id, newId) => {
    if (!checked) {
      dispatch(createTokenVoteModule(newId));
    } else {
      dispatch(deleteVoteModule(id));
    }
  },
  handleGaugeCheckBoxChange: (checked, idArray, newId) => {
    if (!checked) {
      dispatch(createGaugeVoteModule(newId));
    } else {
      idArray.forEach((id) => {
        dispatch(deleteVoteModule(id));
      });
    }
  },
  handleGaugeSelectChange: (selectedNumber, gaugeNumber, newId, idArray) => {
    if (selectedNumber > gaugeNumber) {
      const numberToCreate = selectedNumber - gaugeNumber;
      for (let i = 0; i < numberToCreate; i += 1) {
        dispatch(createGaugeVoteModule(newId + i));
      }
    } else {
      idArray.forEach((id, index) => {
        const numberToDelete = gaugeNumber - selectedNumber;
        if (numberToDelete > index) {
          dispatch(deleteVoteModule(id));
        }
      });
    }
  },
  handleSeeCurrentVotesChange: checked => dispatch(updateVoteSessionPageSeeCurrentVotes(checked))
});

export { DumbModulesSection };

export default connect(mapStateToProps, mapDispatchToProps)(DumbModulesSection);