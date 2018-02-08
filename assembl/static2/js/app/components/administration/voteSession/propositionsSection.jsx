import React from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { OverlayTrigger } from 'react-bootstrap';
import { addPropositionTooltip } from '../../common/tooltips';
import SectionTitle from '../sectionTitle';
import PropositionForm from './propositionForm';

const PropositionsSection = () => (
  <div className="admin-box">
    <SectionTitle
      title="Configurer les propositions associées aux modules de vote"
      annotation={I18n.t('administration.annotation')}
    />
    <div className="admin-content">
      <form>
        <OverlayTrigger placement="top" overlay={addPropositionTooltip}>
          <div
            onClick={() => {
              console.log('create a proposition!');
            }}
            className="plus margin-l"
          >
            +
          </div>
        </OverlayTrigger>
      </form>
    </div>
  </div>
);

export default PropositionsSection;