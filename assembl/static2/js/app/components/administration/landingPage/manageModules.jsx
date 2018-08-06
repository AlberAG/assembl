// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { I18n, Translate } from 'react-redux-i18n';
import type { List, Map } from 'immutable';
import { Button } from 'react-bootstrap';
import { displayModal, closeModal } from '../../../utils/utilityManager';
import ModulesPreview from './modulesPreview';
import SectionTitle from '../../administration/sectionTitle';
import SelectModulesForm from './selectModulesForm';
import {
  toggleLandingPageModule,
  moveLandingPageModuleDown,
  moveLandingPageModuleUp,
  createLandingPageModules
} from '../../../actions/adminActions/landingPage';
import { createRandomId } from '../../../utils/globalFunctions';

type Props = {
  enabledModules: List<Map>,
  moduleTypes: Array<Object>,
  locale: string,
  modulesById: Map<string, Map>,
  moveModuleDown: Function,
  moveModuleUp: Function,
  toggleModule: Function,
  createModule: Function
};
export const DumbManageModules = ({
  enabledModules,
  moduleTypes,
  locale,
  modulesById,
  moveModuleDown,
  moveModuleUp,
  toggleModule,
  createModule
}: Props) => {
  const displayConfirmationModal = () => {
    const body = <Translate value="administration.landingPage.manageModules.confirmationModal" />;
    const footer = [
      <Button key="cancel" id="cancel-deleting-button" onClick={closeModal} className="button-cancel button-dark">
        <Translate value="cancel" />
      </Button>,
      <Button
        key="add"
        id="confirm-add-tm-button"
        onClick={() => {
          createModule(enabledModules.size - 2);
          closeModal();
        }}
        className="button-submit button-dark"
      >
        <Translate value="validate" />
      </Button>
    ];
    const includeFooter = true;
    return displayModal(null, body, includeFooter, footer);
  };
  return (
    <div className="admin-box">
      <SectionTitle
        title={I18n.t('administration.landingPage.manageModules.title')}
        annotation={I18n.t('administration.annotation')}
      />
      <div className="admin-content form-container" style={{ maxWidth: '700px' }}>
        <p className="admin-paragraph">
          <Translate value="administration.landingPage.manageModules.helper" />
        </p>
        <div className="two-columns-admin">
          <div className="column-left">
            <SelectModulesForm lang={locale} moduleTypes={moduleTypes} modulesById={modulesById} toggleModule={toggleModule} />
            <div className="margin-xl">
              <Button className="button-submit button-dark" onClick={displayConfirmationModal}>
                <Translate value="administration.landingPage.manageModules.textAndMultimediaBtn" />
              </Button>
            </div>
          </div>
          <div className="column-right">
            <ModulesPreview modules={enabledModules} moveModuleDown={moveModuleDown} moveModuleUp={moveModuleUp} />
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  const { enabledModulesInOrder, modulesById, modulesInOrder } = state.admin.landingPage;
  return {
    enabledModules: enabledModulesInOrder.map(id => modulesById.get(id)),
    modulesById: modulesById,
    moduleTypes: modulesInOrder
      .map((id) => {
        let module = modulesById.get(id);
        module = module.setIn(['moduleType', 'moduleId'], id);
        return module.get('moduleType');
      })
      .toJS()
  };
};
const mapDispatchToProps = dispatch => ({
  moveModuleDown: id => dispatch(moveLandingPageModuleDown(id)),
  moveModuleUp: id => dispatch(moveLandingPageModuleUp(id)),
  toggleModule: id => dispatch(toggleLandingPageModule(id)),
  createModule: (nextOrder, identifier = 'INTRODUCTION') => {
    const newId = createRandomId();
    return dispatch(createLandingPageModules(newId, identifier, nextOrder));
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(DumbManageModules);